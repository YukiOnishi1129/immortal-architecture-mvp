import { asc, eq, inArray, sql } from "drizzle-orm";
import { db } from "../client/database";
import { fields, notes, templates } from "../client/database/schema";
import { Template } from "../domain/template/template.entity";
import type { ITemplateRepository } from "../domain/template/template.repository.interface";

export class TemplateRepository implements ITemplateRepository {
  async findById(id: string): Promise<Template | null> {
    const results = await db
      .select()
      .from(templates)
      .where(eq(templates.id, id))
      .limit(1);

    const template = results[0];
    if (!template) return null;

    const templateFields = await db
      .select()
      .from(fields)
      .where(eq(fields.templateId, id))
      .orderBy(asc(fields.order));

    return Template.create({
      id: template.id,
      name: template.name,
      ownerId: template.ownerId,
      fields: templateFields.map((f) => ({
        id: f.id,
        label: f.label,
        order: f.order,
        isRequired: f.isRequired,
      })),
      updatedAt: template.updatedAt,
    });
  }

  async findAll(): Promise<Template[]> {
    const templateResults = await db
      .select()
      .from(templates)
      .orderBy(asc(templates.name));

    const allTemplates = await Promise.all(
      templateResults.map(async (template) => {
        const templateFields = await db
          .select()
          .from(fields)
          .where(eq(fields.templateId, template.id))
          .orderBy(asc(fields.order));

        return Template.create({
          id: template.id,
          name: template.name,
          ownerId: template.ownerId,
          fields: templateFields.map((f) => ({
            id: f.id,
            label: f.label,
            order: f.order,
            isRequired: f.isRequired,
          })),
          updatedAt: template.updatedAt,
        });
      }),
    );

    return allTemplates;
  }

  async findByOwnerId(ownerId: string): Promise<Template[]> {
    const results = await db.query.templates.findMany({
      where: eq(templates.ownerId, ownerId),
      orderBy: [asc(templates.name)],
      with: {
        fields: {
          orderBy: [asc(fields.order)],
        },
      },
    });

    return results.map((result) =>
      Template.create({
        id: result.id,
        name: result.name,
        ownerId: result.ownerId,
        fields: result.fields.map((f) => ({
          id: f.id,
          label: f.label,
          order: f.order,
          isRequired: f.isRequired,
        })),
        updatedAt: result.updatedAt,
      }),
    );
  }

  async save(template: Template): Promise<void> {
    const data = template.toPlainObject();

    await db.transaction(async (tx) => {
      // Check if template is used by notes
      const isUsed = await this.isUsedByNotes(data.id);

      // Update template name (always allowed)
      await tx
        .insert(templates)
        .values({
          id: data.id,
          name: data.name,
          ownerId: data.ownerId,
          updatedAt: data.updatedAt,
        })
        .onConflictDoUpdate({
          target: templates.id,
          set: {
            name: data.name,
            updatedAt: data.updatedAt,
          },
        });

      // If template is not used by notes, allow full field updates
      if (!isUsed) {
        // Get existing fields
        const existingFields = await tx
          .select()
          .from(fields)
          .where(eq(fields.templateId, data.id));

        const existingFieldIds = existingFields.map((f) => f.id);
        const newFieldIds = data.fields.map((f) => f.id);

        // Delete fields that are no longer in the template
        const fieldsToDelete = existingFieldIds.filter(
          (id) => !newFieldIds.includes(id),
        );

        if (fieldsToDelete.length > 0) {
          await tx.delete(fields).where(inArray(fields.id, fieldsToDelete));
        }

        // Update or insert fields
        if (data.fields.length > 0) {
          await tx
            .insert(fields)
            .values(
              data.fields.map((f) => ({
                id: f.id,
                templateId: data.id,
                label: f.label,
                order: f.order,
                isRequired: f.isRequired,
              })),
            )
            .onConflictDoUpdate({
              target: fields.id,
              set: {
                label: sql`excluded.label`,
                order: sql`excluded.order`,
                isRequired: sql`excluded.is_required`,
              },
            });
        }
      } else {
        // Template is used by notes: only allow updating existing field labels
        const existingFields = await tx
          .select()
          .from(fields)
          .where(eq(fields.templateId, data.id));

        const existingFieldIds = existingFields.map((f) => f.id);
        const newFieldIds = data.fields.map((f) => f.id);

        // Check if trying to add/remove fields or change order
        const fieldsToDelete = existingFieldIds.filter(
          (id) => !newFieldIds.includes(id),
        );
        const fieldsToAdd = newFieldIds.filter(
          (id) => !existingFieldIds.includes(id),
        );

        // Check if order changed
        const orderChanged = existingFields.some((existingField) => {
          const newField = data.fields.find((f) => f.id === existingField.id);
          return newField && newField.order !== existingField.order;
        });

        if (
          fieldsToDelete.length > 0 ||
          fieldsToAdd.length > 0 ||
          orderChanged
        ) {
          throw new Error("TEMPLATE_STRUCTURE_LOCKED");
        }

        // Only update labels and isRequired for existing fields
        for (const field of data.fields) {
          const existingField = existingFields.find((f) => f.id === field.id);
          if (existingField) {
            await tx
              .update(fields)
              .set({
                label: field.label,
                isRequired: field.isRequired,
              })
              .where(eq(fields.id, field.id));
          }
        }
      }
    });
  }

  async create(data: {
    name: string;
    ownerId: string;
    fields: Array<{
      label: string;
      order: number;
      isRequired: boolean;
    }>;
  }): Promise<Template> {
    const templateId = crypto.randomUUID();
    const now = new Date();

    await db.transaction(async (tx) => {
      // Create template
      await tx.insert(templates).values({
        id: templateId,
        name: data.name,
        ownerId: data.ownerId,
        updatedAt: now,
      });

      // Create fields
      if (data.fields.length > 0) {
        await tx.insert(fields).values(
          data.fields.map((f) => ({
            templateId: templateId,
            label: f.label,
            order: f.order,
            isRequired: f.isRequired,
          })),
        );
      }
    });

    const created = await this.findById(templateId);
    if (!created) throw new Error("Failed to create template");

    return created;
  }

  async delete(id: string): Promise<void> {
    // Check if template is used by any notes
    const usedByNotes = await db.query.notes.findFirst({
      where: eq(notes.templateId, id),
    });

    if (usedByNotes) {
      throw new Error("Cannot delete template that is in use");
    }

    await db.delete(templates).where(eq(templates.id, id));
  }

  async isUsedByNotes(id: string): Promise<boolean> {
    const result = await db.query.notes.findFirst({
      where: eq(notes.templateId, id),
    });
    return !!result;
  }
}

export const templateRepository = new TemplateRepository();

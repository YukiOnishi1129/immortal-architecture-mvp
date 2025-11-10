import { asc, desc, eq } from "drizzle-orm";
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
      .orderBy(desc(templates.updatedAt));

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
      orderBy: [desc(templates.updatedAt)],
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
      // Update template
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

      // Delete existing fields
      await tx.delete(fields).where(eq(fields.templateId, data.id));

      // Insert new fields
      if (data.fields.length > 0) {
        await tx.insert(fields).values(
          data.fields.map((f) => ({
            id: f.id,
            templateId: data.id,
            label: f.label,
            order: f.order,
            isRequired: f.isRequired,
          })),
        );
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
}

export const templateRepository = new TemplateRepository();

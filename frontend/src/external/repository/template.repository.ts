import { and, asc, desc, eq, ilike, inArray, sql } from "drizzle-orm";
import { db } from "../client/database";
import { accounts, fields, notes, templates } from "../client/database/schema";
import { Template } from "../domain/template/template.entity";
import type {
  ITemplateRepository,
  TemplateFilters,
} from "../domain/template/template.repository.interface";
import type { DbClient } from "./transaction.repository";

export class TemplateRepository implements ITemplateRepository {
  async findById(id: string, client: DbClient = db): Promise<Template | null> {
    const results = await client
      .select()
      .from(templates)
      .where(eq(templates.id, id))
      .limit(1);

    const template = results[0];
    if (!template) return null;

    const templateFields = await client
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

  async findAll(
    filters?: TemplateFilters,
    client: DbClient = db,
  ): Promise<Template[]> {
    const conditions = [];

    if (filters?.search) {
      conditions.push(ilike(templates.name, `%${filters.search}%`));
    }

    if (filters?.ownerId) {
      conditions.push(eq(templates.ownerId, filters.ownerId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const templateResults = await client
      .select()
      .from(templates)
      .where(whereClause)
      .orderBy(asc(templates.name));

    const allTemplates = await Promise.all(
      templateResults.map(async (template) => {
        const templateFields = await client
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

  async findByOwnerId(
    ownerId: string,
    _client: DbClient = db,
  ): Promise<Template[]> {
    // Note: query builder doesn't support passing client parameter directly
    // For now, use the default db instance
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

  async save(template: Template, client: DbClient = db): Promise<void> {
    const data = template.toPlainObject();

    // Check if template is used by notes
    const isUsed = await this.isUsedByNotes(data.id, client);

    // Update template name (always allowed)
    await client
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
      const existingFields = await client
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
        await client.delete(fields).where(inArray(fields.id, fieldsToDelete));
      }

      // Update or insert fields
      if (data.fields.length > 0) {
        await client
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
      const existingFields = await client
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

      if (fieldsToDelete.length > 0 || fieldsToAdd.length > 0 || orderChanged) {
        throw new Error("TEMPLATE_STRUCTURE_LOCKED");
      }

      // Only update labels and isRequired for existing fields
      for (const field of data.fields) {
        const existingField = existingFields.find((f) => f.id === field.id);
        if (existingField) {
          await client
            .update(fields)
            .set({
              label: field.label,
              isRequired: field.isRequired,
            })
            .where(eq(fields.id, field.id));
        }
      }
    }
  }

  async create(
    data: {
      name: string;
      ownerId: string;
      fields: Array<{
        label: string;
        order: number;
        isRequired: boolean;
      }>;
    },
    client: DbClient = db,
  ): Promise<Template> {
    const templateId = crypto.randomUUID();
    const now = new Date();

    // Create template
    await client.insert(templates).values({
      id: templateId,
      name: data.name,
      ownerId: data.ownerId,
      updatedAt: now,
    });

    // Create fields
    if (data.fields.length > 0) {
      await client.insert(fields).values(
        data.fields.map((f) => ({
          templateId: templateId,
          label: f.label,
          order: f.order,
          isRequired: f.isRequired,
        })),
      );
    }

    const created = await this.findById(templateId, client);
    if (!created) throw new Error("Failed to create template");

    return created;
  }

  async delete(id: string, client: DbClient = db): Promise<void> {
    // Check if template is used by any notes
    const isUsed = await this.isUsedByNotes(id, client);

    if (isUsed) {
      throw new Error("Cannot delete template that is in use");
    }

    await client.delete(templates).where(eq(templates.id, id));
  }

  async isUsedByNotes(id: string, client: DbClient = db): Promise<boolean> {
    const result = await client
      .select()
      .from(notes)
      .where(eq(notes.templateId, id))
      .limit(1);

    return result.length > 0;
  }

  async getAccountForTemplate(
    ownerId: string,
    client: DbClient = db,
  ): Promise<typeof accounts.$inferSelect | null> {
    const result = await client
      .select()
      .from(accounts)
      .where(eq(accounts.id, ownerId))
      .limit(1);

    return result[0] || null;
  }
}

export const templateRepository = new TemplateRepository();

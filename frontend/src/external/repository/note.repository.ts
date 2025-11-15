import { and, desc, eq, like, or } from "drizzle-orm";
import { db } from "../client/database";
import { notes, sections } from "../client/database/schema";
import { Note } from "../domain/note/note.entity";
import type { INoteRepository } from "../domain/note/note.repository.interface";
import type { NoteStatus } from "../domain/shared/value-objects";
import type { DbClient } from "./transaction.repository";

export class NoteRepository implements INoteRepository {
  async findById(id: string, client: DbClient = db): Promise<Note | null> {
    const result = await client.query.notes.findFirst({
      where: eq(notes.id, id),
      with: {
        sections: true,
        owner: true,
      },
    });

    if (!result) return null;

    return Note.create({
      id: result.id,
      title: result.title,
      templateId: result.templateId,
      ownerId: result.ownerId,
      status: result.status as NoteStatus,
      sections: result.sections.map((s) => ({
        id: s.id,
        fieldId: s.fieldId,
        content: s.content,
      })),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }

  async findAll(
    filters?: {
      status?: NoteStatus;
      ownerId?: string;
      templateId?: string;
      search?: string;
    },
    client: DbClient = db,
  ): Promise<Note[]> {
    let query = client.query.notes.findMany({
      orderBy: [desc(notes.createdAt)],
      with: {
        sections: true,
        owner: true,
      },
    });

    const conditions = [];

    if (filters?.status) {
      conditions.push(eq(notes.status, filters.status));
    }

    if (filters?.ownerId) {
      conditions.push(eq(notes.ownerId, filters.ownerId));
    }

    if (filters?.templateId) {
      conditions.push(eq(notes.templateId, filters.templateId));
    }

    if (filters?.search) {
      const searchPattern = `%${filters.search}%`;
      // Note: For full text search on sections content,
      // we'll need a more complex query or search index
      conditions.push(or(like(notes.title, searchPattern)));
    }

    if (conditions.length > 0) {
      query = client.query.notes.findMany({
        where: and(...conditions),
        orderBy: [desc(notes.createdAt)],
        with: {
          sections: true,
          owner: true,
        },
      });
    }

    const results = await query;

    return results.map((result) =>
      Note.create({
        id: result.id,
        title: result.title,
        templateId: result.templateId,
        ownerId: result.ownerId,
        status: result.status as NoteStatus,
        sections: result.sections.map((s) => ({
          id: s.id,
          fieldId: s.fieldId,
          content: s.content,
        })),
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      }),
    );
  }

  async findByOwnerId(ownerId: string, client: DbClient = db): Promise<Note[]> {
    return this.findAll({ ownerId }, client);
  }

  async save(note: Note, client: DbClient = db): Promise<void> {
    const data = note.toPlainObject();

    // Update note
    await client
      .insert(notes)
      .values({
        id: data.id,
        title: data.title,
        templateId: data.templateId,
        ownerId: data.ownerId,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      })
      .onConflictDoUpdate({
        target: notes.id,
        set: {
          title: data.title,
          status: data.status,
          updatedAt: data.updatedAt,
        },
      });

    // Delete existing sections
    await client.delete(sections).where(eq(sections.noteId, data.id));

    // Insert new sections
    if (data.sections.length > 0) {
      await client.insert(sections).values(
        data.sections.map((s) => ({
          id: s.id,
          noteId: data.id,
          fieldId: s.fieldId,
          content: s.content,
        })),
      );
    }
  }

  async create(
    data: {
      title: string;
      templateId: string;
      ownerId: string;
      sections: Array<{
        fieldId: string;
        content: string;
      }>;
    },
    client: DbClient = db,
  ): Promise<Note> {
    const noteId = crypto.randomUUID();
    const now = new Date();

    // Create note
    await client.insert(notes).values({
      id: noteId,
      title: data.title,
      templateId: data.templateId,
      ownerId: data.ownerId,
      status: "Draft",
      createdAt: now,
      updatedAt: now,
    });

    // Create sections
    if (data.sections.length > 0) {
      await client.insert(sections).values(
        data.sections.map((s) => ({
          noteId: noteId,
          fieldId: s.fieldId,
          content: s.content,
        })),
      );
    }

    const created = await this.findById(noteId, client);
    if (!created) throw new Error("Failed to create note");

    return created;
  }

  async delete(id: string, client: DbClient = db): Promise<void> {
    await client.delete(notes).where(eq(notes.id, id));
  }
}

export const noteRepository = new NoteRepository();

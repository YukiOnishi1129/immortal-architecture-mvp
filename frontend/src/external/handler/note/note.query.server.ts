import "server-only";
import {
  getAuthenticatedSessionServer,
  requireAuthServer,
} from "@/features/auth/servers/redirect.server";
import type { NoteFilters } from "@/features/note/types";
import { NoteResponseSchema } from "../../dto/note.dto";
import { noteService } from "../../service/note/note.service";

export async function getNoteByIdQuery(id: string) {
  await requireAuthServer();

  const note = await noteService.getNoteById(id);

  if (!note) {
    return null;
  }

  // Get template for note
  const template = await noteService.getTemplateForNote(note.templateId);
  if (!template) {
    throw new Error("Template not found");
  }

  // Get owner info
  const owner = await noteService.getAccountForNote(note.ownerId);
  if (!owner) {
    throw new Error("Owner not found");
  }

  // Convert domain entity to response DTO
  const response = {
    id: note.id,
    title: note.title,
    templateId: note.templateId,
    templateName: template.name,
    ownerId: note.ownerId,
    owner: {
      id: owner.id,
      firstName: owner.firstName,
      lastName: owner.lastName,
      thumbnail: owner.thumbnail,
    },
    status: note.status,
    sections: note.sections.map((section) => {
      const field = template.fields.find((f) => f.id === section.fieldId);
      return {
        id: section.id,
        fieldId: section.fieldId,
        fieldLabel: field?.label || "Unknown Field",
        content: section.content,
        isRequired: field?.isRequired || false,
      };
    }),
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };

  // Validate response with DTO schema
  return NoteResponseSchema.parse(response);
}

export async function listNoteQuery(filters?: NoteFilters) {
  await requireAuthServer();

  // Get all public notes or filtered notes
  const notes = await noteService.getNotes(filters);

  // Get all unique template IDs and owner IDs
  const templateIds = [...new Set(notes.map((note) => note.templateId))];
  const ownerIds = [...new Set(notes.map((note) => note.ownerId))];

  // Fetch all templates and owners at once
  const [templates, owners] = await Promise.all([
    Promise.all(templateIds.map((id) => noteService.getTemplateForNote(id))),
    Promise.all(ownerIds.map((id) => noteService.getAccountForNote(id))),
  ]);

  const templateMap = new Map(
    templates
      .filter((t): t is NonNullable<typeof t> => t !== null)
      .map((t) => [t.id, t]),
  );

  const ownerMap = new Map(
    owners
      .filter((o): o is NonNullable<typeof o> => o !== null)
      .map((o) => [o.id, o]),
  );

  // Convert domain entities to response DTOs
  return notes.map((note) => {
    const template = templateMap.get(note.templateId);
    if (!template) {
      throw new Error(`Template ${note.templateId} not found`);
    }

    const owner = ownerMap.get(note.ownerId);
    if (!owner) {
      throw new Error(`Owner ${note.ownerId} not found`);
    }

    const response = {
      id: note.id,
      title: note.title,
      templateId: note.templateId,
      templateName: template.name,
      ownerId: note.ownerId,
      owner: {
        id: owner.id,
        firstName: owner.firstName,
        lastName: owner.lastName,
        thumbnail: owner.thumbnail,
      },
      status: note.status,
      sections: note.sections.map((section) => {
        const field = template.fields.find((f) => f.id === section.fieldId);
        return {
          id: section.id,
          fieldId: section.fieldId,
          fieldLabel: field?.label || "Unknown Field",
          content: section.content,
          isRequired: field?.isRequired || false,
        };
      }),
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    };

    return NoteResponseSchema.parse(response);
  });
}

export async function listMyNoteQuery(filters?: NoteFilters) {
  const session = await getAuthenticatedSessionServer();

  // Get notes owned by current user
  const notes = await noteService.getNotes({
    ...filters,
    ownerId: session.account.id,
  });

  // Get all unique template IDs and owner IDs
  const templateIds = [...new Set(notes.map((note) => note.templateId))];
  const ownerIds = [...new Set(notes.map((note) => note.ownerId))];

  // Fetch all templates and owners at once
  const [templates, owners] = await Promise.all([
    Promise.all(templateIds.map((id) => noteService.getTemplateForNote(id))),
    Promise.all(ownerIds.map((id) => noteService.getAccountForNote(id))),
  ]);

  const templateMap = new Map(
    templates
      .filter((t): t is NonNullable<typeof t> => t !== null)
      .map((t) => [t.id, t]),
  );

  const ownerMap = new Map(
    owners
      .filter((o): o is NonNullable<typeof o> => o !== null)
      .map((o) => [o.id, o]),
  );

  // Convert domain entities to response DTOs
  return notes.map((note) => {
    const template = templateMap.get(note.templateId);
    if (!template) {
      throw new Error(`Template ${note.templateId} not found`);
    }

    const owner = ownerMap.get(note.ownerId);
    if (!owner) {
      throw new Error(`Owner ${note.ownerId} not found`);
    }

    const response = {
      id: note.id,
      title: note.title,
      templateId: note.templateId,
      templateName: template.name,
      ownerId: note.ownerId,
      owner: {
        id: owner.id,
        firstName: owner.firstName,
        lastName: owner.lastName,
        thumbnail: owner.thumbnail,
      },
      status: note.status,
      sections: note.sections.map((section) => {
        const field = template.fields.find((f) => f.id === section.fieldId);
        return {
          id: section.id,
          fieldId: section.fieldId,
          fieldLabel: field?.label || "Unknown Field",
          content: section.content,
          isRequired: field?.isRequired || false,
        };
      }),
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    };

    return NoteResponseSchema.parse(response);
  });
}

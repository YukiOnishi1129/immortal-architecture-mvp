import "server-only";
import { getSessionServer } from "@/features/auth/server/auth.server";
import type { NoteFilters } from "@/features/note/types";
import { NoteResponseSchema } from "../../dto/note.dto";
import { noteService } from "../../service/note/note.service";

export async function getNoteByIdServer(id: string) {
  const note = await noteService.getNoteById(id);

  if (!note) {
    return null;
  }

  // Get template for note
  const template = await noteService.getTemplateForNote(note.templateId);
  if (!template) {
    throw new Error("Template not found");
  }

  // Convert domain entity to response DTO
  const response = {
    id: note.id,
    title: note.title,
    templateId: note.templateId,
    templateName: template.name,
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

export async function listNotesServer(filters?: NoteFilters) {
  // Get all public notes or filtered notes
  const notes = await noteService.getNotes(filters);

  // Get all unique template IDs
  const templateIds = [...new Set(notes.map((note) => note.templateId))];

  // Fetch all templates at once
  const templates = await Promise.all(
    templateIds.map((id) => noteService.getTemplateForNote(id)),
  );

  const templateMap = new Map(
    templates
      .filter((t): t is NonNullable<typeof t> => t !== null)
      .map((t) => [t.id, t]),
  );

  // Convert domain entities to response DTOs
  return notes.map((note) => {
    const template = templateMap.get(note.templateId);
    if (!template) {
      throw new Error(`Template ${note.templateId} not found`);
    }

    const response = {
      id: note.id,
      title: note.title,
      templateId: note.templateId,
      templateName: template.name,
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

export async function listMyNotesServer(filters?: NoteFilters) {
  const session = await getSessionServer();

  if (!session?.account?.id) {
    return [];
  }

  // Get notes owned by current user
  const notes = await noteService.getNotes({
    ...filters,
    ownerId: session.account.id,
  });

  // Get all unique template IDs
  const templateIds = [...new Set(notes.map((note) => note.templateId))];

  // Fetch all templates at once
  const templates = await Promise.all(
    templateIds.map((id) => noteService.getTemplateForNote(id)),
  );

  const templateMap = new Map(
    templates
      .filter((t): t is NonNullable<typeof t> => t !== null)
      .map((t) => [t.id, t]),
  );

  // Convert domain entities to response DTOs
  return notes.map((note) => {
    const template = templateMap.get(note.templateId);
    if (!template) {
      throw new Error(`Template ${note.templateId} not found`);
    }

    const response = {
      id: note.id,
      title: note.title,
      templateId: note.templateId,
      templateName: template.name,
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

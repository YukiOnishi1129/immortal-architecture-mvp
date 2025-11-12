import "server-only";

import { redirect } from "next/navigation";

import { getSessionServer } from "@/features/auth/server/auth.server";
import {
  CreateNoteRequestSchema,
  NoteResponseSchema,
  PublishNoteRequestSchema,
  UnpublishNoteRequestSchema,
  UpdateNoteRequestSchema,
} from "../../dto/note.dto";
import { accountService } from "../../service/account/account.service";
import { noteService } from "../../service/note/note.service";

export async function createNoteServer(request: unknown) {
  const session = await getSessionServer();
  if (!session?.account.id) {
    redirect("/login");
  }

  // Validate request
  const validated = CreateNoteRequestSchema.parse(request);

  // Create note
  const note = await noteService.createNote(session.account.id, validated);

  // Get template for response
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

  return NoteResponseSchema.parse(response);
}

export async function updateNoteServer(id: string, request: unknown) {
  const session = await getSessionServer();

  if (!session?.account.id) {
    redirect("/login");
  }

  // Validate request
  const validated = UpdateNoteRequestSchema.parse(request);

  // Update note
  const note = await noteService.updateNote(id, session.account.id, validated);

  // Get template for response
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

  return NoteResponseSchema.parse(response);
}

export async function publishNoteServer(request: unknown) {
  const session = await getSessionServer();
  if (!session?.account.id) {
    redirect("/login");
  }

  // Validate request
  const validated = PublishNoteRequestSchema.parse(request);

  // Get account entity from service
  const accountEntity = await accountService.getAccountById(session.account.id);
  if (!accountEntity) {
    throw new Error("Account not found");
  }

  // Publish note
  const note = await noteService.publishNote(validated.noteId, accountEntity);

  // Get template for response
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

  return NoteResponseSchema.parse(response);
}

export async function unpublishNoteServer(request: unknown) {
  const session = await getSessionServer();
  if (!session?.account.id) {
    redirect("/login");
  }

  // Validate request
  const validated = UnpublishNoteRequestSchema.parse(request);

  // Get account entity from service
  const accountEntity = await accountService.getAccountById(session.account.id);
  if (!accountEntity) {
    throw new Error("Account not found");
  }

  // Unpublish note
  const note = await noteService.unpublishNote(validated.noteId, accountEntity);

  // Get template for response
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

  return NoteResponseSchema.parse(response);
}

export async function deleteNoteServer(id: string) {
  const session = await getSessionServer();
  if (!session?.account.id) {
    redirect("/login");
  }

  // Delete note
  await noteService.deleteNote(id, session.account.id);

  return { success: true };
}

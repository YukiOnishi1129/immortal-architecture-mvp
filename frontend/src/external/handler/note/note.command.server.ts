import "server-only";

import { withAuth } from "@/features/auth/servers/auth.guard";
import {
  type CreateNoteRequest,
  CreateNoteRequestSchema,
  type DeleteNoteRequest,
  DeleteNoteRequestSchema,
  type PublishNoteRequest,
  PublishNoteRequestSchema,
  type UnpublishNoteRequest,
  UnpublishNoteRequestSchema,
  type UpdateNoteRequest,
  UpdateNoteRequestSchema,
} from "../../dto/note.dto";
import { accountService } from "../../service/account/account.service";
import { noteService } from "../../service/note/note.service";
import { toNoteResponse } from "./note.converter";

export async function createNoteCommand(request: CreateNoteRequest) {
  return withAuth(async ({ accountId }) => {
    const validated = CreateNoteRequestSchema.parse(request);
    const note = await noteService.createNote(accountId, validated);

    const template = await noteService.getTemplateForNote(note.templateId);
    if (!template) {
      throw new Error("Template not found");
    }

    const owner = await noteService.getAccountForNote(note.ownerId);
    if (!owner) {
      throw new Error("Owner not found");
    }

    return toNoteResponse(note, template, owner);
  });
}

export async function updateNoteCommand(request: UpdateNoteRequest) {
  return withAuth(async ({ accountId }) => {
    const validated = UpdateNoteRequestSchema.parse(request);
    const note = await noteService.updateNote(
      validated.id,
      accountId,
      validated,
    );

    const template = await noteService.getTemplateForNote(note.templateId);
    if (!template) {
      throw new Error("Template not found");
    }

    const owner = await noteService.getAccountForNote(note.ownerId);
    if (!owner) {
      throw new Error("Owner not found");
    }

    return toNoteResponse(note, template, owner);
  });
}

export async function publishNoteCommand(request: PublishNoteRequest) {
  return withAuth(async ({ accountId }) => {
    const validated = PublishNoteRequestSchema.parse(request);

    const accountEntity = await accountService.getAccountById(accountId);
    if (!accountEntity) {
      throw new Error("Account not found");
    }

    const note = await noteService.publishNote(validated.noteId, accountEntity);

    const template = await noteService.getTemplateForNote(note.templateId);
    if (!template) {
      throw new Error("Template not found");
    }

    const owner = await noteService.getAccountForNote(note.ownerId);
    if (!owner) {
      throw new Error("Owner not found");
    }

    return toNoteResponse(note, template, owner);
  });
}

export async function unpublishNoteCommand(request: UnpublishNoteRequest) {
  return withAuth(async ({ accountId }) => {
    const validated = UnpublishNoteRequestSchema.parse(request);

    const accountEntity = await accountService.getAccountById(accountId);
    if (!accountEntity) {
      throw new Error("Account not found");
    }

    const note = await noteService.unpublishNote(
      validated.noteId,
      accountEntity,
    );

    const template = await noteService.getTemplateForNote(note.templateId);
    if (!template) {
      throw new Error("Template not found");
    }

    const owner = await noteService.getAccountForNote(note.ownerId);
    if (!owner) {
      throw new Error("Owner not found");
    }

    return toNoteResponse(note, template, owner);
  });
}

export async function deleteNoteCommand(request: DeleteNoteRequest) {
  return withAuth(async ({ accountId }) => {
    const validated = DeleteNoteRequestSchema.parse(request);
    await noteService.deleteNote(validated.id, accountId);
    return { success: true };
  });
}

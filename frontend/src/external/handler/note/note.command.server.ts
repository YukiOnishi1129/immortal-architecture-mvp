import "server-only";

import { getAuthenticatedSessionServer } from "@/features/auth/servers/redirect.server";
import {
  CreateNoteRequestSchema,
  NoteResponseSchema,
  PublishNoteRequestSchema,
  UnpublishNoteRequestSchema,
  UpdateNoteRequestSchema,
} from "../../dto/note.dto";
import { accountService } from "../../service/account/account.service";
import { noteService } from "../../service/note/note.service";

export async function createNoteCommand(request: unknown) {
  const session = await getAuthenticatedSessionServer();

  // リクエストのバリデーション
  const validated = CreateNoteRequestSchema.parse(request);

  // ノートを作成
  const note = await noteService.createNote(session.account.id, validated);

  // レスポンス用のテンプレートを取得
  const template = await noteService.getTemplateForNote(note.templateId);
  if (!template) {
    throw new Error("Template not found");
  }

  // 所有者情報を取得
  const owner = await noteService.getAccountForNote(note.ownerId);
  if (!owner) {
    throw new Error("Owner not found");
  }

  // ドメインエンティティをレスポンスDTOに変換
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
}

export async function updateNoteCommand(id: string, request: unknown) {
  const session = await getAuthenticatedSessionServer();

  // リクエストのバリデーション
  const validated = UpdateNoteRequestSchema.parse(request);

  // ノートを更新
  const note = await noteService.updateNote(id, session.account.id, validated);

  // レスポンス用のテンプレートを取得
  const template = await noteService.getTemplateForNote(note.templateId);
  if (!template) {
    throw new Error("Template not found");
  }

  // 所有者情報を取得
  const owner = await noteService.getAccountForNote(note.ownerId);
  if (!owner) {
    throw new Error("Owner not found");
  }

  // ドメインエンティティをレスポンスDTOに変換
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
}

export async function publishNoteCommand(request: unknown) {
  const session = await getAuthenticatedSessionServer();

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

  return NoteResponseSchema.parse(response);
}

export async function unpublishNoteCommand(request: unknown) {
  const session = await getAuthenticatedSessionServer();

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

  return NoteResponseSchema.parse(response);
}

export async function deleteNoteCommand(id: string) {
  const session = await getAuthenticatedSessionServer();

  // Delete note
  await noteService.deleteNote(id, session.account.id);

  return { success: true };
}

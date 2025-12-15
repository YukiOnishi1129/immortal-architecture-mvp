import "server-only";

import type { Account } from "../../domain/account/account.entity";
import type { Note } from "../../domain/note/note.entity";
import type { Template } from "../../domain/template/template.entity";
import { type NoteResponse, NoteResponseSchema } from "../../dto/note.dto";

type NoteOwner = Pick<Account, "id" | "firstName" | "lastName" | "thumbnail">;

/**
 * Note ドメインエンティティを NoteResponse DTO に変換する
 */
export function toNoteResponse(
  note: Note,
  template: Template,
  owner: NoteOwner,
): NoteResponse {
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

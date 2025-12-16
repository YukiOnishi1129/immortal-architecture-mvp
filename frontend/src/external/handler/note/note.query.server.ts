import "server-only";

import type { NoteFilters } from "@/features/note/types";
import {
  type GetNoteByIdRequest,
  GetNoteByIdRequestSchema,
} from "../../dto/note.dto";
import { noteService } from "../../service/note/note.service";
import { toNoteResponse } from "./note.converter";

export async function getNoteByIdQuery(request: GetNoteByIdRequest) {
  const validated = GetNoteByIdRequestSchema.parse(request);
  const note = await noteService.getNoteById(validated.id);

  if (!note) {
    return null;
  }

  const template = await noteService.getTemplateForNote(note.templateId);
  if (!template) {
    throw new Error("Template not found");
  }

  const owner = await noteService.getAccountForNote(note.ownerId);
  if (!owner) {
    throw new Error("Owner not found");
  }

  return toNoteResponse(note, template, owner);
}

export async function listNoteQuery(filters?: NoteFilters) {
  const notes = await noteService.getNotes(filters);

  const templateIds = [...new Set(notes.map((note) => note.templateId))];
  const ownerIds = [...new Set(notes.map((note) => note.ownerId))];

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

  return notes.map((note) => {
    const template = templateMap.get(note.templateId);
    if (!template) {
      throw new Error(`Template ${note.templateId} not found`);
    }

    const owner = ownerMap.get(note.ownerId);
    if (!owner) {
      throw new Error(`Owner ${note.ownerId} not found`);
    }

    return toNoteResponse(note, template, owner);
  });
}

export async function listMyNoteQuery(
  filters: NoteFilters | undefined,
  accountId: string,
) {
  const notes = await noteService.getNotes({
    ...filters,
    ownerId: accountId,
  });

  const templateIds = [...new Set(notes.map((note) => note.templateId))];
  const ownerIds = [...new Set(notes.map((note) => note.ownerId))];

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

  return notes.map((note) => {
    const template = templateMap.get(note.templateId);
    if (!template) {
      throw new Error(`Template ${note.templateId} not found`);
    }

    const owner = ownerMap.get(note.ownerId);
    if (!owner) {
      throw new Error(`Owner ${note.ownerId} not found`);
    }

    return toNoteResponse(note, template, owner);
  });
}

"use server";

import type { GetNoteByIdRequest } from "@/external/dto/note.dto";
import type { NoteFilters } from "@/features/note/types";
import {
  getNoteByIdQuery,
  listMyNoteQuery,
  listNoteQuery,
} from "./note.query.server";

export async function getNoteByIdQueryAction(request: GetNoteByIdRequest) {
  return getNoteByIdQuery(request);
}

export async function listNoteQueryAction(filters?: NoteFilters) {
  return listNoteQuery(filters);
}

export async function listMyNoteQueryAction(filters?: NoteFilters) {
  return listMyNoteQuery(filters);
}

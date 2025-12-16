"use server";

import type { GetNoteByIdRequest } from "@/external/dto/note.dto";
import { withAuth } from "@/features/auth/servers/auth.guard";
import type { NoteFilters } from "@/features/note/types";
import {
  getNoteByIdQuery,
  listMyNoteQuery,
  listNoteQuery,
} from "./note.query.server";

export async function getNoteByIdQueryAction(request: GetNoteByIdRequest) {
  return withAuth(() => getNoteByIdQuery(request));
}

export async function listNoteQueryAction(filters?: NoteFilters) {
  return withAuth(() => listNoteQuery(filters));
}

export async function listMyNoteQueryAction(filters?: NoteFilters) {
  return withAuth(({ accountId }) => listMyNoteQuery(filters, accountId));
}

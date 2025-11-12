"use server";

import type { NoteFilters } from "@/features/note/types";
import {
  getNoteByIdServer,
  listMyNotesServer,
  listNotesServer,
} from "./note.query.server";

export async function getNoteByIdAction(id: string) {
  return getNoteByIdServer(id);
}

export async function listNotesAction(filters?: NoteFilters) {
  return listNotesServer(filters);
}

export async function listMyNotesAction(filters?: NoteFilters) {
  return listMyNotesServer(filters);
}

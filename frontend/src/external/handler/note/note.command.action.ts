"use server";

import {
  createNoteServer,
  deleteNoteServer,
  publishNoteServer,
  unpublishNoteServer,
  updateNoteServer,
} from "./note.command.server";

export async function createNoteAction(request: unknown) {
  return createNoteServer(request);
}

export async function updateNoteAction(id: string, request: unknown) {
  return updateNoteServer(id, request);
}

export async function publishNoteAction(request: unknown) {
  return publishNoteServer(request);
}

export async function unpublishNoteAction(request: unknown) {
  return unpublishNoteServer(request);
}

export async function deleteNoteAction(id: string) {
  return deleteNoteServer(id);
}

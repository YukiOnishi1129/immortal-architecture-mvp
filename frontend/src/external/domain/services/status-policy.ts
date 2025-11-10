import type { Account } from "../account/account.entity";
import type { Note } from "../note/note.entity";

export function canChangeStatus(note: Note, account: Account): boolean {
  return note.ownerId === account.id;
}

export function canPublish(note: Note, account: Account): boolean {
  return canChangeStatus(note, account) && note.isDraft();
}

export function canUnpublish(note: Note, account: Account): boolean {
  return canChangeStatus(note, account) && note.isPublished();
}

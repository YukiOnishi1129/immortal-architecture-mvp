import type { DbClient } from "../../repository/transaction.repository";
import type { NoteStatus } from "../shared/value-objects";
import type { Note } from "./note.entity";

export interface INoteRepository {
  findById(id: string, client?: DbClient): Promise<Note | null>;
  findAll(
    filters?: {
      status?: NoteStatus;
      ownerId?: string;
      templateId?: string;
      search?: string;
    },
    client?: DbClient,
  ): Promise<Note[]>;
  findByOwnerId(ownerId: string, client?: DbClient): Promise<Note[]>;
  save(note: Note, client?: DbClient): Promise<void>;
  create(
    data: {
      title: string;
      templateId: string;
      ownerId: string;
      sections: Array<{
        fieldId: string;
        content: string;
      }>;
    },
    client?: DbClient,
  ): Promise<Note>;
  delete(id: string, client?: DbClient): Promise<void>;
}

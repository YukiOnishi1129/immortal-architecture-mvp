import type { NoteStatus } from "../shared/value-objects";
import type { Note } from "./note.entity";

export interface INoteRepository {
  findById(id: string): Promise<Note | null>;
  findAll(filters?: {
    status?: NoteStatus;
    ownerId?: string;
    templateId?: string;
    search?: string;
  }): Promise<Note[]>;
  findByOwnerId(ownerId: string): Promise<Note[]>;
  save(note: Note): Promise<void>;
  create(data: {
    title: string;
    templateId: string;
    ownerId: string;
    sections: Array<{
      fieldId: string;
      content: string;
    }>;
  }): Promise<Note>;
  delete(id: string): Promise<void>;
}

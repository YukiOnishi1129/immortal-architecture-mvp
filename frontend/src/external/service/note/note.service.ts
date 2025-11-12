import type { NoteFilters } from "@/features/note/types";
import type { Account } from "../../domain/account/account.entity";
import type { Note } from "../../domain/note/note.entity";
import type { INoteRepository } from "../../domain/note/note.repository.interface";
import { buildSectionsFromTemplate, canPublish, canUnpublish } from "../../domain/note/note-domain.service";
import type { ITemplateRepository } from "../../domain/template/template.repository.interface";
import type { CreateNoteRequest, UpdateNoteRequest } from "../../dto/note.dto";
import { noteRepository } from "../../repository/note.repository";
import { templateRepository } from "../../repository/template.repository";

export class NoteService {
  constructor(
    private noteRepository: INoteRepository,
    private templateRepository: ITemplateRepository,
  ) {}

  async getNoteById(id: string): Promise<Note | null> {
    return this.noteRepository.findById(id);
  }

  async getNotes(
    filters?: NoteFilters & { ownerId?: string },
  ): Promise<Note[]> {
    return this.noteRepository.findAll(filters);
  }

  async createNote(ownerId: string, input: CreateNoteRequest): Promise<Note> {
    // Get template
    const template = await this.templateRepository.findById(input.templateId);
    if (!template) {
      throw new Error("Template not found");
    }

    // Build sections from template
    const sections = buildSectionsFromTemplate(template, () =>
      crypto.randomUUID(),
    );

    // Create note
    return this.noteRepository.create({
      title: input.title,
      templateId: input.templateId,
      ownerId,
      sections: sections.map((s) => ({
        fieldId: s.fieldId,
        content: s.content,
      })),
    });
  }

  async updateNote(
    id: string,
    ownerId: string,
    input: UpdateNoteRequest,
  ): Promise<Note> {
    const note = await this.noteRepository.findById(id);
    if (!note) {
      throw new Error("Note not found");
    }

    if (!note.canEdit(ownerId)) {
      throw new Error("Unauthorized");
    }

    // Update title
    let updatedNote = note.updateTitle(input.title);

    // Update sections
    input.sections.forEach((sectionInput) => {
      updatedNote = updatedNote.updateSection(
        sectionInput.id,
        sectionInput.content,
      );
    });

    await this.noteRepository.save(updatedNote);
    return updatedNote;
  }

  async publishNote(noteId: string, account: Account): Promise<Note> {
    const note = await this.noteRepository.findById(noteId);
    if (!note) {
      throw new Error("Note not found");
    }

    if (!canPublish(note, account)) {
      throw new Error("Unauthorized");
    }

    const publishedNote = note.publish();
    await this.noteRepository.save(publishedNote);
    return publishedNote;
  }

  async unpublishNote(noteId: string, account: Account): Promise<Note> {
    const note = await this.noteRepository.findById(noteId);
    if (!note) {
      throw new Error("Note not found");
    }

    if (!canUnpublish(note, account)) {
      throw new Error("Unauthorized");
    }

    const unpublishedNote = note.unpublish();
    await this.noteRepository.save(unpublishedNote);
    return unpublishedNote;
  }

  async deleteNote(id: string, ownerId: string): Promise<void> {
    const note = await this.noteRepository.findById(id);
    if (!note) {
      throw new Error("Note not found");
    }

    if (!note.canEdit(ownerId)) {
      throw new Error("Unauthorized");
    }

    await this.noteRepository.delete(id);
  }

  // Helper method to get template for a note
  async getTemplateForNote(templateId: string) {
    return this.templateRepository.findById(templateId);
  }
}

// シングルトンインスタンスをエクスポート
export const noteService = new NoteService(noteRepository, templateRepository);

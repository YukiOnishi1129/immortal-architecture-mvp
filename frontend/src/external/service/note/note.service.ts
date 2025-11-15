import type { NoteFilters } from "@/features/note/types";
import type { Account } from "../../domain/account/account.entity";
import type { IAccountRepository } from "../../domain/account/account.repository.interface";
import type { Note } from "../../domain/note/note.entity";
import type { INoteRepository } from "../../domain/note/note.repository.interface";
import {
  buildSectionsFromTemplate,
  canPublish,
  canUnpublish,
} from "../../domain/note/note-domain.service";
import type { ITemplateRepository } from "../../domain/template/template.repository.interface";
import type { ITransactionManager } from "../../domain/transaction/transaction-manager.interface";
import type { CreateNoteRequest, UpdateNoteRequest } from "../../dto/note.dto";
import { accountRepository } from "../../repository/account.repository";
import { noteRepository } from "../../repository/note.repository";
import { templateRepository } from "../../repository/template.repository";
import {
  type DbClient,
  transactionRepository,
} from "../../repository/transaction.repository";

export class NoteService {
  constructor(
    private noteRepository: INoteRepository,
    private templateRepository: ITemplateRepository,
    private accountRepository: IAccountRepository,
    private transactionManager: ITransactionManager<DbClient>,
  ) {}

  async getNoteById(id: string): Promise<Note | null> {
    return this.noteRepository.findById(id);
  }

  async getNotes(
    filters?: NoteFilters & { ownerId?: string },
  ): Promise<Note[]> {
    // Convert 'q' to 'search' for repository
    const repoFilters = filters
      ? {
          ...filters,
          search: filters.q || filters.search,
        }
      : undefined;

    return this.noteRepository.findAll(repoFilters);
  }

  async createNote(ownerId: string, input: CreateNoteRequest): Promise<Note> {
    return this.transactionManager.execute(async (tx) => {
      // Get template
      const template = await this.templateRepository.findById(
        input.templateId,
        tx,
      );
      if (!template) {
        throw new Error("Template not found");
      }

      // Use sections from input if provided, otherwise build from template
      const sections =
        input.sections && input.sections.length > 0
          ? input.sections.map((s) => ({
              fieldId: s.fieldId,
              content: s.content,
            }))
          : buildSectionsFromTemplate(template, () => crypto.randomUUID()).map(
              (s) => ({
                fieldId: s.fieldId,
                content: s.content,
              }),
            );

      // Create note
      return this.noteRepository.create(
        {
          title: input.title,
          templateId: input.templateId,
          ownerId,
          sections,
        },
        tx,
      );
    });
  }

  async updateNote(
    id: string,
    ownerId: string,
    input: UpdateNoteRequest,
  ): Promise<Note> {
    return this.transactionManager.execute(async (tx) => {
      const note = await this.noteRepository.findById(id, tx);
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

      await this.noteRepository.save(updatedNote, tx);
      return updatedNote;
    });
  }

  async publishNote(noteId: string, account: Account): Promise<Note> {
    return this.transactionManager.execute(async (tx) => {
      const note = await this.noteRepository.findById(noteId, tx);
      if (!note) {
        throw new Error("Note not found");
      }

      if (!canPublish(note, account)) {
        throw new Error("Unauthorized");
      }

      const publishedNote = note.publish();
      await this.noteRepository.save(publishedNote, tx);
      return publishedNote;
    });
  }

  async unpublishNote(noteId: string, account: Account): Promise<Note> {
    return this.transactionManager.execute(async (tx) => {
      const note = await this.noteRepository.findById(noteId, tx);
      if (!note) {
        throw new Error("Note not found");
      }

      if (!canUnpublish(note, account)) {
        throw new Error("Unauthorized");
      }

      const unpublishedNote = note.unpublish();
      await this.noteRepository.save(unpublishedNote, tx);
      return unpublishedNote;
    });
  }

  async deleteNote(id: string, ownerId: string): Promise<void> {
    return this.transactionManager.execute(async (tx) => {
      const note = await this.noteRepository.findById(id, tx);
      if (!note) {
        throw new Error("Note not found");
      }

      if (!note.canEdit(ownerId)) {
        throw new Error("Unauthorized");
      }

      await this.noteRepository.delete(id, tx);
    });
  }

  // Helper method to get template for a note
  async getTemplateForNote(templateId: string) {
    return this.templateRepository.findById(templateId);
  }

  // Helper method to get account for a note
  async getAccountForNote(accountId: string) {
    return this.accountRepository.findById(accountId);
  }
}

// シングルトンインスタンスをエクスポート
export const noteService = new NoteService(
  noteRepository,
  templateRepository,
  accountRepository,
  transactionRepository,
);

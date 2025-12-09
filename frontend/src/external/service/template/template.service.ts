import type { INoteRepository } from "../../domain/note/note.repository.interface";
import { Template } from "../../domain/template/template.entity";
import type { ITemplateRepository } from "../../domain/template/template.repository.interface";
import type { ITransactionManager } from "../../domain/transaction/transaction-manager.interface";
import type {
  CreateTemplateRequest,
  UpdateTemplateRequest,
} from "../../dto/template.dto";
import { noteRepository } from "../../repository/note.repository";
import { templateRepository } from "../../repository/template.repository";
import {
  type DbClient,
  transactionRepository,
} from "../../repository/transaction.repository";

export class TemplateService {
  constructor(
    private templateRepository: ITemplateRepository,
    private noteRepository: INoteRepository,
    private transactionManager: ITransactionManager<DbClient>,
  ) {}

  async getTemplateById(id: string): Promise<Template | null> {
    return this.templateRepository.findById(id);
  }

  async getTemplates(filters?: {
    ownerId?: string;
    q?: string;
  }): Promise<Template[]> {
    // Convert 'q' parameter to 'search' for repository
    const repoFilters = filters
      ? {
          ownerId: filters.ownerId,
          search: filters.q,
        }
      : undefined;

    return this.templateRepository.findAll(repoFilters);
  }

  async createTemplate(
    ownerId: string,
    input: CreateTemplateRequest,
  ): Promise<Template> {
    return this.transactionManager.execute(async (tx) => {
      return this.templateRepository.create(
        {
          name: input.name,
          ownerId,
          fields: input.fields,
        },
        tx,
      );
    });
  }

  async updateTemplate(
    id: string,
    ownerId: string,
    input: UpdateTemplateRequest,
  ): Promise<{ template: Template; isUsed: boolean }> {
    return this.transactionManager.execute(async (tx) => {
      // Check if template exists and belongs to the owner
      const existing = await this.templateRepository.findById(id, tx);
      if (!existing) {
        throw new Error("Template not found");
      }

      if (existing.ownerId !== ownerId) {
        throw new Error("Unauthorized");
      }

      // 利用中かどうかをサービス層で判断（ビジネスルール）
      const isUsed = await this.noteRepository.existsByTemplateId(id, tx);

      // Update template
      const updatedTemplate = Template.create({
        id: existing.id,
        name: input.name,
        ownerId: existing.ownerId,
        fields: input.fields.map((f) => ({
          id: f.id || crypto.randomUUID(),
          label: f.label,
          order: f.order,
          isRequired: f.isRequired,
        })),
        updatedAt: new Date(),
      });

      await this.templateRepository.save(updatedTemplate, tx, {
        isUsedByNotes: isUsed,
      });
      return { template: updatedTemplate, isUsed };
    });
  }

  async deleteTemplate(id: string, ownerId: string): Promise<void> {
    return this.transactionManager.execute(async (tx) => {
      const template = await this.templateRepository.findById(id, tx);
      if (!template) {
        throw new Error("Template not found");
      }

      if (template.ownerId !== ownerId) {
        throw new Error("Unauthorized");
      }

      // 利用中のテンプレートは削除できない
      const isUsed = await this.noteRepository.existsByTemplateId(id, tx);
      if (isUsed) {
        throw new Error("Template is in use");
      }

      await this.templateRepository.delete(id, tx);
    });
  }

  async getAccountForTemplate(ownerId: string) {
    return this.templateRepository.getAccountForTemplate(ownerId);
  }

  async isTemplateUsed(templateId: string): Promise<boolean> {
    return this.noteRepository.existsByTemplateId(templateId);
  }
}

// シングルトンインスタンスをエクスポート
export const templateService = new TemplateService(
  templateRepository,
  noteRepository,
  transactionRepository,
);

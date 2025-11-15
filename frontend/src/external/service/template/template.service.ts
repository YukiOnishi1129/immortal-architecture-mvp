import { Template } from "../../domain/template/template.entity";
import type { ITemplateRepository } from "../../domain/template/template.repository.interface";
import type { ITransactionManager } from "../../domain/transaction/transaction-manager.interface";
import type {
  CreateTemplateRequest,
  UpdateTemplateRequest,
} from "../../dto/template.dto";
import { templateRepository } from "../../repository/template.repository";
import {
  type DbClient,
  transactionRepository,
} from "../../repository/transaction.repository";

export class TemplateService {
  constructor(
    private templateRepository: ITemplateRepository,
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
  ): Promise<Template> {
    return this.transactionManager.execute(async (tx) => {
      // Check if template exists and belongs to the owner
      const existing = await this.templateRepository.findById(id, tx);
      if (!existing) {
        throw new Error("Template not found");
      }

      if (existing.ownerId !== ownerId) {
        throw new Error("Unauthorized");
      }

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

      await this.templateRepository.save(updatedTemplate, tx);
      return updatedTemplate;
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

      await this.templateRepository.delete(id, tx);
    });
  }

  async getAccountForTemplate(ownerId: string) {
    return this.templateRepository.getAccountForTemplate(ownerId);
  }
}

// シングルトンインスタンスをエクスポート
export const templateService = new TemplateService(
  templateRepository,
  transactionRepository,
);

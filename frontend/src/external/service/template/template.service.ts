import { Template } from "../../domain/template/template.entity";
import type { ITemplateRepository } from "../../domain/template/template.repository.interface";
import type {
  CreateTemplateRequest,
  UpdateTemplateRequest,
} from "../../dto/template.dto";
import { templateRepository } from "../../repository/template.repository";

export class TemplateService {
  constructor(private templateRepository: ITemplateRepository) {}

  async getTemplateById(id: string): Promise<Template | null> {
    return this.templateRepository.findById(id);
  }

  async getTemplates(ownerId?: string): Promise<Template[]> {
    return ownerId
      ? this.templateRepository.findByOwnerId(ownerId)
      : this.templateRepository.findAll();
  }

  async createTemplate(
    ownerId: string,
    input: CreateTemplateRequest,
  ): Promise<Template> {
    return this.templateRepository.create({
      name: input.name,
      ownerId,
      fields: input.fields,
    });
  }

  async updateTemplate(
    id: string,
    ownerId: string,
    input: UpdateTemplateRequest,
  ): Promise<Template> {
    // Check if template exists and belongs to the owner
    const existing = await this.templateRepository.findById(id);
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

    await this.templateRepository.save(updatedTemplate);
    return updatedTemplate;
  }

  async deleteTemplate(id: string, ownerId: string): Promise<void> {
    const template = await this.templateRepository.findById(id);
    if (!template) {
      throw new Error("Template not found");
    }

    if (template.ownerId !== ownerId) {
      throw new Error("Unauthorized");
    }

    await this.templateRepository.delete(id);
  }
}

// シングルトンインスタンスをエクスポート
export const templateService = new TemplateService(templateRepository);

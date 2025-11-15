import type { Account } from "../../client/database/schema";
import type { Template } from "./template.entity";

export interface TemplateFilters {
  search?: string;
  ownerId?: string;
}

export interface ITemplateRepository {
  findById(id: string): Promise<Template | null>;
  findAll(filters?: TemplateFilters): Promise<Template[]>;
  findByOwnerId(ownerId: string): Promise<Template[]>;
  save(template: Template): Promise<void>;
  create(data: {
    name: string;
    ownerId: string;
    fields: Array<{
      label: string;
      order: number;
      isRequired: boolean;
    }>;
  }): Promise<Template>;
  delete(id: string): Promise<void>;
  getAccountForTemplate(ownerId: string): Promise<Account | null>;
}

import type { Account } from "../../client/database/schema";
import type { DbClient } from "../../repository/transaction.repository";
import type { Template } from "./template.entity";

export interface TemplateFilters {
  search?: string;
  ownerId?: string;
}

export interface ITemplateRepository {
  findById(id: string, client?: DbClient): Promise<Template | null>;
  findAll(filters?: TemplateFilters, client?: DbClient): Promise<Template[]>;
  findByOwnerId(ownerId: string, client?: DbClient): Promise<Template[]>;
  save(template: Template, client?: DbClient): Promise<void>;
  create(
    data: {
      name: string;
      ownerId: string;
      fields: Array<{
        label: string;
        order: number;
        isRequired: boolean;
      }>;
    },
    client?: DbClient,
  ): Promise<Template>;
  delete(id: string, client?: DbClient): Promise<void>;
  getAccountForTemplate(
    ownerId: string,
    client?: DbClient,
  ): Promise<Account | null>;
  isUsedByNotes(id: string, client?: DbClient): Promise<boolean>;
}

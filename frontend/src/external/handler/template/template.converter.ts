import "server-only";

import type { Account } from "../../domain/account/account.entity";
import type { Template } from "../../domain/template/template.entity";
import {
  type TemplateDetailResponse,
  TemplateDetailResponseSchema,
  type TemplateResponse,
  TemplateResponseSchema,
} from "../../dto/template.dto";

type TemplateOwner = Pick<
  Account,
  "id" | "firstName" | "lastName" | "thumbnail"
>;

/**
 * Template ドメインエンティティを TemplateResponse DTO に変換する
 */
export function toTemplateResponse(
  template: Template,
  owner: TemplateOwner,
  isUsed?: boolean,
): TemplateResponse {
  const response = {
    id: template.id,
    name: template.name,
    ownerId: template.ownerId,
    owner: {
      id: owner.id,
      firstName: owner.firstName,
      lastName: owner.lastName,
      thumbnail: owner.thumbnail,
    },
    fields: template.fields.map((field) => ({
      id: field.id,
      label: field.label,
      order: field.order,
      isRequired: field.isRequired,
    })),
    updatedAt: template.updatedAt.toISOString(),
    isUsed,
  };

  return TemplateResponseSchema.parse(response);
}

/**
 * Template ドメインエンティティを TemplateDetailResponse DTO に変換する
 */
export function toTemplateDetailResponse(
  template: Template,
  owner: TemplateOwner,
  isUsed?: boolean,
): TemplateDetailResponse {
  const response = {
    id: template.id,
    name: template.name,
    ownerId: template.ownerId,
    owner: {
      id: owner.id,
      firstName: owner.firstName,
      lastName: owner.lastName,
      thumbnail: owner.thumbnail,
    },
    fields: template.fields.map((field) => ({
      id: field.id,
      label: field.label,
      order: field.order,
      isRequired: field.isRequired,
    })),
    updatedAt: template.updatedAt.toISOString(),
    isUsed,
  };

  return TemplateDetailResponseSchema.parse(response);
}

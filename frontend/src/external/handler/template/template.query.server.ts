import "server-only";

import { getSessionServer } from "@/features/auth/servers/auth.server";
import {
  getAuthenticatedSessionServer,
  requireAuthServer,
} from "@/features/auth/servers/redirect.server";
import type { TemplateFilters } from "@/features/template/types";
import {
  TemplateDetailResponseSchema,
  TemplateResponseSchema,
} from "../../dto/template.dto";
import { templateRepository } from "../../repository/template.repository";
import { templateService } from "../../service/template/template.service";

export async function getTemplateByIdQuery(id: string) {
  const template = await templateService.getTemplateById(id);

  if (!template) {
    return null;
  }

  // Check if template is used by notes and get owner info
  const [isUsed, owner] = await Promise.all([
    templateRepository.isUsedByNotes(id),
    templateService.getAccountForTemplate(template.ownerId),
  ]);

  if (!owner) {
    throw new Error("Owner not found");
  }

  // Convert domain entity to response DTO with owner info
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

  // Validate response with DTO schema
  return TemplateDetailResponseSchema.parse(response);
}

export async function listTemplatesQuery(filters?: TemplateFilters) {
  await requireAuthServer();

  // Get current user for onlyMyTemplates filter
  const session = await getSessionServer();

  // If onlyMyTemplates is true, add the current user's ID as ownerId filter
  const adjustedFilters =
    filters?.onlyMyTemplates && session?.account.id
      ? { ...filters, ownerId: session.account.id }
      : filters;

  // Pass filters to service
  const templates = await templateService.getTemplates(adjustedFilters);

  // Convert domain entities to response DTOs with isUsed status and owner info
  return Promise.all(
    templates.map(async (template) => {
      const [isUsed, owner] = await Promise.all([
        templateRepository.isUsedByNotes(template.id),
        templateService.getAccountForTemplate(template.ownerId),
      ]);

      if (!owner) {
        throw new Error("Owner not found");
      }

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
    }),
  );
}

export async function listMyTemplatesQuery() {
  const session = await getAuthenticatedSessionServer();

  const templates = await templateService.getTemplates({
    ownerId: session.account.id,
  });

  // Convert domain entities to response DTOs with isUsed status and owner info
  return Promise.all(
    templates.map(async (template) => {
      const [isUsed, owner] = await Promise.all([
        templateRepository.isUsedByNotes(template.id),
        templateService.getAccountForTemplate(template.ownerId),
      ]);

      if (!owner) {
        throw new Error("Owner not found");
      }

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
    }),
  );
}

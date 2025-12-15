import "server-only";

import { withAuth } from "@/features/auth/servers/auth.guard";
import type { TemplateFilters } from "@/features/template/types";
import {
  type GetTemplateByIdRequest,
  GetTemplateByIdRequestSchema,
} from "../../dto/template.dto";
import { templateService } from "../../service/template/template.service";
import {
  toTemplateDetailResponse,
  toTemplateResponse,
} from "./template.converter";

export async function getTemplateByIdQuery(request: GetTemplateByIdRequest) {
  const validated = GetTemplateByIdRequestSchema.parse(request);
  const template = await templateService.getTemplateById(validated.id);

  if (!template) {
    return null;
  }

  const [isUsed, owner] = await Promise.all([
    templateService.isTemplateUsed(validated.id),
    templateService.getAccountForTemplate(template.ownerId),
  ]);

  if (!owner) {
    throw new Error("Owner not found");
  }

  return toTemplateDetailResponse(template, owner, isUsed);
}

export async function listTemplatesQuery(filters?: TemplateFilters) {
  return withAuth(async ({ accountId }) => {
    const adjustedFilters =
      filters?.onlyMyTemplates && accountId
        ? { ...filters, ownerId: accountId }
        : filters;

    const templates = await templateService.getTemplates(adjustedFilters);

    return Promise.all(
      templates.map(async (template) => {
        const [isUsed, owner] = await Promise.all([
          templateService.isTemplateUsed(template.id),
          templateService.getAccountForTemplate(template.ownerId),
        ]);

        if (!owner) {
          throw new Error("Owner not found");
        }

        return toTemplateResponse(template, owner, isUsed);
      }),
    );
  });
}

export async function listMyTemplatesQuery() {
  return withAuth(async ({ accountId }) => {
    const templates = await templateService.getTemplates({
      ownerId: accountId,
    });

    return Promise.all(
      templates.map(async (template) => {
        const [isUsed, owner] = await Promise.all([
          templateService.isTemplateUsed(template.id),
          templateService.getAccountForTemplate(template.ownerId),
        ]);

        if (!owner) {
          throw new Error("Owner not found");
        }

        return toTemplateResponse(template, owner, isUsed);
      }),
    );
  });
}

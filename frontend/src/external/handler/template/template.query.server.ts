import "server-only";

import { redirect } from "next/navigation";
import { getSessionServer } from "@/features/auth/servers/auth.server";
import { requireAuthServer } from "@/features/auth/servers/redirect.server";
import type { TemplateFilters } from "@/features/template/types";
import { TemplateResponseSchema } from "../../dto/template.dto";
import { templateService } from "../../service/template/template.service";

export async function getTemplateByIdServer(id: string) {
  const template = await templateService.getTemplateById(id);

  if (!template) {
    return null;
  }

  // Convert domain entity to response DTO
  const response = {
    id: template.id,
    name: template.name,
    fields: template.fields.map((field) => ({
      id: field.id,
      label: field.label,
      order: field.order,
      isRequired: field.isRequired,
    })),
    updatedAt: template.updatedAt.toISOString(),
  };

  // Validate response with DTO schema
  return TemplateResponseSchema.parse(response);
}

export async function listTemplatesServer(filters?: TemplateFilters) {
  await requireAuthServer();

  // If filters include ownerId, use it. Otherwise, show all public templates
  const templates = await templateService.getTemplates(filters?.ownerId);

  // Convert domain entities to response DTOs
  return templates.map((template) => {
    const response = {
      id: template.id,
      name: template.name,
      fields: template.fields.map((field) => ({
        id: field.id,
        label: field.label,
        order: field.order,
        isRequired: field.isRequired,
      })),
      updatedAt: template.updatedAt.toISOString(),
    };
    return TemplateResponseSchema.parse(response);
  });
}

export async function listMyTemplatesServer() {
  const session = await getSessionServer();
  if (!session?.account.id) {
    redirect("/login");
  }

  const templates = await templateService.getTemplates(session.account.id);

  // Convert domain entities to response DTOs
  return templates.map((template) => {
    const response = {
      id: template.id,
      name: template.name,
      fields: template.fields.map((field) => ({
        id: field.id,
        label: field.label,
        order: field.order,
        isRequired: field.isRequired,
      })),
      updatedAt: template.updatedAt.toISOString(),
    };
    return TemplateResponseSchema.parse(response);
  });
}

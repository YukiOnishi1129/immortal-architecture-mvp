import "server-only";
import { getAuthenticatedSessionServer } from "@/features/auth/servers/redirect.server";
import {
  CreateTemplateRequestSchema,
  TemplateResponseSchema,
  UpdateTemplateRequestSchema,
} from "../../dto/template.dto";
import { templateRepository } from "../../repository/template.repository";
import { templateService } from "../../service/template/template.service";

export async function createTemplateCommand(request: unknown) {
  const session = await getAuthenticatedSessionServer();

  // Validate request
  const validated = CreateTemplateRequestSchema.parse(request);

  // Create template
  const template = await templateService.createTemplate(
    session.account.id,
    validated,
  );

  // Get owner information
  const owner = await templateService.getAccountForTemplate(template.ownerId);
  if (!owner) {
    throw new Error("Owner not found");
  }

  // Convert domain entity to response DTO
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
    isUsed: false,
  };

  return TemplateResponseSchema.parse(response);
}

export async function updateTemplateCommand(id: string, request: unknown) {
  const session = await getAuthenticatedSessionServer();

  try {
    // Validate request
    const validated = UpdateTemplateRequestSchema.parse(request);

    // Update template
    const template = await templateService.updateTemplate(
      id,
      session.account.id,
      validated,
    );

    // Get owner information and isUsed status
    const [owner, isUsed] = await Promise.all([
      templateService.getAccountForTemplate(template.ownerId),
      templateRepository.isUsedByNotes(template.id),
    ]);

    if (!owner) {
      throw new Error("Owner not found");
    }

    // Convert domain entity to response DTO
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
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "TEMPLATE_FIELD_IN_USE") {
        throw new Error(
          "テンプレートの項目は変更・削除できません。ノートで使用されています。",
        );
      }
      if (error.message === "TEMPLATE_STRUCTURE_LOCKED") {
        throw new Error(
          "テンプレートの項目は変更・削除できません。ノートで使用されています。",
        );
      }
    }
    throw error;
  }
}

export async function deleteTemplateCommand(id: string) {
  const session = await getAuthenticatedSessionServer();

  // Delete template
  await templateService.deleteTemplate(id, session.account.id);
  return { success: true };
}

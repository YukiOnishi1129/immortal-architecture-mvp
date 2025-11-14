import "server-only";
import { redirect } from "next/navigation";
import { getSessionServer } from "@/features/auth/servers/auth.server";
import {
  CreateTemplateRequestSchema,
  TemplateResponseSchema,
  UpdateTemplateRequestSchema,
} from "../../dto/template.dto";
import { templateService } from "../../service/template/template.service";

export async function createTemplateServer(request: unknown) {
  const session = await getSessionServer();
  if (!session?.account.id) {
    redirect("/login");
  }

  // Validate request
  const validated = CreateTemplateRequestSchema.parse(request);

  // Create template
  const template = await templateService.createTemplate(
    session.account.id,
    validated,
  );

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

  return TemplateResponseSchema.parse(response);
}

export async function updateTemplateServer(id: string, request: unknown) {
  const session = await getSessionServer();
  if (!session?.account.id) {
    redirect("/login");
  }

  try {
    // Validate request
    const validated = UpdateTemplateRequestSchema.parse(request);

    // Update template
    const template = await templateService.updateTemplate(
      id,
      session.account.id,
      validated,
    );

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

export async function deleteTemplateServer(id: string) {
  const session = await getSessionServer();
  if (!session?.account.id) {
    redirect("/login");
  }

  // Delete template
  await templateService.deleteTemplate(id, session.account.id);
  return { success: true };
}

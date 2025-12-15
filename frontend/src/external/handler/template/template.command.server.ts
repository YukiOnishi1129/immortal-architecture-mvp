import "server-only";

import { withAuth } from "@/features/auth/servers/auth.guard";
import {
  type CreateTemplateRequest,
  CreateTemplateRequestSchema,
  type DeleteTemplateRequest,
  DeleteTemplateRequestSchema,
  type UpdateTemplateRequest,
  UpdateTemplateRequestSchema,
} from "../../dto/template.dto";
import { templateService } from "../../service/template/template.service";
import { toTemplateResponse } from "./template.converter";

export async function createTemplateCommand(request: CreateTemplateRequest) {
  return withAuth(async ({ accountId }) => {
    const validated = CreateTemplateRequestSchema.parse(request);

    const template = await templateService.createTemplate(accountId, validated);

    const owner = await templateService.getAccountForTemplate(template.ownerId);
    if (!owner) {
      throw new Error("Owner not found");
    }

    return toTemplateResponse(template, owner, false);
  });
}

export async function updateTemplateCommand(request: UpdateTemplateRequest) {
  return withAuth(async ({ accountId }) => {
    try {
      const validated = UpdateTemplateRequestSchema.parse(request);

      const { template, isUsed } = await templateService.updateTemplate(
        validated.id,
        accountId,
        validated,
      );

      const owner = await templateService.getAccountForTemplate(
        template.ownerId,
      );
      if (!owner) {
        throw new Error("Owner not found");
      }

      return toTemplateResponse(template, owner, isUsed);
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
  });
}

export async function deleteTemplateCommand(request: DeleteTemplateRequest) {
  return withAuth(async ({ accountId }) => {
    const validated = DeleteTemplateRequestSchema.parse(request);
    await templateService.deleteTemplate(validated.id, accountId);
    return { success: true };
  });
}

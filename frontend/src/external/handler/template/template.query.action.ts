"use server";

import type { GetTemplateByIdRequest } from "@/external/dto/template.dto";
import { withAuth } from "@/features/auth/servers/auth.guard";
import type { TemplateFilters } from "@/features/template/types";
import {
  getTemplateByIdQuery,
  listMyTemplatesQuery,
  listTemplatesQuery,
} from "./template.query.server";

export async function getTemplateByIdQueryAction(
  request: GetTemplateByIdRequest,
) {
  return withAuth(() => getTemplateByIdQuery(request));
}

export async function listTemplatesQueryAction(filters?: TemplateFilters) {
  return withAuth(({ accountId }) => listTemplatesQuery(filters, accountId));
}

export async function listMyTemplatesQueryAction() {
  return withAuth(({ accountId }) => listMyTemplatesQuery(accountId));
}

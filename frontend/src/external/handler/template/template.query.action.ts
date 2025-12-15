"use server";

import type { GetTemplateByIdRequest } from "@/external/dto/template.dto";
import type { TemplateFilters } from "@/features/template/types";
import {
  getTemplateByIdQuery,
  listMyTemplatesQuery,
  listTemplatesQuery,
} from "./template.query.server";

export async function getTemplateByIdQueryAction(
  request: GetTemplateByIdRequest,
) {
  return getTemplateByIdQuery(request);
}

export async function listTemplatesQueryAction(filters?: TemplateFilters) {
  return listTemplatesQuery(filters);
}

export async function listMyTemplatesQueryAction() {
  return listMyTemplatesQuery();
}

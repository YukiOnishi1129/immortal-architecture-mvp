"use server";

import type { TemplateFilters } from "@/features/templates/types";
import {
  getTemplateByIdServer,
  listMyTemplatesServer,
  listTemplatesServer,
} from "./template.query.server";

export async function getTemplateByIdAction(id: string) {
  return getTemplateByIdServer(id);
}

export async function listTemplatesAction(filters?: TemplateFilters) {
  return listTemplatesServer(filters);
}

export async function listMyTemplatesAction() {
  return listMyTemplatesServer();
}

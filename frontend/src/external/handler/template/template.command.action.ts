"use server";

import type {
  CreateTemplateRequest,
  UpdateTemplateRequest,
} from "@/external/dto/template.dto";
import {
  createTemplateServer,
  deleteTemplateServer,
  updateTemplateServer,
} from "./template.command.server";

export async function createTemplateAction(request: CreateTemplateRequest) {
  return createTemplateServer(request);
}

export async function updateTemplateAction(
  id: string,
  request: UpdateTemplateRequest,
) {
  return updateTemplateServer(id, request);
}

export async function deleteTemplateAction(id: string) {
  return deleteTemplateServer(id);
}

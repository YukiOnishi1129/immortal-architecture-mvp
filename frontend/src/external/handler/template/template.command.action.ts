"use server";

import type {
  CreateTemplateRequest,
  DeleteTemplateRequest,
  UpdateTemplateRequest,
} from "@/external/dto/template.dto";
import {
  createTemplateCommand,
  deleteTemplateCommand,
  updateTemplateCommand,
} from "./template.command.server";

export async function createTemplateCommandAction(
  request: CreateTemplateRequest,
) {
  return createTemplateCommand(request);
}

export async function updateTemplateCommandAction(
  request: UpdateTemplateRequest,
) {
  return updateTemplateCommand(request);
}

export async function deleteTemplateCommandAction(
  request: DeleteTemplateRequest,
) {
  return deleteTemplateCommand(request);
}

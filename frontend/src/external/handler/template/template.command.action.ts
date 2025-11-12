"use server";

import {
  createTemplateServer,
  deleteTemplateServer,
  updateTemplateServer,
} from "./template.command.server";

export async function createTemplateAction(request: unknown) {
  return createTemplateServer(request);
}

export async function updateTemplateAction(id: string, request: unknown) {
  return updateTemplateServer(id, request);
}

export async function deleteTemplateAction(id: string) {
  return deleteTemplateServer(id);
}

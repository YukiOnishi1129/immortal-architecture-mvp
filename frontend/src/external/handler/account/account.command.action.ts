"use server";

import type {
  CreateOrGetAccountRequest,
  CreateOrGetAccountResponse,
  UpdateAccountRequest,
  UpdateAccountResponse,
} from "../../dto/account.dto";
import {
  createOrGetAccount,
  updateAccountServer,
} from "./account.command.server";

export async function createOrGetAccountAction(
  request: CreateOrGetAccountRequest,
): Promise<CreateOrGetAccountResponse> {
  return createOrGetAccount(request);
}

export async function updateAccountAction(
  id: string,
  request: UpdateAccountRequest,
): Promise<UpdateAccountResponse> {
  return updateAccountServer(id, request);
}

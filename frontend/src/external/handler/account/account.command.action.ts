"use server";

import { withAuth } from "@/features/auth/servers/auth.guard";
import type {
  CreateOrGetAccountRequest,
  CreateOrGetAccountResponse,
  UpdateAccountRequest,
  UpdateAccountResponse,
} from "../../dto/account.dto";
import {
  createOrGetAccountCommand,
  updateAccountCommand,
} from "./account.command.server";

/**
 * OAuth認証時に呼ばれるため、認証チェックなし
 * better-auth の onSuccess / customSession から呼ばれる
 */
export async function createOrGetAccountCommandAction(
  request: CreateOrGetAccountRequest,
): Promise<CreateOrGetAccountResponse> {
  return createOrGetAccountCommand(request);
}

export async function updateAccountCommandAction(
  request: UpdateAccountRequest,
): Promise<UpdateAccountResponse> {
  return withAuth(({ accountId }) => updateAccountCommand(request, accountId));
}

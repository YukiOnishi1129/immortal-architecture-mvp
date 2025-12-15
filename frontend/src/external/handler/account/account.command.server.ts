import "server-only";

import { withAuth } from "@/features/auth/servers/auth.guard";
import type { Account } from "../../domain/account/account.entity";
import {
  AccountResponseSchema,
  type CreateOrGetAccountRequest,
  CreateOrGetAccountRequestSchema,
  type CreateOrGetAccountResponse,
  type UpdateAccountRequest,
  UpdateAccountRequestSchema,
  type UpdateAccountResponse,
} from "../../dto/account.dto";
import { accountService } from "../../service/account/account.service";

function toAccountResponse(account: Account): CreateOrGetAccountResponse {
  const response = {
    id: account.id,
    email: account.email.getValue(),
    firstName: account.firstName,
    lastName: account.lastName,
    fullName: account.fullName,
    thumbnail: account.thumbnail,
    lastLoginAt: account.lastLoginAt?.toISOString() ?? null,
    createdAt: account.createdAt.toISOString(),
    updatedAt: account.updatedAt.toISOString(),
  };

  return AccountResponseSchema.parse(response);
}

export async function createOrGetAccountCommand(
  request: CreateOrGetAccountRequest,
): Promise<CreateOrGetAccountResponse> {
  const validated = CreateOrGetAccountRequestSchema.parse(request);

  const domainAccount = await accountService.createOrGet(
    validated.provider,
    validated.providerAccountId,
    validated,
  );

  return toAccountResponse(domainAccount);
}

export async function updateAccountCommand(
  request: UpdateAccountRequest,
): Promise<UpdateAccountResponse> {
  return withAuth(async ({ accountId }) => {
    const validated = UpdateAccountRequestSchema.parse(request);

    if (accountId !== validated.id) {
      throw new Error("Forbidden: Can only update your own account");
    }

    const updatedAccount = await accountService.update(validated.id, validated);

    return toAccountResponse(updatedAccount);
  });
}

import "server-only";
import { getSessionServer } from "@/features/auth/servers/auth.server";
import { AccountResponseSchema } from "../../dto/account.dto";
import { accountService } from "../../service/account/account.service";

export async function getCurrentAccountQuery() {
  const session = await getSessionServer();
  if (!session?.account?.id) {
    return null;
  }

  const account = await accountService.getAccountById(session.account.id);
  if (!account) {
    return null;
  }

  // Convert domain entity to response DTO
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

  // Validate response with DTO schema
  return AccountResponseSchema.parse(response);
}

export async function getAccountByIdQuery(id: string) {
  const account = await accountService.getAccountById(id);

  if (!account) {
    return null;
  }

  // Convert domain entity to response DTO
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

  // Validate response with DTO schema
  return AccountResponseSchema.parse(response);
}

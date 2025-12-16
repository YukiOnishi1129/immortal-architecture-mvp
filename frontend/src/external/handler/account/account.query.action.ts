"use server";

import type { GetAccountByIdRequest } from "@/external/dto/account.dto";
import { withAuth } from "@/features/auth/servers/auth.guard";
import {
  getAccountByIdQuery,
  getCurrentAccountQuery,
} from "./account.query.server";

export async function getCurrentAccountQueryAction() {
  return withAuth(() => getCurrentAccountQuery());
}

export async function getAccountByIdQueryAction(
  request: GetAccountByIdRequest,
) {
  return withAuth(() => getAccountByIdQuery(request));
}

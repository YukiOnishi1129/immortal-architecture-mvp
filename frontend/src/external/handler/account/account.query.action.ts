"use server";

import {
  getAccountByIdServer,
  getCurrentAccountServer,
} from "./account.query.server";

export async function getCurrentAccountAction() {
  return getCurrentAccountServer();
}

export async function getAccountByIdAction(id: string) {
  return getAccountByIdServer(id);
}

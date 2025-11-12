import "server-only";

import { getSessionServer } from "@/features/auth/server/auth.server";

export async function checkAuthAndRefreshServer(): Promise<boolean> {
  const account = await getSessionServer();
  return Boolean(account);
}

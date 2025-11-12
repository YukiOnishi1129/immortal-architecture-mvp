import "server-only";

import { redirect } from "next/navigation";

import { getSessionServer } from "@/features/auth/servers/auth.server";

export const requireAuthServer = async () => {
  const session = await getSessionServer();
  if (!session?.account || session.error) {
    redirect("/login");
  }
};

export const redirectIfAuthenticatedServer = async () => {
  const session = await getSessionServer();
  if (session?.account && !session.error) {
    redirect("/notes");
  }
};

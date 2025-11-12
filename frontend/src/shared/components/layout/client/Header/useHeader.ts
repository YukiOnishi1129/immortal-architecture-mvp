"use client";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useCallback } from "react";

export function useHeader() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false });
    router.push("/login");
  }, [router]);

  return {
    userName: session?.user?.name || undefined,
    userEmail: session?.user?.email || undefined,
    handleSignOut,
  };
}

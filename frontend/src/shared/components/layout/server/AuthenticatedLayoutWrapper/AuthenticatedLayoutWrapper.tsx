import { requireAuthServer } from "@/features/auth/servers/redirect.server";

import { Header } from "@/shared/components/layout/client/Header";
import { Sidebar } from "@/shared/components/layout/client/Sidebar";
import { Toaster } from "@/shared/components/ui/sonner";

type AuthenticatedLayoutWrapperProps = {
  children: React.ReactNode;
};

export async function AuthenticatedLayoutWrapper({
  children,
}: AuthenticatedLayoutWrapperProps) {
  await requireAuthServer();

  return (
    <div className="bg-background flex h-screen w-full flex-col overflow-hidden">
      <Header />
      <div className="flex h-[calc(100vh-4rem)] flex-1 overflow-hidden">
        <Sidebar />
        <main className="bg-muted/20 flex-1 overflow-y-auto">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}

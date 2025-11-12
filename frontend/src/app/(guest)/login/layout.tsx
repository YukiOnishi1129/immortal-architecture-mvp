import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Immortal Architecture",
  description: "Login to your Immortal Architecture account",
};

export default function LoginLayout({ children }: LayoutProps<"/login">) {
  return <>{children}</>;
}

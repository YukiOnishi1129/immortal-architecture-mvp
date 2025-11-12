import type { Metadata } from "next";
import { LoginPageTemplate } from "@/features/auth/components/server/LoginPageTemplate";

export const metadata: Metadata = {
  title: "ログイン | Mini Notion",
  description: "設計メモを構造化して残すミニノートアプリ",
};

export default function LoginPage() {
  return <LoginPageTemplate />;
}

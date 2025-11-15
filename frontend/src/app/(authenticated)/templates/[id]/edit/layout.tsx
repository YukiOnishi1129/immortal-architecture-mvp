import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "テンプレート編集 | Mini Notion",
  description: "設計メモを構造化して残すミニノートアプリ",
};

export default function TemplateEditLayout({
  children,
}: LayoutProps<"/templates/[id]/edit">) {
  return <>{children}</>;
}

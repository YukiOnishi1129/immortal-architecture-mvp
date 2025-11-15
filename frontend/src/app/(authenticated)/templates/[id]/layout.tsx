import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "テンプレート詳細 | Mini Notion",
  description: "設計メモを構造化して残すミニノートアプリ",
};

export default function TemplateDetailLayout({
  children,
}: LayoutProps<"/templates/[id]">) {
  return <>{children}</>;
}

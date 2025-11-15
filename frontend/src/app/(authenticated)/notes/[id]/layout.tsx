import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `ノート詳細 | Mini Notion`,
  description: "設計メモを構造化して残すミニノートアプリ",
};

export default function NoteDetailLayout({
  children,
}: LayoutProps<"/notes/[id]">) {
  return <>{children}</>;
}

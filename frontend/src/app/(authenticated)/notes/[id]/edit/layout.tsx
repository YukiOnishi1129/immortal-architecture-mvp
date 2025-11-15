import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `ノート編集 | Mini Notion`,
  description: "設計メモを構造化して残すミニノートアプリ",
};

export default async function NoteEditLayout({
  children,
}: LayoutProps<"/notes/[id]/edit">) {
  return children;
}

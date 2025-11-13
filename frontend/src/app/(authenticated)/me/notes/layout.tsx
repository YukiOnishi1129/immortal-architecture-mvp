import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "マイノート一覧 | Mini Notion",
  description: "設計メモを構造化して残すミニノートアプリ",
};

export default async function MyNoteListLayout({
  children,
}: LayoutProps<"/me/notes">) {
  return children;
}

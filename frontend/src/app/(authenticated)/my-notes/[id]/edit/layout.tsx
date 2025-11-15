import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ノート編集 | Mini Notion",
  description: "設計メモを構造化して残すミニノートアプリ",
};

export default function MyNoteEditLayout({
  children,
}: LayoutProps<"/my-notes/[id]/edit">) {
  return <>{children}</>;
}

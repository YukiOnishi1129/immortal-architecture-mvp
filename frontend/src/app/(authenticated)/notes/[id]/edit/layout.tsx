import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: LayoutProps<"/notes/[id]">): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `ノート編集 | Mini Notion`,
    description: "設計メモを構造化して残すミニノートアプリ",
  };
}

export default async function NoteEditLayout({
  children,
}: LayoutProps<"/notes/[id]/edit">) {
  return children;
}

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: LayoutProps<"/notes/[id]">): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `ノート詳細 - ${id}`,
  };
}

export default function NoteDetailLayout({
  children,
}: LayoutProps<"/notes/[id]">) {
  return <>{children}</>;
}

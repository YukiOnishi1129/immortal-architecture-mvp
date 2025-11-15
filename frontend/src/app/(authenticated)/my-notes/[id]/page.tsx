import type { Metadata } from "next";
import { MyNoteDetailPageTemplate } from "@/features/note/components/server/MyNoteDetailPageTemplate";

export const metadata: Metadata = {
  title: "ノート詳細 | マイノート",
  description: "ノートの詳細を表示",
};

export default async function MyNoteDetailPage({
  params,
}: PageProps<"/my-notes/[id]">) {
  const { id } = await params;
  return <MyNoteDetailPageTemplate noteId={id} />;
}

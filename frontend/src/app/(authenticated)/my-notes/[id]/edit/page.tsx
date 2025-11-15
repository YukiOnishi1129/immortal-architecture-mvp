import type { Metadata } from "next";
import { MyNoteEditPageTemplate } from "@/features/note/components/server/MyNoteEditPageTemplate";

export const metadata: Metadata = {
  title: "ノート編集 | マイノート",
  description: "ノートを編集する",
};

export default async function MyNoteEditPage({
  params,
}: PageProps<"/my-notes/[id]/edit">) {
  const { id } = await params;

  return <MyNoteEditPageTemplate noteId={id} />;
}

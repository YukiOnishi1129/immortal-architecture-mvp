import { NoteEditPageTemplate } from "@/features/note/components/server/NoteEditPageTemplate";

export default async function NoteEditPage({
  params,
}: PageProps<"/notes/[id]/edit">) {
  const { id } = await params;

  return <NoteEditPageTemplate noteId={id} />;
}

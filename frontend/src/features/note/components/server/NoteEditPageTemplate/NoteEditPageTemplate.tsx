import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { getNoteByIdServer } from "@/external/handler/note/note.query.server";
import { NoteEditForm } from "@/features/note/components/client/NoteEditForm";
import { noteKeys } from "@/features/note/queries/keys";

type NoteEditPageTemplateProps = {
  noteId: string;
};

export async function NoteEditPageTemplate({
  noteId,
}: NoteEditPageTemplateProps) {
  const queryClient = new QueryClient();

  const note = await getNoteByIdServer(noteId);

  if (!note) {
    redirect("/notes");
  }

  await queryClient.prefetchQuery({
    queryKey: noteKeys.detail(noteId),
    queryFn: () => note,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteEditForm noteId={noteId} />
    </HydrationBoundary>
  );
}

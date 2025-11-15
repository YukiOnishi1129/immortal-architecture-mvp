import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { getNoteByIdServer } from "@/external/handler/note/note.query.server";
import { getSessionServer } from "@/features/auth/servers/auth.server";
import { NoteEditForm } from "@/features/note/components/client/NoteEditForm";
import { noteKeys } from "@/features/note/queries/keys";

type NoteEditPageTemplateProps = {
  noteId: string;
};

export async function NoteEditPageTemplate({
  noteId,
}: NoteEditPageTemplateProps) {
  const queryClient = new QueryClient();

  const [session, note] = await Promise.all([
    getSessionServer(),
    getNoteByIdServer(noteId),
  ]);

  if (!note) {
    redirect("/notes");
  }

  // Check if the current user is the owner
  if (!session?.account?.id || session.account.id !== note.ownerId) {
    // 他人のノートは編集できない
    redirect(`/notes/${noteId}`);
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

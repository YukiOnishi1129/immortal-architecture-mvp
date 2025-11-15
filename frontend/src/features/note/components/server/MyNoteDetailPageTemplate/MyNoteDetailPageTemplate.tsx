import { redirect } from "next/navigation";
import { getNoteByIdServer } from "@/external/handler/note/note.query.server";
import { getSessionServer } from "@/features/auth/servers/auth.server";
import { NoteDetail } from "@/features/note/components/client/NoteDetail";

type MyNoteDetailPageTemplateProps = {
  noteId: string;
};

export async function MyNoteDetailPageTemplate({
  noteId,
}: MyNoteDetailPageTemplateProps) {
  const [session, note] = await Promise.all([
    getSessionServer(),
    getNoteByIdServer(noteId),
  ]);

  // Check if the current user is the owner
  const isOwner =
    !!session?.account?.id && session.account.id === note?.ownerId;

  // マイノート画面なので、自分のノートでなければリダイレクト
  if (!isOwner) {
    redirect("/my-notes");
  }

  return (
    <div className="container mx-auto py-6">
      <NoteDetail noteId={noteId} isOwner={true} backTo="/my-notes" />
    </div>
  );
}

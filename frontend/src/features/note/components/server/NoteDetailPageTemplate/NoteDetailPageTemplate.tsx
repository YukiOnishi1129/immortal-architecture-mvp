import { getNoteByIdServer } from "@/external/handler/note/note.query.server";
import { getSessionServer } from "@/features/auth/servers/auth.server";
import { NoteDetail } from "@/features/note/components/client/NoteDetail";

type NoteDetailPageTemplateProps = {
  noteId: string;
};

export async function NoteDetailPageTemplate({
  noteId,
}: NoteDetailPageTemplateProps) {
  const [session, _note] = await Promise.all([
    getSessionServer(),
    getNoteByIdServer(noteId),
  ]);

  // Check if the current user is the owner
  const isOwner = !!session?.account?.id;

  return (
    <div className="container mx-auto py-6">
      <NoteDetail noteId={noteId} isOwner={isOwner} />
    </div>
  );
}

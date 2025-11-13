import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { listMyNotesServer } from "@/external/handler/note/note.query.server";
import { MyNoteList } from "@/features/note/components/client/MyNoteList";
import { noteKeys } from "@/features/note/queries/keys";
import type { NoteStatus } from "@/features/note/types";

type MyNoteListPageTemplateProps = {
  status?: NoteStatus;
  q?: string;
  page?: number;
};

export async function MyNoteListPageTemplate({
  status,
  q,
  page,
}: MyNoteListPageTemplateProps) {
  const queryClient = new QueryClient();

  const filters = {
    status,
    q,
    page,
  };

  // ownerIdは認証情報から自動的に設定されるため、ここでは設定不要
  await queryClient.prefetchQuery({
    queryKey: noteKeys.list(filters),
    queryFn: () => listMyNotesServer(filters),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyNoteList initialFilters={filters} />
    </HydrationBoundary>
  );
}

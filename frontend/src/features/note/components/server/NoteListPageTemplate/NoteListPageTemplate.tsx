import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { listMyNotesServer } from "@/external/handler/note/note.query.server";
import { NoteListContainer } from "@/features/note/components/client/NoteList";
import { noteKeys } from "@/features/note/queries/keys";
import type { NoteFilters } from "@/features/note/types";
import { getQueryClient } from "@/shared/lib/query-client";

interface NoteListPageTemplateProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function NoteListPageTemplate({
  searchParams,
}: NoteListPageTemplateProps) {
  const queryClient = getQueryClient();

  const filters: NoteFilters = {
    q: typeof searchParams.q === "string" ? searchParams.q : undefined,
    status:
      searchParams.status === "Draft" || searchParams.status === "Publish"
        ? searchParams.status
        : undefined,
    page:
      typeof searchParams.page === "string"
        ? parseInt(searchParams.page, 10)
        : 1,
  };

  // データをプリフェッチ
  await queryClient.prefetchQuery({
    queryKey: noteKeys.list(filters),
    queryFn: () => listMyNotesServer(filters),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteListContainer initialFilters={filters} />
    </HydrationBoundary>
  );
}

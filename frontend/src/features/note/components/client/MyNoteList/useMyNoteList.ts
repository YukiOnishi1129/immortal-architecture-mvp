"use client";

import { useSearchParams } from "next/navigation";
import { NOTE_STATUS } from "@/features/note/constants";
import { useNoteListQuery } from "@/features/note/hooks/useNoteListQuery";
import type { NoteFilters } from "@/features/note/types";

type UseMyNotesParams = {
  initialFilters: NoteFilters;
};

export function useMyNoteList({ initialFilters }: UseMyNotesParams) {
  const searchParams = useSearchParams();

  const pageParam = searchParams.get("page");
  const statusParam = searchParams.get("status");

  const filters: NoteFilters = {
    ...initialFilters,
    status:
      statusParam === NOTE_STATUS.DRAFT || statusParam === NOTE_STATUS.PUBLISH
        ? statusParam
        : initialFilters.status,
    q: searchParams.get("q") || initialFilters.q,
    page: pageParam ? Number.parseInt(pageParam, 10) : initialFilters.page,
  };

  const { data, isLoading } = useNoteListQuery(filters);

  return {
    notes: data || [],
    isLoading,
    filters,
  };
}

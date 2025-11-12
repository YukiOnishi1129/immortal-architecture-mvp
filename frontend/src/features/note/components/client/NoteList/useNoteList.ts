"use client";

import { useSearchParams } from "next/navigation";
import { useNoteListQuery } from "@/features/note/hooks/useNoteQuery";
import type { NoteFilters } from "@/features/note/types";

export function useNoteList(initialFilters: NoteFilters = {}) {
  const searchParams = useSearchParams();

  const filters: NoteFilters = {
    q: searchParams.get("q") || initialFilters.q,
    status:
      (searchParams.get("status") as "Draft" | "Publish") ||
      initialFilters.status,
    page: Number(searchParams.get("page")) || initialFilters.page || 1,
  };

  const { data: notes, isLoading } = useNoteListQuery(filters);

  return {
    notes: notes || [],
    isLoading,
    filters,
  };
}

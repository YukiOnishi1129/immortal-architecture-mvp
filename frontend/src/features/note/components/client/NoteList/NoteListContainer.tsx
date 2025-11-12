"use client";

import type { Route } from "next";
import Link from "next/link";
import { NoteListFilter } from "@/features/note/components/client/NoteListFilter";
import type { NoteFilters } from "@/features/note/types";
import { Button } from "@/shared/components/ui/button";
import { NoteListPresenter } from "./NoteListPresenter";
import { useNoteList } from "./useNoteList";

interface NoteListContainerProps {
  initialFilters?: NoteFilters;
}

export function NoteListContainer({
  initialFilters = {},
}: NoteListContainerProps) {
  const { notes, isLoading } = useNoteList(initialFilters);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">ノート一覧</h1>
        <Button asChild>
          <Link href={"/notes/new" as Route}>新規作成</Link>
        </Button>
      </div>

      <NoteListFilter />
      <NoteListPresenter notes={notes} isLoading={isLoading} />
    </div>
  );
}

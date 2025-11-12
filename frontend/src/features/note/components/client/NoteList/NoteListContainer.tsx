"use client";

import { FileText } from "lucide-react";
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
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">ノート一覧</h1>
          <Button asChild>
            <Link href={"/notes/new" as Route}>
              <FileText className="mr-2 h-4 w-4" />
              新規作成
            </Link>
          </Button>
        </div>
        <NoteListFilter />
      </div>

      <NoteListPresenter notes={notes} isLoading={isLoading} />
    </div>
  );
}

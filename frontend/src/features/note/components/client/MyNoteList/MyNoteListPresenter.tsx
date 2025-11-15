"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import { NoteListPresenter } from "@/features/note/components/client/NoteList/NoteListPresenter";
import { NoteListFilter } from "@/features/note/components/client/NoteListFilter";
import type { Note, NoteFilters } from "@/features/note/types";
import { Button } from "@/shared/components/ui/button";

interface MyNotesPresenterProps {
  notes: Note[];
  isLoading?: boolean;
  filters: NoteFilters;
}

export function MyNoteListPresenter({
  notes,
  isLoading,
  filters,
}: MyNotesPresenterProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">マイノート</h1>
            <p className="mt-2 text-gray-600">あなたが作成したノートの一覧</p>
          </div>

          <Button asChild>
            <Link href={"/my-notes/new"} className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              新規作成
            </Link>
          </Button>
        </div>
        <NoteListFilter filters={filters} />
      </div>

      <NoteListPresenter
        notes={notes}
        isLoading={isLoading}
        linkPrefix="/my-notes"
      />
    </div>
  );
}

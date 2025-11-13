"use client";

import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import type { Route } from "next";
import Link from "next/link";
import { NoteListFilter } from "@/features/note/components/client/NoteListFilter";
import { NOTE_STATUS, NOTE_STATUS_LABELS } from "@/features/note/constants";
import type { Note, NoteFilters } from "@/features/note/types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">マイノート一覧</h1>
        <Button asChild>
          <Link href={"/notes/new" as Route}>新規作成</Link>
        </Button>
      </div>

      <div className="mb-6">
        <NoteListFilter filters={filters} />
      </div>

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => {
            const uniqueId = `my-notes-skeleton-${index}-${Date.now()}`;
            return (
              <Card key={uniqueId} className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-6 w-16" />
              </Card>
            );
          })}
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">まだノートがありません</p>
          <Link
            href={"/notes/new" as Route}
            className="text-blue-600 hover:underline"
          >
            最初のノートを作成する
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card
              key={note.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <Link
                href={`/notes/${note.id}` as Route}
                className="block p-6 h-full"
              >
                <div className="flex flex-col h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {note.title}
                  </h3>

                  <div className="flex-grow">
                    <p className="text-sm text-gray-600 mb-2">
                      テンプレート: {note.templateName}
                    </p>

                    {note.sections.length > 0 && note.sections[0].content && (
                      <p className="text-sm text-gray-500 line-clamp-3">
                        {note.sections[0].content}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <Badge
                      variant={
                        note.status === NOTE_STATUS.PUBLISH
                          ? "default"
                          : "secondary"
                      }
                    >
                      {NOTE_STATUS_LABELS[note.status]}
                    </Badge>

                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(note.updatedAt), {
                        addSuffix: true,
                        locale: ja,
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

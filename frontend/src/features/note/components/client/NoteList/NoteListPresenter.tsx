"use client";

import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import type { Route } from "next";
import Link from "next/link";
import type { NoteResponse } from "@/external/dto/note.dto";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

interface NoteListPresenterProps {
  notes: NoteResponse[];
  isLoading?: boolean;
}

export function NoteListPresenter({
  notes,
  isLoading,
}: NoteListPresenterProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">ノートがありません</p>
        <Button asChild>
          <Link href={"/notes/new" as Route}>新しいノートを作成</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <Card
          key={note.id}
          className="overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          <Link href={`/notes/${note.id}` as Route} className="block p-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {note.title}
              </h3>
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    note.status === "Publish"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {note.status === "Publish" ? "公開" : "下書き"}
                </span>
                <p className="text-sm text-gray-500">
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
  );
}

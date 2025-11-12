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
    <Card className="overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {notes.map((note) => (
          <li key={note.id}>
            <Link
              href={`/notes/${note.id}`}
              className="block hover:bg-gray-50 px-4 py-4 sm:px-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {note.title}
                  </p>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            note.status === "Publish"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {note.status === "Publish" ? "公開" : "下書き"}
                        </span>
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        {formatDistanceToNow(new Date(note.updatedAt), {
                          addSuffix: true,
                          locale: ja,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

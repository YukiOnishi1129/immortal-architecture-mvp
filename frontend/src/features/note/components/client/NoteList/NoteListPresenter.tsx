"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { NoteResponse } from "@/external/dto/note.dto";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

interface NoteListPresenterProps {
  notes: NoteResponse[];
  isLoading?: boolean;
  linkPrefix?: string;
}

export function NoteListPresenter({
  notes,
  isLoading,
  linkPrefix = "/notes",
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
          <Link href={"/notes/new"}>新しいノートを作成</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <Card
          key={note.id}
          className="overflow-hidden hover:shadow-lg transition-shadow duration-200 relative"
        >
          <div
            className={`absolute top-0 left-0 right-0 h-1 ${
              note.status === "Publish" ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          <Link
            href={`${linkPrefix}/${note.id}` as Route}
            className="block p-6"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    note.status === "Publish"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {note.status === "Publish" ? "公開" : "下書き"}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {note.title}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="w-6 h-6">
                  {note.owner.thumbnail ? (
                    <AvatarImage
                      src={note.owner.thumbnail}
                      alt={`${note.owner.firstName} ${note.owner.lastName}`}
                    />
                  ) : null}
                  <AvatarFallback className="text-xs">
                    {note.owner.firstName[0]}
                    {note.owner.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">
                  {note.owner.firstName} {note.owner.lastName}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                テンプレート: {note.templateName}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-500 pt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    作成:{" "}
                    {format(new Date(note.createdAt), "yyyy/MM/dd", {
                      locale: ja,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    更新:{" "}
                    {format(new Date(note.updatedAt), "yyyy/MM/dd", {
                      locale: ja,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
}

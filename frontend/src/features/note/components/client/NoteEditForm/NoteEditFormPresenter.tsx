"use client";

import type { Route } from "next";
import Link from "next/link";
import type { Note } from "@/features/note/types";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Textarea } from "@/shared/components/ui/textarea";

interface NoteEditFormPresenterProps {
  note?: Note;
  isLoading?: boolean;
  isUpdating?: boolean;
  errors?: Record<string, string>;
  onSubmit?: () => void;
  onTitleChange?: (value: string) => void;
  onSectionContentChange?: (sectionId: string, content: string) => void;
  onCancel?: () => void;
}

export function NoteEditFormPresenter({
  note,
  isLoading,
  isUpdating,
  errors = {},
  onSubmit,
  onTitleChange,
  onSectionContentChange,
  onCancel,
}: NoteEditFormPresenterProps) {
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="p-6">
          <Skeleton className="h-8 w-1/3 mb-6" />
          <Skeleton className="h-10 w-full mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-32 w-full" />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </Card>
      </div>
    );
  }

  if (!note) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">ノート編集</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit?.();
          }}
        >
          <div className="mb-6">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              type="text"
              value={note.title}
              onChange={(e) => onTitleChange?.(e.target.value)}
              className="mt-1"
              placeholder="タイトルを入力"
              maxLength={100}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div className="space-y-6 mb-6">
            {note.sections.map((section) => (
              <div key={section.id}>
                <Label htmlFor={`section-${section.id}`}>
                  {section.fieldLabel}
                  {section.isRequired && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                <Textarea
                  id={`section-${section.id}`}
                  value={section.content}
                  onChange={(e) =>
                    onSectionContentChange?.(section.id, e.target.value)
                  }
                  className="mt-1"
                  rows={4}
                  placeholder={`${section.fieldLabel}を入力`}
                />
                {errors[`section-${section.id}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`section-${section.id}`]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isUpdating}
              asChild
            >
              <Link href={`/notes/${note.id}` as Route}>キャンセル</Link>
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "保存中..." : "保存"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

"use client";

import { Loader2 } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { Note } from "@/features/note/types";
import { Breadcrumb } from "@/shared/components/ui/breadcrumb";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Textarea } from "@/shared/components/ui/textarea";

interface NoteEditFormPresenterProps {
  note?: Note;
  isLoading?: boolean;
  isUpdating?: boolean;
  errors?: Record<string, string>;
  backTo?: Route;
  onSubmit?: () => void;
  onTitleChange?: (value: string) => void;
  onSectionContentChange?: (sectionId: string, content: string) => void;
  onCancel?: () => void;
}

function NoteEditFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-1/3" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-10 w-full" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        ))}
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export function NoteEditFormPresenter({
  note,
  isLoading,
  isUpdating,
  errors = {},
  backTo,
  onSubmit,
  onTitleChange,
  onSectionContentChange,
  onCancel,
}: NoteEditFormPresenterProps) {
  if (isLoading) {
    return <NoteEditFormSkeleton />;
  }

  if (!note) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">ノートが見つかりません</p>
        </CardContent>
      </Card>
    );
  }

  const listPath = backTo ?? ("/notes" as Route);
  const listLabel = backTo === "/my-notes" ? "マイノート" : "みんなのノート";
  const detailPath = backTo ? `/my-notes/${note.id}` : `/notes/${note.id}`;

  const breadcrumbItems = [
    {
      label: listLabel,
      href: listPath,
    },
    {
      label: note.title,
      href: detailPath as Route,
    },
    {
      label: "編集",
    },
  ];

  return (
    <div className="space-y-4">
      <Breadcrumb items={breadcrumbItems} />
      <Card>
        <CardHeader>
          <CardTitle>ノート編集</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit?.();
            }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                type="text"
                value={note.title}
                onChange={(e) => onTitleChange?.(e.target.value)}
                placeholder="タイトルを入力"
                maxLength={100}
                disabled={isUpdating}
                className="mt-1"
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title}</p>
              )}
            </div>

            <div className="space-y-4">
              {note.sections.map((section) => (
                <div key={section.id}>
                  <Label htmlFor={`section-${section.id}`}>
                    {section.fieldLabel}
                    {section.isRequired && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </Label>
                  <Textarea
                    id={`section-${section.id}`}
                    value={section.content}
                    onChange={(e) =>
                      onSectionContentChange?.(section.id, e.target.value)
                    }
                    placeholder={`${section.fieldLabel}を入力`}
                    disabled={isUpdating}
                    className="mt-1 min-h-[100px]"
                  />
                  {errors[`section-${section.id}`] && (
                    <p className="text-sm text-destructive mt-1">
                      {errors[`section-${section.id}`]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {errors.submit && (
              <p className="text-sm text-destructive">{errors.submit}</p>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  "保存"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isUpdating}
                asChild
              >
                <Link href={`/notes/${note.id}` as Route}>キャンセル</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

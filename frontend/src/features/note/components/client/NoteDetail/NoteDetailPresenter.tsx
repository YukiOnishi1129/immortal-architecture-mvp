"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Edit, Loader2, Trash2 } from "lucide-react";
import type { Note } from "@/features/note/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

type NoteDetailPresenterProps = {
  note?: Note | null;
  isLoading: boolean;
  isDeleting: boolean;
  showDeleteDialog: boolean;
  isOwner?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
};

export function NoteDetailPresenter({
  note,
  isLoading,
  isDeleting,
  showDeleteDialog,
  isOwner = true,
  onEdit,
  onDelete,
  onConfirmDelete,
  onCancelDelete,
}: NoteDetailPresenterProps) {
  if (isLoading) {
    return <NoteDetailSkeleton />;
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

  const statusBadgeVariant =
    note.status === "Publish" ? "default" : "secondary";
  const statusText = note.status === "Publish" ? "公開" : "下書き";

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{note.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>テンプレート: {note.templateName}</span>
                <Badge variant={statusBadgeVariant}>{statusText}</Badge>
              </div>
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <Button onClick={onEdit} size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  編集
                </Button>
                <Button
                  onClick={onDelete}
                  size="sm"
                  variant="outline"
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  削除
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {note.sections.map((section) => (
            <div key={section.id} className="space-y-2">
              <h3 className="font-semibold text-lg">
                {section.fieldLabel}
                {section.isRequired && (
                  <span className="ml-1 text-destructive text-sm">*</span>
                )}
              </h3>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{section.content || "-"}</p>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>
                作成日:{" "}
                {format(new Date(note.createdAt), "yyyy年MM月dd日 HH:mm", {
                  locale: ja,
                })}
              </span>
              <span>
                更新日:{" "}
                {format(new Date(note.updatedAt), "yyyy年MM月dd日 HH:mm", {
                  locale: ja,
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={onCancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ノートを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消すことができません。本当に削除してよろしいですか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  削除中...
                </>
              ) : (
                "削除"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function NoteDetailSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

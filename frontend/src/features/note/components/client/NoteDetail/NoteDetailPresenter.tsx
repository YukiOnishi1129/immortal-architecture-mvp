"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Edit, Eye, EyeOff, Loader2, Trash2, User } from "lucide-react";
import type { Route } from "next";
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Breadcrumb } from "@/shared/components/ui/breadcrumb";
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
  isTogglingPublish: boolean;
  showDeleteDialog: boolean;
  showPublishDialog: boolean;
  isOwner?: boolean;
  backTo?: Route;
  onEdit: () => void;
  onDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onTogglePublish: () => void;
  onConfirmPublish: () => void;
  onCancelPublish: () => void;
};

export function NoteDetailPresenter({
  note,
  isLoading,
  isDeleting,
  isTogglingPublish,
  showDeleteDialog,
  showPublishDialog,
  isOwner = true,
  backTo,
  onEdit,
  onDelete,
  onConfirmDelete,
  onCancelDelete,
  onTogglePublish,
  onConfirmPublish,
  onCancelPublish,
}: NoteDetailPresenterProps) {
  const listPath = backTo ?? ("/notes" as Route);
  const listLabel = backTo === "/my-notes" ? "マイノート" : "みんなのノート";

  const breadcrumbItems = [
    {
      label: listLabel,
      href: listPath,
    },
    {
      label: note?.title ?? "ノート詳細",
    },
  ];

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
    <div className="space-y-4">
      <Breadcrumb items={breadcrumbItems} />
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{note.title}</CardTitle>
              <div className="flex items-center gap-3">
                <Avatar className="w-6 h-6">
                  {note.owner.thumbnail ? (
                    <AvatarImage
                      src={note.owner.thumbnail}
                      alt={`${note.owner.firstName} ${note.owner.lastName}`}
                    />
                  ) : null}
                  <AvatarFallback className="text-xs">
                    <User className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {note.owner.firstName} {note.owner.lastName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>テンプレート: {note.templateName}</span>
                <Badge variant={statusBadgeVariant}>{statusText}</Badge>
              </div>
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <Button
                  onClick={onTogglePublish}
                  size="sm"
                  variant={note.status === "Publish" ? "secondary" : "default"}
                  disabled={isTogglingPublish}
                >
                  {isTogglingPublish ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      処理中...
                    </>
                  ) : note.status === "Publish" ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      下書きに戻す
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      公開する
                    </>
                  )}
                </Button>
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
            <div key={section.id} className="space-y-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {section.fieldLabel}
                  {section.isRequired && (
                    <span className="ml-1 text-destructive">*</span>
                  )}
                </h2>
              </div>
              <div className="relative">
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3 min-h-[100px] font-mono text-sm">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {section.content || (
                      <span className="text-gray-400 italic font-sans">
                        未入力
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t text-sm text-muted-foreground space-y-1">
            <div>
              作成日:{" "}
              {format(new Date(note.createdAt), "yyyy年MM月dd日 HH:mm", {
                locale: ja,
              })}
            </div>
            <div>
              更新日:{" "}
              {format(new Date(note.updatedAt), "yyyy年MM月dd日 HH:mm", {
                locale: ja,
              })}
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
              className="bg-destructive text-white hover:bg-destructive/90"
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

      <AlertDialog open={showPublishDialog} onOpenChange={onCancelPublish}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ノートを公開しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              このノートを公開すると、他のユーザーからも閲覧可能になります。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmPublish}
              disabled={isTogglingPublish}
            >
              {isTogglingPublish ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  公開中...
                </>
              ) : (
                "公開"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
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

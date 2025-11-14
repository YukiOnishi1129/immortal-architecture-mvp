"use client";

import { Calendar, Check, Edit, FileText, Trash2 } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { Template } from "@/features/templates/types";
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface TemplateDetailPresenterProps {
  template: Template;
  isOwner: boolean;
  isDeleting: boolean;
  showDeleteModal: boolean;
  onEdit: () => void;
  onCreateNote: () => void;
  onDeleteClick: () => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
}

export function TemplateDetailPresenter({
  template,
  isOwner,
  isDeleting,
  showDeleteModal,
  onEdit,
  onCreateNote,
  onDeleteClick,
  onDeleteCancel,
  onDeleteConfirm,
}: TemplateDetailPresenterProps) {
  const canDelete = isOwner && !template.isUsed;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <CardTitle className="text-2xl">{template.name}</CardTitle>
              {template.updatedAt && (
                <CardDescription className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    更新日:{" "}
                    {new Date(template.updatedAt).toLocaleDateString("ja-JP")}
                  </span>
                </CardDescription>
              )}
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Edit className="w-4 h-4 mr-1" />
                  編集
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onDeleteClick}
                  disabled={!canDelete || isDeleting}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  削除
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              項目一覧
            </h3>
            <div className="space-y-2">
              {template.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium">{field.label}</span>
                  </div>
                  {field.isRequired && (
                    <Badge variant="secondary" className="text-xs">
                      必須
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {template.isUsed && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
              <Check className="w-4 h-4 text-amber-600 mt-0.5" />
              <p className="text-sm text-amber-800">
                このテンプレートは使用中のため削除できません。
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={"/templates" as Route}>戻る</Link>
          </Button>
          <Button onClick={onCreateNote}>
            <FileText className="w-4 h-4 mr-1" />
            このテンプレートでノート作成
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteModal} onOpenChange={onDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>テンプレートの削除</AlertDialogTitle>
            <AlertDialogDescription>
              このテンプレートを削除してもよろしいですか？この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function TemplateDetailSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Skeleton className="h-5 w-24 mb-3" />
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-48" />
      </CardFooter>
    </Card>
  );
}

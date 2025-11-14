"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteTemplateAction } from "@/external/handler/template/template.command.action";
import { useTemplateQuery } from "@/features/templates/hooks/useTemplateQuery";

export function useTemplateDetail(templateId: string) {
  const router = useRouter();
  const { data: template, isLoading, error } = useTemplateQuery(templateId);
  const [isPending, startTransition] = useTransition();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEdit = () => {
    router.push(`/templates/${templateId}/edit` as Route);
  };

  const handleCreateNote = () => {
    router.push(`/notes/new?templateId=${templateId}` as Route);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteConfirm = () => {
    startTransition(async () => {
      try {
        await deleteTemplateAction(templateId);
        router.push("/templates" as Route);
        router.refresh();
      } catch (error) {
        console.error("テンプレートの削除に失敗しました:", error);
        // TODO: Show error toast
      } finally {
        setShowDeleteModal(false);
      }
    });
  };

  return {
    template,
    isLoading,
    error,
    isDeleting: isPending,
    showDeleteModal,
    handleEdit,
    handleCreateNote,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
  };
}

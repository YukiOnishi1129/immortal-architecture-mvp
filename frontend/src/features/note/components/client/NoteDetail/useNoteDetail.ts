"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteNoteAction } from "@/external/handler/note/note.command.action";
import { useNoteDetailQuery } from "@/features/note/hooks/useNoteDetailQuery";
import { noteKeys } from "@/features/note/queries/keys";

export function useNoteDetail(noteId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: note, isLoading } = useNoteDetailQuery(noteId);

  const deleteMutation = useMutation({
    mutationFn: () => deleteNoteAction(noteId),
    onSuccess: () => {
      toast.success("ノートを削除しました");
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
      router.push("/notes" as Route);
    },
    onError: () => {
      toast.error("ノートの削除に失敗しました");
    },
  });

  const handleEdit = () => {
    router.push(`/notes/${noteId}/edit` as Route);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate();
    setShowDeleteDialog(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  return {
    note,
    isLoading,
    isDeleting: deleteMutation.isPending,
    showDeleteDialog,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
  };
}

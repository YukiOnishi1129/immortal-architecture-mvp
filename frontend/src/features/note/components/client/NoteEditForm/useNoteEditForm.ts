"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { updateNoteAction } from "@/external/handler/note/note.command.action";
import { useNoteDetailQuery } from "@/features/note/hooks/useNoteDetailQuery";
import { noteKeys } from "@/features/note/queries/keys";

type UseNoteEditFormOptions = {
  backTo?: Route;
};

export function useNoteEditForm(
  noteId: string,
  options: UseNoteEditFormOptions = {},
) {
  const { backTo } = options;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: note, isLoading } = useNoteDetailQuery(noteId);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<{
    title?: string;
    sections?: Record<string, string>;
  }>({});

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, title: value }));
    if (errors.title) {
      setErrors((prev) => {
        const { title: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSectionContentChange = (sectionId: string, content: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: content,
      },
    }));
    if (errors[`section-${sectionId}`]) {
      setErrors((prev) => {
        const { [`section-${sectionId}`]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const title = formData.title ?? note?.title ?? "";
    if (!title.trim()) {
      newErrors.title = "タイトルは必須です";
    } else if (title.length > 100) {
      newErrors.title = "タイトルは100文字以内で入力してください";
    }

    // Validate required sections
    note?.sections.forEach((section) => {
      if (section.isRequired) {
        const content = formData.sections?.[section.id] ?? section.content;
        if (!content.trim()) {
          newErrors[`section-${section.id}`] =
            `${section.fieldLabel}は必須です`;
        }
      }
    });

    return newErrors;
  };

  const handleSubmit = async () => {
    if (!note) return;

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsUpdating(true);
    setErrors({});

    try {
      const sections = note.sections.map((section) => ({
        id: section.id,
        content: formData.sections?.[section.id] ?? section.content,
      }));

      const updatedNote = await updateNoteAction(noteId, {
        title: formData.title ?? note.title,
        sections,
      });

      toast.success("ノートを更新しました");

      // キャッシュを直接更新
      queryClient.setQueryData(noteKeys.detail(noteId), updatedNote);

      // 一覧のキャッシュも無効化（一覧の更新日時などが変わるため）
      await queryClient.invalidateQueries({
        queryKey: noteKeys.lists(),
      });

      router.refresh();
      const detailPath = backTo ? `/my-notes/${noteId}` : `/notes/${noteId}`;
      router.push(detailPath as Route);
    } catch (error) {
      console.error("Failed to update note:", error);
      toast.error("ノートの更新に失敗しました");
      setErrors({
        submit: "ノートの更新に失敗しました。もう一度お試しください。",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    const detailPath = backTo ? `/my-notes/${noteId}` : `/notes/${noteId}`;
    router.push(detailPath as Route);
  };

  // Merge form data with note data for display
  const displayNote = note
    ? {
        ...note,
        title: formData.title ?? note.title,
        sections: note.sections.map((section) => ({
          ...section,
          content: formData.sections?.[section.id] ?? section.content,
        })),
      }
    : undefined;

  return {
    note: displayNote,
    isLoading,
    isUpdating,
    errors,
    handleSubmit,
    handleTitleChange,
    handleSectionContentChange,
    handleCancel,
  };
}

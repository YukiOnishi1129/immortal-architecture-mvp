"use client";

import type { Route } from "next";
import { NoteEditFormPresenter } from "./NoteEditFormPresenter";
import { useNoteEditForm } from "./useNoteEditForm";

type NoteEditFormContainerProps = {
  noteId: string;
  backTo?: Route;
};

export function NoteEditFormContainer({
  noteId,
  backTo,
}: NoteEditFormContainerProps) {
  const {
    note,
    isLoading,
    isUpdating,
    errors,
    handleSubmit,
    handleTitleChange,
    handleSectionContentChange,
    handleCancel,
  } = useNoteEditForm(noteId, { backTo });

  if (isLoading) {
    return <NoteEditFormPresenter isLoading />;
  }

  if (!note) {
    return null;
  }

  return (
    <NoteEditFormPresenter
      note={note}
      isUpdating={isUpdating}
      errors={errors}
      backTo={backTo}
      onSubmit={handleSubmit}
      onTitleChange={handleTitleChange}
      onSectionContentChange={handleSectionContentChange}
      onCancel={handleCancel}
    />
  );
}

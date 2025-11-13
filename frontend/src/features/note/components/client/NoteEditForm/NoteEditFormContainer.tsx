"use client";

import { NoteEditFormPresenter } from "./NoteEditFormPresenter";
import { useNoteEditForm } from "./useNoteEditForm";

type NoteEditFormContainerProps = {
  noteId: string;
};

export function NoteEditFormContainer({ noteId }: NoteEditFormContainerProps) {
  const {
    note,
    isLoading,
    isUpdating,
    errors,
    handleSubmit,
    handleTitleChange,
    handleSectionContentChange,
    handleCancel,
  } = useNoteEditForm(noteId);

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
      onSubmit={handleSubmit}
      onTitleChange={handleTitleChange}
      onSectionContentChange={handleSectionContentChange}
      onCancel={handleCancel}
    />
  );
}

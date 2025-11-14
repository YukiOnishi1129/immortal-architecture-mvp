"use client";

import { NoteDetailPresenter } from "./NoteDetailPresenter";
import { useNoteDetail } from "./useNoteDetail";

type NoteDetailContainerProps = {
  noteId: string;
  isOwner?: boolean;
};

export function NoteDetailContainer({
  noteId,
  isOwner = true,
}: NoteDetailContainerProps) {
  const {
    note,
    isLoading,
    isDeleting,
    showDeleteDialog,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useNoteDetail(noteId);

  return (
    <NoteDetailPresenter
      note={note}
      isLoading={isLoading}
      isDeleting={isDeleting}
      showDeleteDialog={showDeleteDialog}
      isOwner={isOwner}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onConfirmDelete={handleConfirmDelete}
      onCancelDelete={handleCancelDelete}
    />
  );
}

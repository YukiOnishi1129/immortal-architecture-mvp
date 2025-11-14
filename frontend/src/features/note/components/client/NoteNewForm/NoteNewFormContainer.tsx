"use client";

import { NoteNewFormPresenter } from "./NoteNewFormPresenter";
import { useNoteNewForm } from "./useNoteNewForm";

export function NoteNewFormContainer() {
  const {
    form,
    selectedTemplate,
    isLoadingTemplate,
    isCreating,
    handleSubmit,
    handleCancel,
    handleSectionContentChange,
  } = useNoteNewForm();

  return (
    <NoteNewFormPresenter
      form={form}
      selectedTemplate={selectedTemplate}
      isLoadingTemplate={isLoadingTemplate}
      isCreating={isCreating}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      onSectionContentChange={handleSectionContentChange}
    />
  );
}

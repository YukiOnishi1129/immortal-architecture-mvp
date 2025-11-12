"use client";

import { NoteListFilterPresenter } from "./NoteListFilterPresenter";
import { useNoteListFilter } from "./useNoteListFilter";

export function NoteListFilterContainer() {
  const {
    searchQuery,
    statusFilter,
    isPending,
    setSearchQuery,
    handleSearch,
    handleStatusChange,
  } = useNoteListFilter();

  return (
    <NoteListFilterPresenter
      searchQuery={searchQuery}
      statusFilter={statusFilter}
      isPending={isPending}
      onSearchQueryChange={setSearchQuery}
      onSearchSubmit={handleSearch}
      onStatusChange={handleStatusChange}
    />
  );
}

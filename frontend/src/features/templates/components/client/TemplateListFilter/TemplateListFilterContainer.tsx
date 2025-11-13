"use client";

import { TemplateListFilterPresenter } from "./TemplateListFilterPresenter";
import { useTemplateListFilter } from "./useTemplateListFilter";

export function TemplateListFilterContainer() {
  const { searchQuery, isPending, setSearchQuery, handleSearch } =
    useTemplateListFilter();

  return (
    <TemplateListFilterPresenter
      searchQuery={searchQuery}
      isPending={isPending}
      onSearchQueryChange={setSearchQuery}
      onSearchSubmit={handleSearch}
    />
  );
}

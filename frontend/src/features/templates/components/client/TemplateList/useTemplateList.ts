"use client";

import { useSearchParams } from "next/navigation";
import { useTemplateListQuery } from "@/features/templates/hooks/useTemplateQuery";
import type { TemplateFilters } from "@/features/templates/types";

export function useTemplateList(initialFilters: TemplateFilters = {}) {
  const searchParams = useSearchParams();

  const filters: TemplateFilters = {
    q: searchParams.get("q") || initialFilters.q,
    page: Number(searchParams.get("page")) || initialFilters.page || 1,
  };

  const { data: templates, isLoading } = useTemplateListQuery(filters);

  return {
    templates: templates || [],
    isLoading,
    filters,
  };
}

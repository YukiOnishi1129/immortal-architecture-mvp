"use client";

import { useQuery } from "@tanstack/react-query";
import { listTemplatesAction } from "@/external/handler/template/template.query.action";
import { templateKeys } from "@/features/template/queries/keys";

export function useTemplateSelector() {
  const { data, isLoading } = useQuery({
    queryKey: templateKeys.list({}),
    queryFn: () => listTemplatesAction(),
  });

  return {
    templates: data ?? [],
    isLoading,
  };
}

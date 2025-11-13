import { useQuery } from "@tanstack/react-query";
import {
  getTemplateByIdAction,
  listTemplatesAction,
} from "@/external/handler/template/template.query.action";
import { templateKeys } from "@/features/templates/queries/keys";
import type { TemplateFilters } from "@/features/templates/types";

export function useTemplateListQuery(filters: TemplateFilters) {
  return useQuery({
    queryKey: templateKeys.list(filters),
    queryFn: () => listTemplatesAction(filters),
  });
}

export function useTemplateQuery(templateId: string) {
  return useQuery({
    queryKey: templateKeys.detail(templateId),
    queryFn: () => getTemplateByIdAction(templateId),
  });
}

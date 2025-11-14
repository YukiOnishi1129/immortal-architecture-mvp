import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { listTemplatesServer } from "@/external/handler/template/template.query.server";
import { TemplateList } from "@/features/templates/components/client/TemplateList";
import { templateKeys } from "@/features/templates/queries/keys";
import type { TemplateFilters } from "@/features/templates/types";
import { getQueryClient } from "@/shared/lib/query-client";

interface TemplateListPageTemplateProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function TemplateListPageTemplate({
  searchParams,
}: TemplateListPageTemplateProps) {
  const queryClient = getQueryClient();
  const params = await searchParams;

  const filters: TemplateFilters = {
    q: typeof params.q === "string" ? params.q : undefined,
    page:
      typeof params.page === "string"
        ? parseInt(params.page, 10)
        : 1,
  };

  // データをプリフェッチ
  await queryClient.prefetchQuery({
    queryKey: templateKeys.list(filters),
    queryFn: () => listTemplatesServer(filters),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TemplateList initialFilters={filters} />
    </HydrationBoundary>
  );
}

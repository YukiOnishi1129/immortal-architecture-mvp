import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { listTemplatesQuery } from "@/external/handler/template/template.query.server";
import { getAuthenticatedSessionServer } from "@/features/auth/servers/redirect.server";
import { TemplateList } from "@/features/template/components/client/TemplateList";
import { templateKeys } from "@/features/template/queries/keys";
import type { TemplateFilters } from "@/features/template/types";
import { getQueryClient } from "@/shared/lib/query-client";

interface TemplateListPageTemplateProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function TemplateListPageTemplate({
  searchParams,
}: TemplateListPageTemplateProps) {
  const session = await getAuthenticatedSessionServer();
  const queryClient = getQueryClient();
  const params = await searchParams;

  const filters: TemplateFilters = {
    q: typeof params.q === "string" ? params.q : undefined,
    page: typeof params.page === "string" ? parseInt(params.page, 10) : 1,
  };

  await queryClient.prefetchQuery({
    queryKey: templateKeys.list(filters),
    queryFn: () => listTemplatesQuery(filters, session.account.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TemplateList initialFilters={filters} />
    </HydrationBoundary>
  );
}

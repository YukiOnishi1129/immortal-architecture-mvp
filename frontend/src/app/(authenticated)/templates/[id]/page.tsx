import { TemplateDetailPageTemplate } from "@/features/template/components/server/TemplateDetailPageTemplate";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TemplateDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <TemplateDetailPageTemplate templateId={id} />;
}

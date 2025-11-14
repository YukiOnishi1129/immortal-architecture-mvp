import type { Metadata } from "next";
import { getTemplateByIdAction } from "@/external/handler/template/template.query.action";
import { TemplateDetailPageTemplate } from "@/features/templates/components/server/TemplateDetailPageTemplate";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const id = (await params).id;
  const template = await getTemplateByIdAction(id);

  return {
    title: template
      ? `${template.name} - Mini Notion`
      : "テンプレート詳細 - Mini Notion",
  };
}

export default async function TemplateDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <TemplateDetailPageTemplate templateId={id} />;
}

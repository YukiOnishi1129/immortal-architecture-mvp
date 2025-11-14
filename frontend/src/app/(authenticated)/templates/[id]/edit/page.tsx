import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTemplateByIdAction } from "@/external/handler/template/template.query.action";
import { getSessionServer } from "@/features/auth/servers/auth.server";
import { TemplateEditPageTemplate } from "@/features/templates/components/server/TemplateEditPageTemplate";

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
      ? `${template.name}を編集 - Mini Notion`
      : "テンプレート編集 - Mini Notion",
  };
}

export default async function TemplateEditPage({ params }: PageProps) {
  const { id } = await params;
  const [template, session] = await Promise.all([
    getTemplateByIdAction(id),
    getSessionServer(),
  ]);

  if (!template) {
    notFound();
  }

  // Check if user is owner
  if (session?.account?.id !== template.ownerId) {
    notFound(); // or redirect to 403
  }

  return <TemplateEditPageTemplate templateId={id} />;
}

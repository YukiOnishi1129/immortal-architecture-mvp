import type { Metadata } from "next";
import { TemplateListPageTemplate } from "@/features/templates/components/server/TemplateListPageTemplate";

export const metadata: Metadata = {
  title: "テンプレート一覧 | Mini Notion",
  description: "ノートのテンプレートを管理",
};

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function TemplatesPage({ searchParams }: PageProps) {
  return <TemplateListPageTemplate searchParams={searchParams} />;
}

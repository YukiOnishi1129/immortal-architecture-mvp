import type { Metadata } from "next";
import { TemplateListPageTemplate } from "@/features/template/components/server/TemplateListPageTemplate";

export const metadata: Metadata = {
  title: "テンプレート一覧 | Mini Notion",
  description: "ノートのテンプレートを管理",
};

export default function TemplatesPage({
  searchParams,
}: PageProps<"/templates">) {
  return <TemplateListPageTemplate searchParams={searchParams} />;
}

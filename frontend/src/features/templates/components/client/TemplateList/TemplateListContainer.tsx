"use client";

import { FolderOpen } from "lucide-react";
import Link from "next/link";
import { TemplateListFilter } from "@/features/templates/components/client/TemplateListFilter";
import type { TemplateFilters } from "@/features/templates/types";
import { Button } from "@/shared/components/ui/button";
import { TemplateListPresenter } from "./TemplateListPresenter";
import { useTemplateList } from "./useTemplateList";

interface TemplateListContainerProps {
  initialFilters?: TemplateFilters;
}

export function TemplateListContainer({
  initialFilters = {},
}: TemplateListContainerProps) {
  const { templates, isLoading } = useTemplateList(initialFilters);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">テンプレート一覧</h1>
          <Button asChild>
            <Link href={"/templates/new"}>
              <FolderOpen className="mr-2 h-4 w-4" />
              新規作成
            </Link>
          </Button>
        </div>
        <TemplateListFilter />
      </div>

      <TemplateListPresenter templates={templates} isLoading={isLoading} />
    </div>
  );
}

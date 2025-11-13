"use client";

import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import type { Route } from "next";
import Link from "next/link";
import type { TemplateResponse } from "@/external/dto/template.dto";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface TemplateListPresenterProps {
  templates: TemplateResponse[];
  isLoading?: boolean;
}

export function TemplateListPresenter({
  templates,
  isLoading,
}: TemplateListPresenterProps) {
  if (isLoading) {
    const skeletonCards = Array.from({ length: 6 }, (_, index) => {
      const uniqueId = `skeleton-card-${index}-${Date.now()}`;
      return (
        <Card key={uniqueId} className="p-6">
          <Skeleton className="h-6 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </Card>
      );
    });

    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {skeletonCards}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">テンプレートがありません</p>
        <Button asChild>
          <Link href={"/templates/new" as Route}>新しいテンプレートを作成</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <Card
          key={template.id}
          className="overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          <Link
            href={`/templates/${template.id}` as Route}
            className="block p-6"
          >
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {template.name}
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  フィールド数: {template.fields.length}
                </p>
                <p className="text-sm text-gray-500">
                  更新日:{" "}
                  {formatDistanceToNow(new Date(template.updatedAt), {
                    addSuffix: true,
                    locale: ja,
                  })}
                </p>
              </div>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
}

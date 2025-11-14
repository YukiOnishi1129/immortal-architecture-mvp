"use client";

import type { DropResult } from "@hello-pangea/dnd";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateTemplateAction } from "@/external/handler/template/template.command.action";
import { useTemplateQuery } from "@/features/templates/hooks/useTemplateQuery";
import { type TemplateEditFormData, templateEditFormSchema } from "./schema";

export function useTemplateEditForm(templateId: string) {
  const router = useRouter();
  const { data: template, isLoading } = useTemplateQuery(templateId);
  const [isPending, startTransition] = useTransition();

  const form = useForm<TemplateEditFormData>({
    resolver: zodResolver(templateEditFormSchema),
    defaultValues: {
      name: "",
      fields: [],
    },
  });

  const { fields, append, remove, move, update } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  // テンプレートデータが読み込まれたらフォームに設定
  useEffect(() => {
    if (template && !isLoading) {
      form.reset({
        name: template.name,
        fields: template.fields.map((field) => ({
          id: field.id,
          label: field.label,
          isRequired: field.isRequired,
          order: field.order,
        })),
      });
    }
  }, [template, isLoading, form]);

  const handleSubmit = form.handleSubmit((data: TemplateEditFormData) => {
    startTransition(async () => {
      try {
        const fields = data.fields.map(({ label, isRequired, order }) => ({
          label,
          isRequired,
          order,
        }));

        await updateTemplateAction(templateId, {
          name: data.name,
          fields,
        });

        toast.success("テンプレートを更新しました");
        router.refresh();
        router.push("/templates");
      } catch (error) {
        console.error("テンプレートの更新に失敗しました:", error);
        toast.error("テンプレートの更新に失敗しました");
        form.setError("root", {
          message: "テンプレートの更新に失敗しました。もう一度お試しください。",
        });
      }
    });
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    move(result.source.index, result.destination.index);

    // Update order numbers after reordering
    fields.forEach((field, index) => {
      update(index, { ...field, order: index + 1 });
    });
  };

  const handleAddField = () => {
    append({
      id: crypto.randomUUID(),
      label: "",
      isRequired: false,
      order: fields.length + 1,
    });
  };

  const handleCancel = () => {
    router.push(`/templates/${templateId}` as Route);
  };

  return {
    form,
    fields,
    isLoading,
    isSubmitting: isPending,
    handleSubmit,
    handleCancel,
    handleDragEnd,
    handleAddField,
    remove,
  };
}

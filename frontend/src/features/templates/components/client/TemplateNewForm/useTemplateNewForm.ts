"use client";

import type { DropResult } from "@hello-pangea/dnd";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { createTemplateAction } from "@/external/handler/template/template.command.action";
import { type TemplateNewFormData, templateNewFormSchema } from "./schema";

export function useTemplateNewForm() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<TemplateNewFormData>({
    resolver: zodResolver(templateNewFormSchema),
    defaultValues: {
      name: "",
      fields: [],
    },
  });

  const { fields, append, remove, move, update } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const handleSubmit = async (data: TemplateNewFormData) => {
    setIsCreating(true);

    try {
      const fields = data.fields.map(({ label, isRequired, order }) => ({
        label,
        isRequired,
        order,
      }));

      const result = await createTemplateAction({
        name: data.name,
        fields,
      });

      if (result?.id) {
        router.push(`/templates/${result.id}` as Route);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to create template:", error);
      form.setError("root", {
        message: "テンプレートの作成に失敗しました。もう一度お試しください。",
      });
    } finally {
      setIsCreating(false);
    }
  };

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
    router.push("/templates" as Route);
  };

  return {
    form,
    fields,
    isCreating,
    handleSubmit,
    handleCancel,
    handleDragEnd,
    handleAddField,
    remove,
  };
}

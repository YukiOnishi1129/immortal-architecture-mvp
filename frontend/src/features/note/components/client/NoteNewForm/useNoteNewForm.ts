"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createNoteAction } from "@/external/handler/note/note.command.action";
import { getTemplateByIdAction } from "@/external/handler/template/template.query.action";
import type { Template } from "@/features/templates/types";
import { type NoteNewFormData, noteNewFormSchema } from "./schema";

type UseNoteNewFormProps = {
  backTo?: Route;
};

export function useNoteNewForm({ backTo }: UseNoteNewFormProps = {}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

  const form = useForm<NoteNewFormData>({
    resolver: zodResolver(noteNewFormSchema),
    defaultValues: {
      title: "",
      templateId: "",
      sections: [],
    },
  });

  const templateId = form.watch("templateId");

  useEffect(() => {
    if (!templateId) {
      setSelectedTemplate(null);
      form.setValue("sections", []);
      return;
    }

    const loadTemplate = async () => {
      setIsLoadingTemplate(true);
      try {
        const template = await getTemplateByIdAction(templateId);
        if (template) {
          setSelectedTemplate(template);
          // テンプレートのフィールドを基に sections を初期化
          const sections = template.fields.map((field) => ({
            fieldId: field.id,
            fieldLabel: field.label,
            content: "",
            isRequired: field.isRequired,
          }));
          form.setValue("sections", sections);
        }
      } catch (error) {
        console.error("テンプレートの取得に失敗しました:", error);
        toast.error("テンプレートの取得に失敗しました");
      } finally {
        setIsLoadingTemplate(false);
      }
    };

    loadTemplate();
  }, [templateId, form]);

  const handleSubmit = form.handleSubmit((data: NoteNewFormData) => {
    // Validate required sections
    const hasEmptyRequiredFields = data.sections.some(
      (section) => section.isRequired && !section.content.trim(),
    );

    if (hasEmptyRequiredFields) {
      toast.error("必須項目を入力してください");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createNoteAction({
          title: data.title,
          templateId: data.templateId,
          sections: data.sections.map(({ fieldId, content }) => ({
            fieldId,
            content,
          })),
        });

        if (result?.id) {
          toast.success("ノートを作成しました");
          router.refresh();
          // backToが指定されている場合はbackToに戻る、それ以外はマイノート一覧へ（新規作成は下書きのため）
          const redirectPath = backTo ?? "/my-notes";
          router.push(redirectPath as Route);
        }
      } catch (error) {
        console.error("ノートの作成に失敗しました:", error);
        toast.error("ノートの作成に失敗しました");
        form.setError("root", {
          message: "ノートの作成に失敗しました。もう一度お試しください。",
        });
      }
    });
  });

  const handleCancel = () => {
    router.push((backTo ?? "/my-notes") as Route);
  };

  const handleSectionContentChange = (index: number, content: string) => {
    const sections = form.getValues("sections");
    sections[index].content = content;
    form.setValue("sections", sections);
  };

  return {
    form,
    selectedTemplate,
    isLoadingTemplate,
    isCreating: isPending,
    handleSubmit,
    handleCancel,
    handleSectionContentChange,
  };
}

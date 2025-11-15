import { NoteNewForm } from "@/features/note/components/client/NoteNewForm";

interface NoteNewPageTemplateProps {
  initialTemplateId?: string;
}

export function NoteNewPageTemplate({
  initialTemplateId,
}: NoteNewPageTemplateProps) {
  return (
    <div className="container mx-auto py-6">
      <NoteNewForm initialTemplateId={initialTemplateId} />
    </div>
  );
}

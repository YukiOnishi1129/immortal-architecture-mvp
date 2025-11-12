import { NoteListPageTemplate } from "@/features/note/components/server/NoteListPageTemplate";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function NotesPage({ searchParams }: PageProps) {
  return <NoteListPageTemplate searchParams={searchParams} />;
}

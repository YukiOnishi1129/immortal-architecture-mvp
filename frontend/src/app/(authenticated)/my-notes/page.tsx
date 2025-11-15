import type { Metadata } from "next";
import { MyNoteListPageTemplate } from "@/features/note/components/server/MyNoteListPageTemplate";

export const metadata: Metadata = {
  title: "マイノート | Mini Notion",
  description: "あなたが作成したノートの一覧",
};

export const dynamic = "force-dynamic";

export default async function MyNotesPage() {
  return <MyNoteListPageTemplate />;
}

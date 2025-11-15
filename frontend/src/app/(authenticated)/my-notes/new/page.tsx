import type { Metadata } from "next";
import { MyNoteNewPageTemplate } from "@/features/note/components/server/MyNoteNewPageTemplate";

export const metadata: Metadata = {
  title: "ノート新規作成 | マイノート",
  description: "新しいノートを作成する",
};

export default function MyNoteNewPage() {
  return <MyNoteNewPageTemplate />;
}

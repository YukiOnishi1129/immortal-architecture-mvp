import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes - Immortal Architecture",
  description: "Your personal notes in Immortal Architecture",
};

export default function NoteListLayout({ children }: LayoutProps<"/note">) {
  return <>{children}</>;
}

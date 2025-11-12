import { type NextRequest, NextResponse } from "next/server";
import { listMyNotesServer } from "@/external/handler/note/note.query.server";
import type { NoteFilters } from "@/features/note/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: NoteFilters = {
      q: searchParams.get("q") || undefined,
      status: searchParams.get("status") as "Draft" | "Publish" | undefined,
      page: searchParams.has("page")
        ? parseInt(searchParams.get("page") || "1", 10)
        : 1,
    };

    const notes = await listMyNotesServer(filters);
    return NextResponse.json(notes);
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 },
    );
  }
}

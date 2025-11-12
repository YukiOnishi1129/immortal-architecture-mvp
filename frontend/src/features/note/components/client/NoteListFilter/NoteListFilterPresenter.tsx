"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface NoteListFilterPresenterProps {
  searchQuery: string;
  statusFilter: string;
  isPending: boolean;
  onSearchQueryChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onStatusChange: (value: string) => void;
}

export function NoteListFilterPresenter({
  searchQuery,
  statusFilter,
  isPending,
  onSearchQueryChange,
  onSearchSubmit,
  onStatusChange,
}: NoteListFilterPresenterProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <form onSubmit={onSearchSubmit} className="flex gap-2">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="ノートを検索..."
          disabled={isPending}
          className="w-full"
        />
        <Button type="submit" disabled={isPending} variant="default">
          検索
        </Button>
      </form>

      <Select
        value={statusFilter}
        onValueChange={onStatusChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="すべてのステータス" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべてのステータス</SelectItem>
          <SelectItem value="Draft">下書き</SelectItem>
          <SelectItem value="Publish">公開</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

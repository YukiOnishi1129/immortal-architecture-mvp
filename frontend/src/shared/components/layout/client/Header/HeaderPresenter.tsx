"use client";

import { LogOut, User } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

interface HeaderPresenterProps {
  userName?: string;
  userEmail?: string;
  onSignOut: () => void;
}

export function HeaderPresenter({
  userName,
  userEmail,
  onSignOut,
}: HeaderPresenterProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="flex h-14 items-center px-6 justify-end">
        <nav className="flex items-center">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <User className="h-4 w-4" />
                <span className="sr-only">ユーザーメニュー</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem className="flex-col items-start" disabled>
                <div className="text-xs font-medium">
                  {userName || "ユーザー"}
                </div>
                <div className="text-xs text-muted-foreground">{userEmail}</div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center"
                onClick={onSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                ログアウト
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}

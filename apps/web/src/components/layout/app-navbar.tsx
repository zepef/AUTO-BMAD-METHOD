"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  Bell,
  PanelRightClose,
  PanelRightOpen,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppNavbarProps {
  onCommandPaletteOpen: () => void;
  onArtifactsPanelToggle: () => void;
  artifactsPanelOpen: boolean;
}

export function AppNavbar({
  onCommandPaletteOpen,
  onArtifactsPanelToggle,
  artifactsPanelOpen,
}: AppNavbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6">
      {/* Left: Page Title / Breadcrumbs */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-neutral-900">
          Chat Workspace
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Command Palette Trigger */}
        <Button
          variant="outline"
          onClick={onCommandPaletteOpen}
          className="gap-2"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-neutral-200 bg-neutral-100 px-1.5 font-mono text-xs font-medium opacity-100 sm:inline-flex">
            <Command className="h-3 w-3" />K
          </kbd>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-600"></span>
          </span>
        </Button>

        {/* Artifacts Panel Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onArtifactsPanelToggle}
          title={artifactsPanelOpen ? "Hide artifacts panel" : "Show artifacts panel"}
        >
          {artifactsPanelOpen ? (
            <PanelRightClose className="h-5 w-5" />
          ) : (
            <PanelRightOpen className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}

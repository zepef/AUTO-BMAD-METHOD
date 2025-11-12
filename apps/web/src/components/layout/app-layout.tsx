"use client";

import { useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { AppNavbar } from "./app-navbar";
import { ArtifactsPanel } from "./artifacts-panel";
import { CommandPalette } from "./command-palette";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [artifactsPanelOpen, setArtifactsPanelOpen] = useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />

      {/* Left Sidebar */}
      <AppSidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation */}
        <AppNavbar
          onCommandPaletteOpen={() => setCommandPaletteOpen(true)}
          onArtifactsPanelToggle={() => setArtifactsPanelOpen(!artifactsPanelOpen)}
          artifactsPanelOpen={artifactsPanelOpen}
        />

        {/* Content + Artifacts Panel */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>

          {/* Right Artifacts Panel */}
          {artifactsPanelOpen && <ArtifactsPanel />}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "./app-sidebar";
import { AppNavbar } from "./app-navbar";
import { ArtifactsPanel } from "./artifacts-panel";
import { GlobalSearch } from "../global-search";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [artifactsPanelOpen, setArtifactsPanelOpen] = useState(true);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);

  // Keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setGlobalSearchOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Global Search */}
      <GlobalSearch
        open={globalSearchOpen}
        onOpenChange={setGlobalSearchOpen}
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
          onCommandPaletteOpen={() => setGlobalSearchOpen(true)}
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

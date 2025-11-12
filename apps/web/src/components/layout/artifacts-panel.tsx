"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Code,
  FileCode,
  Sparkles,
  Plus,
  Download,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Artifact {
  id: string;
  type: "prd" | "architecture" | "story" | "epic" | "tech-spec" | "document";
  title: string;
  description: string;
  updatedAt: string;
  status: "draft" | "in-progress" | "completed";
}

const MOCK_ARTIFACTS: Artifact[] = [
  {
    id: "1",
    type: "prd",
    title: "E-commerce Platform PRD",
    description: "Product requirements for the new e-commerce platform",
    updatedAt: "2h ago",
    status: "in-progress",
  },
  {
    id: "2",
    type: "architecture",
    title: "System Architecture",
    description: "Technical architecture and design decisions",
    updatedAt: "5h ago",
    status: "completed",
  },
  {
    id: "3",
    type: "story",
    title: "User Authentication Story",
    description: "Implement email/password authentication",
    updatedAt: "1d ago",
    status: "draft",
  },
  {
    id: "4",
    type: "tech-spec",
    title: "API Gateway Specification",
    description: "Technical specification for API gateway service",
    updatedAt: "2d ago",
    status: "completed",
  },
];

const ARTIFACT_ICONS = {
  prd: FileText,
  architecture: Code,
  story: FileCode,
  epic: Sparkles,
  "tech-spec": FileText,
  document: FileText,
};

const ARTIFACT_COLORS = {
  prd: "text-purple-600",
  architecture: "text-blue-600",
  story: "text-green-600",
  epic: "text-amber-600",
  "tech-spec": "text-indigo-600",
  document: "text-neutral-600",
};

const STATUS_VARIANTS = {
  draft: "outline" as const,
  "in-progress": "default" as const,
  completed: "success" as const,
};

export function ArtifactsPanel() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredArtifacts =
    activeTab === "all"
      ? MOCK_ARTIFACTS
      : MOCK_ARTIFACTS.filter((a) => a.type === activeTab);

  return (
    <aside className="flex w-80 flex-col border-l border-neutral-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 p-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Artifacts</h2>
          <p className="text-xs text-neutral-500">
            {MOCK_ARTIFACTS.length} documents
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden xl:inline">New</span>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
        <TabsList className="mx-4 mt-4 grid w-auto grid-cols-3">
          <TabsTrigger value="all" className="text-xs">
            All
          </TabsTrigger>
          <TabsTrigger value="prd" className="text-xs">
            PRD
          </TabsTrigger>
          <TabsTrigger value="architecture" className="text-xs">
            Arch
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="flex-1 overflow-hidden mt-0">
          <ScrollArea className="h-full">
            <div className="space-y-2 p-4">
              {filteredArtifacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="mb-3 h-12 w-12 text-neutral-300" />
                  <p className="text-sm text-neutral-500">No artifacts yet</p>
                  <p className="mt-1 text-xs text-neutral-400">
                    Create your first document
                  </p>
                </div>
              ) : (
                filteredArtifacts.map((artifact) => {
                  const Icon = ARTIFACT_ICONS[artifact.type];
                  const colorClass = ARTIFACT_COLORS[artifact.type];

                  return (
                    <button
                      key={artifact.id}
                      className="group w-full rounded-lg border border-neutral-200 bg-white p-3 text-left transition-all hover:border-primary-300 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "mt-0.5 rounded-lg bg-neutral-50 p-2 transition-colors group-hover:bg-primary-50",
                            colorClass
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>

                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="truncate text-sm font-medium text-neutral-900">
                              {artifact.title}
                            </h3>
                            <Badge
                              variant={STATUS_VARIANTS[artifact.status]}
                              className="shrink-0 text-[10px]"
                            >
                              {artifact.status}
                            </Badge>
                          </div>

                          <p className="mt-1 line-clamp-2 text-xs text-neutral-600">
                            {artifact.description}
                          </p>

                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-neutral-500">
                              {artifact.updatedAt}
                            </span>
                            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert("Download artifact");
                                }}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert("Open artifact");
                                }}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Quick Actions Footer */}
      <div className="border-t border-neutral-200 p-3">
        <Button variant="outline" size="sm" className="w-full gap-2">
          <Download className="h-4 w-4" />
          Export All
        </Button>
      </div>
    </aside>
  );
}

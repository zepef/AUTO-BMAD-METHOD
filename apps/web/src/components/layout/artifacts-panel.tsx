"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc/client";
import { formatDistanceToNow } from "date-fns";

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

type ArtifactType = "prd" | "architecture" | "story" | "epic" | "tech-spec" | "document";

export function ArtifactsPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | ArtifactType>("all");
  const utils = trpc.useUtils();

  // Fetch artifacts with optional type filter
  const { data, isLoading, error } = trpc.artifact.list.useQuery({
    type: activeTab === "all" ? undefined : activeTab,
    limit: 50,
  });

  // Create artifact mutation
  const createArtifact = trpc.artifact.create.useMutation({
    onSuccess: (newArtifact) => {
      // Refresh the list
      utils.artifact.list.invalidate();
      // Navigate to the new artifact
      router.push(`/artifacts/${newArtifact.id}`);
    },
    onError: (error) => {
      alert(`Error creating artifact: ${error.message}`);
    },
  });

  const handleArtifactClick = (artifactId: string) => {
    router.push(`/artifacts/${artifactId}`);
  };

  const handleNewArtifact = () => {
    createArtifact.mutate({
      type: activeTab === "all" ? "document" : activeTab,
      title: "New Document",
      description: "Click to edit description",
      content: "",
      status: "draft",
    });
  };

  const handleDownload = (artifact: any) => {
    const blob = new Blob([artifact.content || ""], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${artifact.title.replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const artifacts = data?.artifacts || [];

  return (
    <aside className="flex w-80 flex-col border-l border-neutral-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 p-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Artifacts</h2>
          <p className="text-xs text-neutral-500">
            {isLoading ? "Loading..." : `${artifacts.length} documents`}
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2"
          onClick={handleNewArtifact}
          disabled={createArtifact.isPending}
        >
          {createArtifact.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          <span className="hidden xl:inline">New</span>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="flex-1 overflow-hidden flex flex-col">
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
              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 className="mb-3 h-12 w-12 animate-spin text-neutral-300" />
                  <p className="text-sm text-neutral-500">Loading artifacts...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="mb-3 h-12 w-12 text-red-300" />
                  <p className="text-sm text-red-600">Error loading artifacts</p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {error.message}
                  </p>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && artifacts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="mb-3 h-12 w-12 text-neutral-300" />
                  <p className="text-sm text-neutral-500">No artifacts yet</p>
                  <p className="mt-1 text-xs text-neutral-400">
                    Create your first document
                  </p>
                </div>
              )}

              {/* Artifacts List */}
              {!isLoading && !error && artifacts.length > 0 && (
                artifacts.map((artifact: any) => {
                  const Icon = ARTIFACT_ICONS[artifact.type as ArtifactType] || FileText;
                  const colorClass = ARTIFACT_COLORS[artifact.type as ArtifactType] || "text-neutral-600";

                  return (
                    <button
                      key={artifact.id}
                      onClick={() => handleArtifactClick(artifact.id)}
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
                              variant={STATUS_VARIANTS[artifact.status as keyof typeof STATUS_VARIANTS] || "outline"}
                              className="shrink-0 text-[10px]"
                            >
                              {artifact.status}
                            </Badge>
                          </div>

                          <p className="mt-1 line-clamp-2 text-xs text-neutral-600">
                            {artifact.description || "No description"}
                          </p>

                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-neutral-500">
                                {formatDistanceToNow(new Date(artifact.updatedAt), { addSuffix: true })}
                              </span>
                              {artifact.projectId && (
                                <Badge variant="secondary" className="text-[10px] px-1">
                                  Project
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(artifact);
                                }}
                                title="Download"
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleArtifactClick(artifact.id);
                                }}
                                title="Open in editor"
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
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2"
          disabled={artifacts.length === 0}
          onClick={() => {
            // Export all artifacts as a ZIP or combined markdown
            alert("Export all functionality - to be implemented!");
          }}
        >
          <Download className="h-4 w-4" />
          Export All
        </Button>
      </div>
    </aside>
  );
}

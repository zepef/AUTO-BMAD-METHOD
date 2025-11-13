"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  FileText,
  FolderKanban,
  MessageSquare,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ARTIFACT_TYPE_LABELS: Record<string, string> = {
  prd: "PRD",
  architecture: "Architecture",
  story: "User Story",
  epic: "Epic",
  "tech-spec": "Tech Spec",
  document: "Document",
};

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fetch data based on search query
  const { data: projects, isLoading: loadingProjects } = trpc.project.list.useQuery(
    { limit: 5 },
    { enabled: open }
  );

  const { data: artifacts, isLoading: loadingArtifacts } = trpc.artifact.list.useQuery(
    { limit: 5 },
    { enabled: open }
  );

  const { data: chats, isLoading: loadingChats } = trpc.chat.listSessions.useQuery(
    { limit: 5 },
    { enabled: open }
  );

  // Filter results based on query
  const filteredProjects =
    projects?.projects.filter((p: any) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description?.toLowerCase().includes(query.toLowerCase())
    ) ?? [];

  const filteredArtifacts =
    artifacts?.artifacts.filter((a: any) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.description?.toLowerCase().includes(query.toLowerCase())
    ) ?? [];

  const filteredChats =
    chats?.sessions.filter((c: any) =>
      c.title.toLowerCase().includes(query.toLowerCase())
    ) ?? [];

  // Combine all results
  const allResults = [
    ...filteredProjects.map((p: any) => ({ type: "project", data: p })),
    ...filteredArtifacts.map((a: any) => ({ type: "artifact", data: a })),
    ...filteredChats.map((c: any) => ({ type: "chat", data: c })),
  ];

  const isLoading = loadingProjects || loadingArtifacts || loadingChats;

  // Handle keyboard navigation
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, allResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && allResults[selectedIndex]) {
      e.preventDefault();
      handleSelect(allResults[selectedIndex]);
    }
  };

  const handleSelect = (result: any) => {
    if (result.type === "project") {
      router.push(`/projects/${result.data.id}`);
    } else if (result.type === "artifact") {
      router.push(`/artifacts/${result.data.id}`);
    } else if (result.type === "chat") {
      router.push(`/chat`);
    }
    onOpenChange(false);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <div className="flex flex-col">
          {/* Search Input */}
          <div className="flex items-center border-b border-neutral-200 px-4 py-3">
            <Search className="mr-3 h-5 w-5 text-neutral-400" />
            <Input
              placeholder="Search projects, artifacts, and chats..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-0 p-0 focus-visible:ring-0"
              autoFocus
            />
          </div>

          {/* Results */}
          <ScrollArea className="max-h-96">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
              </div>
            ) : allResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="mb-3 h-12 w-12 text-neutral-300" />
                <p className="text-sm text-neutral-500">
                  {query
                    ? "No results found"
                    : "Start typing to search across projects, artifacts, and chats"}
                </p>
              </div>
            ) : (
              <div className="p-2">
                {/* Projects Section */}
                {filteredProjects.length > 0 && (
                  <div className="mb-4">
                    <p className="mb-2 px-2 text-xs font-semibold uppercase text-neutral-500">
                      Projects
                    </p>
                    {filteredProjects.map((project: any, idx: number) => {
                      const globalIdx = allResults.findIndex(
                        (r) => r.type === "project" && r.data.id === project.id
                      );
                      return (
                        <button
                          key={project.id}
                          onClick={() => handleSelect({ type: "project", data: project })}
                          className={cn(
                            "flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors",
                            globalIdx === selectedIndex
                              ? "bg-primary-50"
                              : "hover:bg-neutral-50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                              <FolderKanban className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900">
                                {project.name}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {project._count.artifacts} artifacts
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">{project.status}</Badge>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Artifacts Section */}
                {filteredArtifacts.length > 0 && (
                  <div className="mb-4">
                    <p className="mb-2 px-2 text-xs font-semibold uppercase text-neutral-500">
                      Artifacts
                    </p>
                    {filteredArtifacts.map((artifact: any) => {
                      const globalIdx = allResults.findIndex(
                        (r) => r.type === "artifact" && r.data.id === artifact.id
                      );
                      return (
                        <button
                          key={artifact.id}
                          onClick={() =>
                            handleSelect({ type: "artifact", data: artifact })
                          }
                          className={cn(
                            "flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors",
                            globalIdx === selectedIndex
                              ? "bg-primary-50"
                              : "hover:bg-neutral-50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-100">
                              <FileText className="h-5 w-5 text-secondary-600" />
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900">
                                {artifact.title}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {ARTIFACT_TYPE_LABELS[artifact.type] || artifact.type}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-neutral-500">
                            {formatDistanceToNow(new Date(artifact.updatedAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Chats Section */}
                {filteredChats.length > 0 && (
                  <div>
                    <p className="mb-2 px-2 text-xs font-semibold uppercase text-neutral-500">
                      Conversations
                    </p>
                    {filteredChats.map((chat: any) => {
                      const globalIdx = allResults.findIndex(
                        (r) => r.type === "chat" && r.data.id === chat.id
                      );
                      return (
                        <button
                          key={chat.id}
                          onClick={() => handleSelect({ type: "chat", data: chat })}
                          className={cn(
                            "flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors",
                            globalIdx === selectedIndex
                              ? "bg-primary-50"
                              : "hover:bg-neutral-50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                              <MessageSquare className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900">{chat.title}</p>
                              <p className="text-xs text-neutral-500">
                                {chat._count.messages} messages
                                {chat.project && ` • ${chat.project.name}`}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-neutral-500">
                            {formatDistanceToNow(new Date(chat.updatedAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-2 text-xs text-neutral-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-neutral-300 px-1.5 py-0.5">↑</kbd>
                <kbd className="rounded border border-neutral-300 px-1.5 py-0.5">↓</kbd>
                <span>to navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-neutral-300 px-1.5 py-0.5">↵</kbd>
                <span>to select</span>
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-neutral-300 px-1.5 py-0.5">esc</kbd>
              <span>to close</span>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

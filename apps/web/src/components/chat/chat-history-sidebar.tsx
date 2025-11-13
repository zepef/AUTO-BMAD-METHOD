"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  MessageSquare,
  Search,
  Trash2,
  Edit2,
  Folder,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { trpc } from "@/lib/trpc/client";

interface ChatHistorySidebarProps {
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
}

export function ChatHistorySidebar({
  currentSessionId,
  onSelectSession,
  onNewSession,
}: ChatHistorySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const utils = trpc.useUtils();

  // Fetch chat sessions
  const { data, isLoading, error } = trpc.chat.listSessions.useQuery({
    limit: 100,
  });

  // Update session mutation
  const updateSession = trpc.chat.updateSession.useMutation({
    onSuccess: () => {
      utils.chat.listSessions.invalidate();
      utils.chat.getSession.invalidate();
      setEditingSessionId(null);
    },
    onError: (error) => {
      alert(`Error updating session: ${error.message}`);
    },
  });

  // Delete session mutation
  const deleteSession = trpc.chat.deleteSession.useMutation({
    onSuccess: () => {
      utils.chat.listSessions.invalidate();
    },
    onError: (error) => {
      alert(`Error deleting session: ${error.message}`);
    },
  });

  const sessions = data?.sessions ?? [];
  const filteredSessions = sessions.filter((session: any) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartEdit = (session: any) => {
    setEditingSessionId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveEdit = (sessionId: string) => {
    if (editTitle.trim()) {
      updateSession.mutate({ id: sessionId, title: editTitle });
    } else {
      setEditingSessionId(null);
    }
  };

  const handleDelete = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this chat session?")) {
      deleteSession.mutate({ id: sessionId });
      if (sessionId === currentSessionId) {
        onNewSession();
      }
    }
  };

  return (
    <aside className="flex w-80 flex-col border-r border-neutral-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 p-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Chat History</h2>
          <p className="text-xs text-neutral-500">
            {isLoading ? "Loading..." : `${sessions.length} conversations`}
          </p>
        </div>
        <Button size="sm" className="gap-2" onClick={onNewSession}>
          <Plus className="h-4 w-4" />
          <span className="hidden xl:inline">New</span>
        </Button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="mb-3 h-12 w-12 animate-spin text-neutral-300" />
              <p className="text-sm text-neutral-500">Loading conversations...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="mb-3 h-12 w-12 text-red-300" />
              <p className="text-sm text-red-600">Error loading conversations</p>
              <p className="mt-1 text-xs text-neutral-400">{error.message}</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredSessions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="mb-3 h-12 w-12 text-neutral-300" />
              <p className="text-sm text-neutral-500">
                {searchQuery ? "No conversations found" : "No conversations yet"}
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                {searchQuery ? "Try a different search" : "Start a new chat to begin"}
              </p>
            </div>
          )}

          {/* Sessions */}
          {!isLoading &&
            !error &&
            filteredSessions.map((session: any) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={cn(
                  "group w-full rounded-lg border p-3 text-left transition-all hover:border-primary-300 hover:shadow-sm",
                  currentSessionId === session.id
                    ? "border-primary-300 bg-primary-50"
                    : "border-neutral-200 bg-white"
                )}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      currentSessionId === session.id
                        ? "text-primary-600"
                        : "text-neutral-400"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    {editingSessionId === session.id ? (
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleSaveEdit(session.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveEdit(session.id);
                          } else if (e.key === "Escape") {
                            setEditingSessionId(null);
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                        className="h-7 text-sm"
                      />
                    ) : (
                      <h3 className="truncate text-sm font-medium text-neutral-900">
                        {session.title}
                      </h3>
                    )}

                    {session.project && (
                      <div className="mt-1 flex items-center gap-1">
                        <Folder className="h-3 w-3 text-neutral-400" />
                        <span className="truncate text-xs text-neutral-500">
                          {session.project.name}
                        </span>
                      </div>
                    )}

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-neutral-500">
                        {formatDistanceToNow(new Date(session.updatedAt), {
                          addSuffix: true,
                        })}
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        {session._count.messages} messages
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(session);
                    }}
                    title="Rename"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-600 hover:bg-red-50"
                    onClick={(e) => handleDelete(session.id, e)}
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </button>
            ))}
        </div>
      </ScrollArea>
    </aside>
  );
}

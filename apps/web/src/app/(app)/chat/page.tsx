"use client";

import { useState, useEffect } from "react";
import { ChatContainer } from "@/components/chat/chat-container";
import { AgentSelector } from "@/components/chat/agent-selector";
import { ChatHistorySidebar } from "@/components/chat/chat-history-sidebar";
import { type Message, type Agent } from "@/types/chat";
import { trpc } from "@/lib/trpc/client";
import { Loader2, Folder, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const AGENTS: Agent[] = [
  {
    id: "pm",
    name: "John (PM)",
    role: "Product Manager",
    color: "#8b5cf6",
    description: "I help you define product requirements and user stories",
  },
  {
    id: "architect",
    name: "Sarah (Architect)",
    role: "Technical Architect",
    color: "#0ea5e9",
    description: "I design system architecture and technical specifications",
  },
  {
    id: "developer",
    name: "Mike (Developer)",
    role: "Senior Developer",
    color: "#10b981",
    description: "I help implement features and write code",
  },
  {
    id: "designer",
    name: "Emma (Designer)",
    role: "UX Designer",
    color: "#f59e0b",
    description: "I create user experiences and design systems",
  },
];

export default function ChatPage() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState("pm");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreamingLoading, setIsStreamingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isArtifactDialogOpen, setIsArtifactDialogOpen] = useState(false);
  const [newArtifact, setNewArtifact] = useState({
    type: "document" as "prd" | "architecture" | "story" | "epic" | "tech-spec" | "document",
    title: "",
    description: "",
  });

  const utils = trpc.useUtils();
  const selectedAgent = AGENTS.find((a) => a.id === selectedAgentId);

  // Fetch projects for selector
  const { data: projectsData } = trpc.project.list.useQuery({
    limit: 100,
  });

  // Fetch current session data
  const { data: sessionData, isLoading: isLoadingSession } =
    trpc.chat.getSession.useQuery(
      { id: currentSessionId! },
      { enabled: !!currentSessionId }
    );

  // Create session mutation
  const createSession = trpc.chat.createSession.useMutation({
    onSuccess: (newSession) => {
      setCurrentSessionId(newSession.id);
      utils.chat.listSessions.invalidate();
    },
    onError: (error) => {
      console.error("Error creating session:", error);
      setError("Failed to create new chat session");
    },
  });

  // Create message mutation
  const createMessage = trpc.chat.createMessage.useMutation({
    onSuccess: () => {
      utils.chat.getSession.invalidate({ id: currentSessionId! });
      utils.chat.listSessions.invalidate();
    },
    onError: (error) => {
      console.error("Error saving message:", error);
    },
  });

  // Update session mutation
  const updateSession = trpc.chat.updateSession.useMutation({
    onSuccess: () => {
      utils.chat.getSession.invalidate({ id: currentSessionId! });
      utils.chat.listSessions.invalidate();
    },
    onError: (error) => {
      console.error("Error updating session:", error);
    },
  });

  // Create artifact mutation
  const createArtifact = trpc.artifact.create.useMutation({
    onSuccess: (newArtifactData) => {
      utils.artifact.list.invalidate();
      setIsArtifactDialogOpen(false);
      setNewArtifact({ type: "document", title: "", description: "" });
      router.push(`/artifacts/${newArtifactData.id}`);
    },
    onError: (error) => {
      alert(`Error creating artifact: ${error.message}`);
    },
  });

  // Initialize with a new session on mount
  useEffect(() => {
    if (!currentSessionId && !createSession.isPending) {
      createSession.mutate({ title: "New Chat" });
    }
  }, [currentSessionId]);

  // Load messages when session changes
  useEffect(() => {
    if (sessionData?.messages) {
      const formattedMessages: Message[] = sessionData.messages.map((msg: any) => ({
        id: msg.id,
        role: msg.role === "assistant" ? "agent" : msg.role,
        content: msg.content,
        timestamp: new Date(msg.createdAt),
        agentName: msg.agentId
          ? AGENTS.find((a) => a.id === msg.agentId)?.name
          : undefined,
        agentColor: msg.agentId
          ? AGENTS.find((a) => a.id === msg.agentId)?.color
          : undefined,
      }));
      setMessages(formattedMessages);
    }
  }, [sessionData]);

  const handleNewSession = () => {
    createSession.mutate({ title: "New Chat" });
    setMessages([]);
    setInput("");
    setError(null);
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setInput("");
    setError(null);
  };

  const handleProjectChange = (projectId: string) => {
    if (!currentSessionId) return;
    updateSession.mutate({
      id: currentSessionId,
      projectId: projectId === "none" ? null : projectId,
    });
  };

  const handleGenerateArtifact = () => {
    if (!newArtifact.title.trim()) {
      alert("Please enter an artifact title");
      return;
    }

    // Generate content from chat messages
    const conversationSummary = messages
      .filter((m) => m.content.trim().length > 0)
      .map((m) => `**${m.role === "user" ? "User" : m.agentName || "Assistant"}:** ${m.content}`)
      .join("\n\n");

    const content = `# ${newArtifact.title}

${newArtifact.description ? `${newArtifact.description}\n\n` : ""}## Conversation Summary

${conversationSummary || "No conversation yet."}

---

*This artifact was generated from a chat conversation.*
`;

    createArtifact.mutate({
      ...newArtifact,
      content,
      projectId: sessionData?.projectId || undefined,
      status: "draft",
    });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isStreamingLoading || !currentSessionId) return;

    setError(null);
    setInput("");
    setIsStreamingLoading(true);

    // Add user message to UI
    const userMessage: Message = {
      id: `temp-msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Save user message to database
    try {
      await createMessage.mutateAsync({
        sessionId: currentSessionId,
        role: "user",
        content,
      });
    } catch (err) {
      console.error("Error saving user message:", err);
    }

    // Create assistant message placeholder
    const assistantMessageId = `temp-msg-${Date.now()}-assistant`;
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "agent",
      content: "",
      timestamp: new Date(),
      agentName: selectedAgent?.name,
      agentColor: selectedAgent?.color,
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      // Call the AI API with streaming
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...sessionData?.messages.map((m: any) => ({
              role: m.role,
              content: m.content,
            })) ?? [],
            {
              role: "user",
              content,
            },
          ],
          agentId: selectedAgentId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("0:")) {
            // Text content
            const parsedContent = line.slice(2).trim().replace(/^"|"$/g, "");
            if (parsedContent) {
              accumulatedContent += parsedContent;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content: accumulatedContent }
                    : m
                )
              );
            }
          }
        }
      }

      // Save assistant message to database
      if (accumulatedContent) {
        try {
          await createMessage.mutateAsync({
            sessionId: currentSessionId,
            role: "assistant",
            content: accumulatedContent,
            agentId: selectedAgentId,
          });

          // Update session title based on first message
          if (sessionData?.messages.length === 0) {
            const titlePreview = content.slice(0, 50);
            utils.chat.updateSession.mutate({
              id: currentSessionId,
              title: titlePreview + (content.length > 50 ? "..." : ""),
            });
          }
        } catch (err) {
          console.error("Error saving assistant message:", err);
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      // Remove the placeholder assistant message on error
      setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
    } finally {
      setIsStreamingLoading(false);
    }
  };

  // Loading state while creating initial session
  if (!currentSessionId && createSession.isPending) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-neutral-400" />
          <p className="mt-4 text-sm text-neutral-600">Initializing chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-white">
      {/* Chat History Sidebar */}
      <ChatHistorySidebar
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {sessionData?.title || "AI Chat Workspace"}
                </h2>
                {sessionData?.project && (
                  <Badge variant="secondary" className="gap-1">
                    <Folder className="h-3 w-3" />
                    {sessionData.project.name}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-neutral-600">
                {error ? (
                  <span className="text-error">{error}</span>
                ) : (
                  "Chat with specialized AI agents powered by real AI"
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setIsArtifactDialogOpen(true)}
                disabled={messages.length === 0}
              >
                <Sparkles className="h-4 w-4" />
                Generate Artifact
              </Button>
              <Select
                value={sessionData?.projectId || "none"}
                onValueChange={handleProjectChange}
                disabled={!currentSessionId}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="No project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No project</SelectItem>
                  {projectsData?.projects.map((project: any) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <AgentSelector
                agents={AGENTS}
                selectedAgentId={selectedAgentId}
                onSelectAgent={setSelectedAgentId}
              />
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 overflow-hidden">
          {isLoadingSession ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            </div>
          ) : (
            <ChatContainer
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isStreamingLoading}
              loadingAgentName={selectedAgent?.name}
              loadingAgentColor={selectedAgent?.color}
              input={input}
              onInputChange={setInput}
            />
          )}
        </div>
      </div>

      {/* Generate Artifact Dialog */}
      <Dialog open={isArtifactDialogOpen} onOpenChange={setIsArtifactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Artifact from Chat</DialogTitle>
            <DialogDescription>
              Create a new artifact using the conversation from this chat session
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="artifact-type">Type</Label>
              <Select
                value={newArtifact.type}
                onValueChange={(value: any) =>
                  setNewArtifact({ ...newArtifact, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prd">PRD (Product Requirements)</SelectItem>
                  <SelectItem value="architecture">Architecture</SelectItem>
                  <SelectItem value="story">User Story</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                  <SelectItem value="tech-spec">Technical Specification</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="artifact-title">Title</Label>
              <Input
                id="artifact-title"
                placeholder="My Artifact"
                value={newArtifact.title}
                onChange={(e) =>
                  setNewArtifact({ ...newArtifact, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artifact-description">Description (Optional)</Label>
              <Textarea
                id="artifact-description"
                placeholder="Brief description of this artifact"
                value={newArtifact.description}
                onChange={(e) =>
                  setNewArtifact({ ...newArtifact, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="rounded-lg bg-neutral-50 p-3 text-sm text-neutral-600">
              <p className="font-medium">What will be included:</p>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• Full conversation history ({messages.length} messages)</li>
                <li>• Formatted with user and agent labels</li>
                {sessionData?.project && (
                  <li>• Linked to project: {sessionData.project.name}</li>
                )}
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsArtifactDialogOpen(false)}
              disabled={createArtifact.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateArtifact}
              disabled={createArtifact.isPending}
            >
              {createArtifact.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Artifact
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ChatContainer } from "@/components/chat/chat-container";
import { AgentSelector } from "@/components/chat/agent-selector";
import { type Message, type Agent } from "@/types/chat";

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
  const [selectedAgentId, setSelectedAgentId] = useState("pm");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedAgent = AGENTS.find((a) => a.id === selectedAgentId);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    setError(null);
    setInput("");
    setIsLoading(true);

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Create assistant message placeholder
    const assistantMessageId = `msg-${Date.now()}-assistant`;
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
      // Call the API with streaming
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({
              role: m.role === "agent" ? "assistant" : m.role,
              content: m.content,
            })),
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
            const content = line.slice(2).trim().replace(/^"|"$/g, "");
            if (content) {
              accumulatedContent += content;
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
    } catch (err) {
      console.error("Chat error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      // Remove the placeholder assistant message on error
      setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Chat Header */}
      <div className="border-b border-neutral-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              AI Chat Workspace
            </h2>
            <p className="text-sm text-neutral-600">
              {error ? (
                <span className="text-error">{error}</span>
              ) : (
                "Chat with specialized AI agents powered by real AI"
              )}
            </p>
          </div>
          <AgentSelector
            agents={AGENTS}
            selectedAgentId={selectedAgentId}
            onSelectAgent={setSelectedAgentId}
          />
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden">
        <ChatContainer
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          loadingAgentName={selectedAgent?.name}
          loadingAgentColor={selectedAgent?.color}
          input={input}
          onInputChange={setInput}
        />
      </div>
    </div>
  );
}

import React, { useRef, useEffect } from "react";
import { MessageComponent } from "./message";
import { ChatInput } from "./chat-input";
import { TypingIndicator } from "./typing-indicator";
import { type Message } from "@/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";

interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  loadingAgentName?: string;
  loadingAgentColor?: string;
  disabled?: boolean;
}

export function ChatContainer({
  messages,
  onSendMessage,
  isLoading = false,
  loadingAgentName,
  loadingAgentColor,
  disabled = false,
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex h-full flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-primary-100 p-4">
                  <Sparkles className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-neutral-900">
                  Start a conversation
                </h3>
                <p className="mb-6 max-w-sm text-sm text-neutral-500">
                  Chat with specialized AI agents to plan, design, and implement
                  your software projects.
                </p>
                <div className="flex flex-col gap-2 text-left">
                  <button className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50">
                    💡 Help me create a PRD for my app
                  </button>
                  <button className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50">
                    🏗️ Design the architecture for a new feature
                  </button>
                  <button className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50">
                    🐛 Help me fix a bug in my code
                  </button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <MessageComponent key={message.id} message={message} />
                ))}
                {isLoading && (
                  <TypingIndicator
                    agentName={loadingAgentName}
                    agentColor={loadingAgentColor}
                  />
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <ChatInput onSend={onSendMessage} disabled={disabled || isLoading} />
    </div>
  );
}

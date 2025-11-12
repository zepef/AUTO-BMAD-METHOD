import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  agentName?: string;
  agentColor?: string;
}

export function TypingIndicator({
  agentName = "Agent",
  agentColor,
}: TypingIndicatorProps) {
  return (
    <div className="mb-4 flex gap-3">
      <Avatar
        className="h-8 w-8 shrink-0"
        style={agentColor ? { backgroundColor: agentColor } : undefined}
      >
        <AvatarFallback
          className={cn("bg-opacity-90 text-white")}
          style={agentColor ? { backgroundColor: agentColor } : undefined}
        >
          {agentName[0]?.toUpperCase() || "A"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-900">
            {agentName}
          </span>
        </div>

        <div className="rounded-lg bg-neutral-100 px-4 py-3">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

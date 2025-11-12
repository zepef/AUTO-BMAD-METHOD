import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  value?: string;
  onChange?: (value: string) => void;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Type a message... (Shift+Enter for new line)",
  maxLength = 5000,
  value: controlledValue,
  onChange: controlledOnChange,
}: ChatInputProps) {
  const [internalMessage, setInternalMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Use controlled value if provided, otherwise use internal state
  const message = controlledValue !== undefined ? controlledValue : internalMessage;
  const setMessage = controlledOnChange || setInternalMessage;

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      // Clear message
      if (controlledOnChange) {
        controlledOnChange("");
      } else {
        setInternalMessage("");
      }
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const characterCount = message.length;
  const isNearLimit = characterCount > maxLength * 0.8;
  const isOverLimit = characterCount > maxLength;

  return (
    <div className="border-t border-neutral-200 bg-white p-4">
      <div className="relative flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[44px] max-h-[200px] resize-none pr-12"
          rows={1}
        />

        {isNearLimit && (
          <span
            className={cn(
              "absolute bottom-3 right-16 text-xs",
              isOverLimit ? "text-error" : "text-warning"
            )}
          >
            {characterCount}/{maxLength}
          </span>
        )}

        <Button
          onClick={handleSend}
          disabled={disabled || !message.trim() || isOverLimit}
          size="icon"
          className="shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
        <span>Press Enter to send, Shift+Enter for new line</span>
      </div>
    </div>
  );
}

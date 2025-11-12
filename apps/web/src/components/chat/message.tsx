import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type Message } from "@/types/chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FileText } from "lucide-react";

interface MessageProps {
  message: Message;
}

export function MessageComponent({ message }: MessageProps) {
  const { role, content, agentName, agentColor, timestamp, artifacts, status } =
    message;

  const isUser = role === "user";
  const isSystem = role === "system";

  return (
    <div
      className={cn(
        "mb-4 flex gap-3",
        isUser && "flex-row-reverse",
        isSystem && "justify-center"
      )}
    >
      {!isSystem && (
        <Avatar
          className={cn(
            "h-8 w-8 shrink-0",
            !isUser && agentColor && `bg-[${agentColor}]`
          )}
          style={
            !isUser && agentColor ? { backgroundColor: agentColor } : undefined
          }
        >
          <AvatarFallback
            className={cn(
              isUser ? "bg-primary-600 text-white" : "text-white",
              !isUser && "bg-opacity-90"
            )}
          >
            {isUser ? "U" : agentName?.[0]?.toUpperCase() || "A"}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex-1", isUser && "flex flex-col items-end")}>
        {!isUser && !isSystem && (
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm font-semibold text-neutral-900">
              {agentName || "Agent"}
            </span>
            <span className="text-xs text-neutral-500">
              {timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}

        <div
          className={cn(
            "rounded-lg px-4 py-3",
            isUser && "bg-primary-600 text-white",
            !isUser && !isSystem && "bg-neutral-100 text-neutral-900",
            isSystem && "bg-yellow-50 text-yellow-900 border border-yellow-200"
          )}
        >
          {isSystem ? (
            <p className="text-center text-sm">{content}</p>
          ) : (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-md text-sm"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className={cn(
                          "rounded px-1.5 py-0.5 text-sm",
                          isUser
                            ? "bg-primary-700"
                            : "bg-neutral-200 text-neutral-900"
                        )}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  p({ children }) {
                    return (
                      <p className={cn("mb-2 last:mb-0", isUser && "text-white")}>
                        {children}
                      </p>
                    );
                  },
                  ul({ children }) {
                    return (
                      <ul
                        className={cn(
                          "mb-2 ml-4 list-disc last:mb-0",
                          isUser && "text-white"
                        )}
                      >
                        {children}
                      </ul>
                    );
                  },
                  ol({ children }) {
                    return (
                      <ol
                        className={cn(
                          "mb-2 ml-4 list-decimal last:mb-0",
                          isUser && "text-white"
                        )}
                      >
                        {children}
                      </ol>
                    );
                  },
                  li({ children }) {
                    return (
                      <li className={cn("mb-1", isUser && "text-white")}>
                        {children}
                      </li>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}

          {status === "sending" && (
            <div className="mt-2 text-xs opacity-70">Sending...</div>
          )}
          {status === "error" && (
            <div className="mt-2 text-xs text-error">Failed to send</div>
          )}
        </div>

        {artifacts && artifacts.length > 0 && (
          <div className="mt-2 space-y-2">
            {artifacts.map((artifact) => (
              <Card
                key={artifact.id}
                className="w-full max-w-sm cursor-pointer transition-shadow hover:shadow-md"
              >
                <CardHeader className="flex flex-row items-center gap-3 pb-3">
                  <FileText className="h-5 w-5 text-primary-600" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {artifact.title}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {artifact.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-500">
                      Updated{" "}
                      {artifact.updatedAt.toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="line-clamp-2 text-sm text-neutral-600">
                    {artifact.content.substring(0, 100)}...
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

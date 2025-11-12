"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Home,
  MessageSquare,
  FolderKanban,
  Sparkles,
  Settings,
  Plus,
  FileText,
  Code,
  Users,
  Search,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AGENTS = [
  { id: "pm", name: "Product Manager", color: "#8b5cf6", icon: "PM" },
  { id: "architect", name: "Architect", color: "#0ea5e9", icon: "AR" },
  { id: "developer", name: "Developer", color: "#10b981", icon: "DV" },
  { id: "designer", name: "Designer", color: "#f59e0b", icon: "DS" },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Type a command or search..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/"))}
          >
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/chat"))}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Chat</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/projects"))}
          >
            <FolderKanban className="mr-2 h-4 w-4" />
            <span>Projects</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/design"))}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Design System</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/chat?new=true"))}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>New Chat</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-neutral-200 bg-neutral-100 px-1.5 font-mono text-xs font-medium">
              <span className="text-xs">⌘</span>N
            </kbd>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/projects/new"))}
          >
            <FolderKanban className="mr-2 h-4 w-4" />
            <span>New Project</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => alert("Create artifact"))}
          >
            <FileText className="mr-2 h-4 w-4" />
            <span>New Artifact</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Switch Agent */}
        <CommandGroup heading="Switch Agent">
          {AGENTS.map((agent) => (
            <CommandItem
              key={agent.id}
              onSelect={() =>
                runCommand(() => router.push(`/chat?agent=${agent.id}`))
              }
            >
              <Avatar
                className="mr-2 h-5 w-5"
                style={{ backgroundColor: agent.color }}
              >
                <AvatarFallback
                  className="text-[10px] text-white"
                  style={{ backgroundColor: agent.color }}
                >
                  {agent.icon}
                </AvatarFallback>
              </Avatar>
              <span>{agent.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Recent Conversations */}
        <CommandGroup heading="Recent Conversations">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/chat/1"))}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Product requirements discussion</span>
            <span className="ml-auto text-xs text-neutral-500">2h ago</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/chat/2"))}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Architecture review</span>
            <span className="ml-auto text-xs text-neutral-500">5h ago</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/chat/3"))}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Bug fix planning</span>
            <span className="ml-auto text-xs text-neutral-500">1d ago</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Settings */}
        <CommandGroup heading="Settings">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/settings"))}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-neutral-200 bg-neutral-100 px-1.5 font-mono text-xs font-medium">
              <span className="text-xs">⌘</span>,
            </kbd>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

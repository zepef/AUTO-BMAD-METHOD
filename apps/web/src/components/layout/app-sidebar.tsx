"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  MessageSquare,
  FolderKanban,
  Plus,
  Settings,
  Sparkles,
} from "lucide-react";

interface AppSidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const MOCK_PROJECTS = [
  { id: "1", name: "E-commerce Platform", color: "#8b5cf6" },
  { id: "2", name: "Mobile App Redesign", color: "#0ea5e9" },
  { id: "3", name: "API Gateway Service", color: "#10b981" },
];

const MOCK_CONVERSATIONS = [
  { id: "1", title: "Product requirements discussion", timestamp: "2h ago" },
  { id: "2", title: "Architecture review", timestamp: "5h ago" },
  { id: "3", title: "Bug fix planning", timestamp: "1d ago" },
  { id: "4", title: "Feature brainstorming", timestamp: "2d ago" },
];

export function AppSidebar({ collapsed, onCollapsedChange }: AppSidebarProps) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<"projects" | "conversations">("conversations");

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: MessageSquare, label: "Chat", href: "/chat" },
    { icon: FolderKanban, label: "Projects", href: "/projects" },
    { icon: Sparkles, label: "Design", href: "/design" },
  ];

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-neutral-200 bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo & Collapse Button */}
      <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-neutral-900">FlowForge</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCollapsedChange(!collapsed)}
          className={cn("shrink-0", collapsed && "mx-auto")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      <Separator className="my-2" />

      {/* Projects / Conversations Sections */}
      {!collapsed && (
        <div className="flex-1 overflow-hidden">
          {/* Section Tabs */}
          <div className="flex border-b border-neutral-200">
            <button
              onClick={() => setActiveSection("conversations")}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                activeSection === "conversations"
                  ? "border-b-2 border-primary-600 text-primary-600"
                  : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              Chats
            </button>
            <button
              onClick={() => setActiveSection("projects")}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                activeSection === "projects"
                  ? "border-b-2 border-primary-600 text-primary-600"
                  : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              Projects
            </button>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {activeSection === "conversations" ? (
                <div className="space-y-1">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                    New Chat
                  </Button>
                  {MOCK_CONVERSATIONS.map((conv) => (
                    <Link key={conv.id} href={`/chat/${conv.id}`}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left"
                        size="sm"
                      >
                        <div className="flex-1 overflow-hidden">
                          <div className="truncate text-sm font-medium">
                            {conv.title}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {conv.timestamp}
                          </div>
                        </div>
                      </Button>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                    New Project
                  </Button>
                  {MOCK_PROJECTS.map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                        size="sm"
                      >
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="truncate text-sm">{project.name}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* User Profile Section */}
      <div className="border-t border-neutral-200 p-3">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3",
            collapsed && "justify-center px-2"
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary-600 text-white text-sm">
              JD
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 overflow-hidden text-left">
              <div className="truncate text-sm font-medium">John Doe</div>
              <div className="truncate text-xs text-neutral-500">
                john@example.com
              </div>
            </div>
          )}
        </Button>
        {!collapsed && (
          <Link href="/settings">
            <Button variant="ghost" className="mt-1 w-full justify-start gap-3" size="sm">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </Link>
        )}
      </div>
    </aside>
  );
}

# FlowForge UI/UX Design Specification

**Version:** 1.0
**Date:** 2025-01-12
**Status:** Design Phase

---

## Table of Contents

- [1. Design System](#1-design-system)
- [2. Core Layouts](#2-core-layouts)
- [3. Component Library](#3-component-library)
- [4. Page Designs](#4-page-designs)
- [5. React Component Implementations](#5-react-component-implementations)
- [6. Responsive Design](#6-responsive-design)
- [7. Accessibility](#7-accessibility)

---

## 1. Design System

### 1.1 Color Palette

```typescript
// colors.ts
export const colors = {
  // Primary - Purple/Blue gradient
  primary: {
    50: '#f0f4ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1', // Main primary
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },

  // Secondary - Teal/Cyan
  secondary: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981', // Main secondary
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  // Neutral - Slate
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Agent colors (for avatars/badges)
  agents: {
    pm: '#8b5cf6', // Purple
    architect: '#0ea5e9', // Sky blue
    developer: '#10b981', // Green
    designer: '#f59e0b', // Amber
    qa: '#ef4444', // Red
    sm: '#6366f1', // Indigo
  },
};
```

### 1.2 Typography

```typescript
// typography.ts
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Monaco', 'Courier New', 'monospace'],
  },

  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};
```

### 1.3 Spacing

```typescript
// spacing.ts
export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
};
```

### 1.4 Shadows

```typescript
// shadows.ts
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
};
```

### 1.5 Border Radius

```typescript
// radius.ts
export const radius = {
  none: '0',
  sm: '0.25rem',   // 4px
  base: '0.5rem',  // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  full: '9999px',  // Fully rounded
};
```

---

## 2. Core Layouts

### 2.1 Main Application Layout

```
┌────────────────────────────────────────────────────────────────┐
│  Top Navigation Bar (64px height)                              │
│  Logo | Command Palette | Notifications | User Menu            │
├──────────┬─────────────────────────────────┬───────────────────┤
│          │                                 │                   │
│ Sidebar  │   Main Content Area             │  Right Panel      │
│ (240px)  │   (fluid width)                 │  (360px)          │
│          │                                 │                   │
│ Projects │   Dynamic content based on      │  Context-aware    │
│ Agents   │   current view:                 │  sidebar:         │
│ Settings │   - Chat Interface              │  - Artifacts      │
│          │   - Project Dashboard           │  - Team Activity  │
│          │   - Analytics                   │  - Help           │
│          │                                 │                   │
│          │                                 │  Collapsible      │
│          │                                 │  (toggle button)  │
│          │                                 │                   │
└──────────┴─────────────────────────────────┴───────────────────┘
```

### 2.2 Chat View Layout

```
┌────────────────────────────────────────────────────────────────┐
│  Chat Header                                                    │
│  [Agent Avatar] Agent Name | Workflow: PRD | Phase 2           │
│  [Switch Agent ▾] [Party Mode] [...More]                       │
├─────────────────────────────────────┬───────────────────────────┤
│                                     │                           │
│  Conversation Area                  │  Artifacts Panel          │
│  (scrollable)                       │  (fixed)                  │
│                                     │                           │
│  ┌───────────────────────────────┐ │  📄 Documents             │
│  │ 👤 You:                       │ │  ├─ ✓ PRD.md              │
│  │ Let's create a PRD            │ │  │  └─ 3 sections         │
│  └───────────────────────────────┘ │  ├─ ⏳ Architecture.md    │
│                                     │  │  (in progress)         │
│  ┌───────────────────────────────┐ │  └─ ⊞ UX-Design.md        │
│  │ 🤖 John (PM):                 │ │     (not started)         │
│  │ Great! I'll guide you         │ │                           │
│  │ through the PRD process.      │ │  📊 Progress              │
│  │ [Generated PRD preview...]    │ │  Phase 2: Planning        │
│  │                               │ │  ████████░░ 80%           │
│  │ [✓ Approve] [✏️ Edit]         │ │                           │
│  └───────────────────────────────┘ │  🎯 Next Up               │
│                                     │  → Complete requirements  │
│  ┌───────────────────────────────┐ │  → Start UX design        │
│  │ 👤 You:                       │ │                           │
│  │ Looks good, let's continue    │ │  👥 Team Activity         │
│  └───────────────────────────────┘ │  • Alice updated PRD      │
│                                     │    2 min ago              │
│  [Typing indicator...]              │  • Bob started stories    │
│                                     │    15 min ago             │
├─────────────────────────────────────┤                           │
│  Input Area                         │                           │
│  ┌─────────────────────────────┐   │                           │
│  │ Type your message...        │   │                           │
│  │                             │   │                           │
│  └─────────────────────────────┘   │                           │
│  [📎 Attach] [💡 Suggest] [Send]   │                           │
└─────────────────────────────────────┴───────────────────────────┘
```

---

## 3. Component Library

### 3.1 Button Component

```typescript
// components/ui/button.tsx
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700',
        secondary: 'bg-secondary-600 text-white hover:bg-secondary-700',
        outline: 'border border-neutral-300 bg-white hover:bg-neutral-50',
        ghost: 'hover:bg-neutral-100',
        link: 'text-primary-600 underline-offset-4 hover:underline',
        destructive: 'bg-error text-white hover:bg-red-600',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

### 3.2 Chat Message Component

```typescript
// components/chat/message.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

interface MessageProps {
  role: 'user' | 'agent' | 'system';
  content: string;
  agentName?: string;
  agentAvatar?: string;
  timestamp: Date;
  artifacts?: Artifact[];
  onArtifactClick?: (artifactId: string) => void;
}

export function Message({
  role,
  content,
  agentName,
  agentAvatar,
  timestamp,
  artifacts,
  onArtifactClick,
}: MessageProps) {
  const isUser = role === 'user';
  const isSystem = role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-neutral-100 text-neutral-600 text-sm px-4 py-2 rounded-full">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex gap-3 py-4 px-4 hover:bg-neutral-50/50 transition-colors',
        isUser && 'bg-white'
      )}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 flex-shrink-0">
        {isUser ? (
          <>
            <AvatarFallback className="bg-primary-100 text-primary-700">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src={agentAvatar} alt={agentName} />
            <AvatarFallback className="bg-secondary-100 text-secondary-700">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </>
        )}
      </Avatar>

      {/* Content */}
      <div className="flex-1 space-y-2 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">
            {isUser ? 'You' : agentName || 'Agent'}
          </span>
          <span className="text-xs text-neutral-500">
            {format(timestamp, 'h:mm a')}
          </span>
        </div>

        {/* Message Content */}
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Artifacts */}
        {artifacts && artifacts.length > 0 && (
          <div className="space-y-2 mt-3">
            {artifacts.map((artifact) => (
              <Card
                key={artifact.id}
                className="p-3 cursor-pointer hover:border-primary-300 transition-colors"
                onClick={() => onArtifactClick?.(artifact.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getArtifactIcon(artifact.type)}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{artifact.title}</div>
                    <div className="text-xs text-neutral-500">
                      {artifact.status === 'completed'
                        ? 'Ready to review'
                        : 'In progress...'}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getArtifactIcon(type: string): string {
  const icons: Record<string, string> = {
    prd: '📄',
    architecture: '🏗️',
    'tech-spec': '📋',
    story: '📝',
    epic: '📚',
  };
  return icons[type] || '📄';
}
```

### 3.3 Artifact Viewer Component

```typescript
// components/artifacts/artifact-viewer.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Edit, History, Share } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { MonacoEditor } from './monaco-editor';

interface ArtifactViewerProps {
  artifact: {
    id: string;
    type: string;
    title: string;
    content: string;
    version: number;
    updatedAt: Date;
  };
  onEdit?: () => void;
  onExport?: () => void;
  onShare?: () => void;
  onVersionHistory?: () => void;
}

export function ArtifactViewer({
  artifact,
  onEdit,
  onExport,
  onShare,
  onVersionHistory,
}: ArtifactViewerProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview');

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{artifact.title}</h2>
            <p className="text-sm text-neutral-500">
              Version {artifact.version} • Last updated{' '}
              {format(artifact.updatedAt, 'MMM d, yyyy')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onVersionHistory}>
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            <Button variant="ghost" size="sm" onClick={onShare}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="h-full">
          <TabsList className="w-full justify-start border-b rounded-none">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="h-full overflow-auto p-6">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{artifact.content}</ReactMarkdown>
            </div>
          </TabsContent>

          <TabsContent value="edit" className="h-full p-0">
            <MonacoEditor
              value={artifact.content}
              onChange={(value) => {
                // Handle edit
              }}
              language="markdown"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
```

### 3.4 Workflow Progress Component

```typescript
// components/workflow/workflow-progress.tsx
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Check, Circle, Clock } from 'lucide-react';

interface WorkflowProgressProps {
  phase: number;
  workflows: {
    id: string;
    name: string;
    status: 'not-started' | 'in-progress' | 'completed';
    completedAt?: Date;
  }[];
}

export function WorkflowProgress({ phase, workflows }: WorkflowProgressProps) {
  const completed = workflows.filter((w) => w.status === 'completed').length;
  const total = workflows.length;
  const progress = (completed / total) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Phase {phase}: Planning</h3>
          <p className="text-sm text-neutral-500">
            {completed} of {total} workflows completed
          </p>
        </div>
        <Badge variant={progress === 100 ? 'success' : 'default'}>
          {Math.round(progress)}%
        </Badge>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="space-y-2">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border transition-colors',
              workflow.status === 'completed' && 'bg-green-50 border-green-200',
              workflow.status === 'in-progress' && 'bg-blue-50 border-blue-200',
              workflow.status === 'not-started' && 'bg-neutral-50 border-neutral-200'
            )}
          >
            <div className="flex-shrink-0">
              {workflow.status === 'completed' ? (
                <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              ) : workflow.status === 'in-progress' ? (
                <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full bg-neutral-300 flex items-center justify-center">
                  <Circle className="h-4 w-4 text-neutral-500" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="font-medium text-sm">{workflow.name}</div>
              {workflow.completedAt && (
                <div className="text-xs text-neutral-500">
                  Completed {format(workflow.completedAt, 'MMM d')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3.5 Agent Selector Component

```typescript
// components/agents/agent-selector.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  color: string;
}

interface AgentSelectorProps {
  agents: Agent[];
  selectedAgentId: string;
  onSelectAgent: (agentId: string) => void;
}

export function AgentSelector({ agents, selectedAgentId, onSelectAgent }: AgentSelectorProps) {
  const [open, setOpen] = useState(false);
  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-neutral-50 transition-colors"
          aria-expanded={open}
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={selectedAgent?.avatar} />
            <AvatarFallback style={{ backgroundColor: selectedAgent?.color }}>
              {selectedAgent?.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="text-left flex-1">
            <div className="text-sm font-medium">{selectedAgent?.name}</div>
            <div className="text-xs text-neutral-500">{selectedAgent?.role}</div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-neutral-400" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search agents..." />
          <CommandEmpty>No agents found.</CommandEmpty>
          <CommandGroup>
            {agents.map((agent) => (
              <CommandItem
                key={agent.id}
                value={agent.id}
                onSelect={() => {
                  onSelectAgent(agent.id);
                  setOpen(false);
                }}
                className="flex items-center gap-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={agent.avatar} />
                  <AvatarFallback style={{ backgroundColor: agent.color }}>
                    {agent.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm font-medium">{agent.name}</div>
                  <div className="text-xs text-neutral-500">{agent.role}</div>
                </div>
                {agent.id === selectedAgentId && <Check className="h-4 w-4 text-primary-600" />}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
```

---

## 4. Page Designs

### 4.1 Dashboard Page

```typescript
// app/dashboard/page.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-neutral-500">Welcome back! Here's your project overview.</p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-neutral-500">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Artifacts Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-neutral-500">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-neutral-500">Collaborating with you</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Project list */}
        </CardContent>
      </Card>
    </div>
  );
}
```

### 4.2 Chat Page

```typescript
// app/projects/[id]/chat/page.tsx
'use client';

import { AgentSelector } from '@/components/agents/agent-selector';
import { ArtifactViewer } from '@/components/artifacts/artifact-viewer';
import { Message } from '@/components/chat/message';
import { ChatInput } from '@/components/chat/chat-input';
import { WorkflowProgress } from '@/components/workflow/workflow-progress';
import { useChat } from '@/hooks/use-chat';
import { useMemo, useRef, useEffect } from 'react';

export default function ChatPage({ params }: { params: { id: string } }) {
  const { messages, sendMessage, selectedAgent, agents, selectAgent, isLoading } = useChat(
    params.id
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-full">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b p-4">
          <AgentSelector
            agents={agents}
            selectedAgentId={selectedAgent.id}
            onSelectAgent={selectAgent}
          />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.map((message) => (
            <Message key={message.id} {...message} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
                <div
                  className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                />
              </div>
              <span className="text-sm text-neutral-500">{selectedAgent.name} is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-96 border-l bg-neutral-50 overflow-y-auto">
        <div className="p-4 space-y-6">
          <WorkflowProgress phase={2} workflows={[]} />
          {/* Artifacts list */}
          {/* Team activity */}
        </div>
      </div>
    </div>
  );
}
```

---

## 5. React Component Implementations

### 5.1 Custom Hooks

```typescript
// hooks/use-chat.ts
import { useCallback, useState } from 'react';
import { trpc } from '@/lib/trpc';

export function useChat(projectId: string) {
  const [selectedAgentId, setSelectedAgentId] = useState('pm');

  const { data: conversation, isLoading } = trpc.conversations.getActive.useQuery({
    projectId,
    agentId: selectedAgentId,
  });

  const sendMessageMutation = trpc.conversations.sendMessage.useMutation();

  const sendMessage = useCallback(
    async (content: string) => {
      await sendMessageMutation.mutateAsync({
        conversationId: conversation!.id,
        content,
      });
    },
    [conversation, sendMessageMutation]
  );

  return {
    messages: conversation?.messages || [],
    sendMessage,
    selectedAgent: conversation?.agent,
    agents: [], // Load from API
    selectAgent: setSelectedAgentId,
    isLoading: sendMessageMutation.isLoading,
  };
}
```

```typescript
// hooks/use-artifacts.ts
import { trpc } from '@/lib/trpc';

export function useArtifacts(projectId: string) {
  const { data: artifacts, isLoading } = trpc.artifacts.list.useQuery({ projectId });

  const createMutation = trpc.artifacts.create.useMutation();
  const updateMutation = trpc.artifacts.update.useMutation();

  return {
    artifacts: artifacts || [],
    isLoading,
    createArtifact: createMutation.mutateAsync,
    updateArtifact: updateMutation.mutateAsync,
  };
}
```

### 5.2 State Management (Zustand)

```typescript
// stores/ui-store.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  commandPaletteOpen: boolean;

  setSidebarOpen: (open: boolean) => void;
  setRightPanelOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  rightPanelOpen: true,
  commandPaletteOpen: false,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
}));
```

```typescript
// stores/chat-store.ts
import { create } from 'zustand';

interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  streamingMessage: string;

  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  startStreaming: () => void;
  appendToStream: (chunk: string) => void;
  endStreaming: () => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isStreaming: false,
  streamingMessage: '',

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: Math.random().toString(36),
          timestamp: new Date(),
        },
      ],
    })),

  startStreaming: () => set({ isStreaming: true, streamingMessage: '' }),

  appendToStream: (chunk) =>
    set((state) => ({
      streamingMessage: state.streamingMessage + chunk,
    })),

  endStreaming: () =>
    set((state) => ({
      isStreaming: false,
      messages: [
        ...state.messages,
        {
          id: Math.random().toString(36),
          role: 'agent',
          content: state.streamingMessage,
          timestamp: new Date(),
        },
      ],
      streamingMessage: '',
    })),

  clearMessages: () => set({ messages: [] }),
}));
```

---

## 6. Responsive Design

### 6.1 Breakpoints

```typescript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      'sm': '640px',   // Mobile landscape
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large desktop
      '2xl': '1536px', // Extra large
    },
  },
};
```

### 6.2 Mobile Layout

```
Mobile (<768px):
┌──────────────────────┐
│  Top Bar             │
│  [Menu] FlowForge    │
├──────────────────────┤
│                      │
│  Chat Messages       │
│  (full width)        │
│                      │
│                      │
│                      │
│                      │
├──────────────────────┤
│  Input Area          │
│  [Type message...]   │
└──────────────────────┘

Bottom Navigation:
[Chat] [Artifacts] [Team] [More]
```

### 6.3 Responsive Classes

```typescript
// Example responsive component
<div className="
  grid
  grid-cols-1        /* Mobile: 1 column */
  md:grid-cols-2     /* Tablet: 2 columns */
  lg:grid-cols-3     /* Desktop: 3 columns */
  gap-4              /* Spacing between items */
">
  {/* Content */}
</div>

<div className="
  p-4                /* Mobile: 16px padding */
  md:p-6             /* Tablet: 24px padding */
  lg:p-8             /* Desktop: 32px padding */
">
  {/* Content */}
</div>
```

---

## 7. Accessibility

### 7.1 ARIA Labels

```typescript
// Accessible button
<button
  aria-label="Send message"
  aria-describedby="send-button-description"
  aria-disabled={isDisabled}
>
  <Send className="h-4 w-4" />
</button>
<span id="send-button-description" className="sr-only">
  Send your message to the AI agent
</span>
```

### 7.2 Keyboard Navigation

```typescript
// Keyboard shortcuts
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Cmd+K: Open command palette
    if (e.metaKey && e.key === 'k') {
      e.preventDefault();
      setCommandPaletteOpen(true);
    }

    // Cmd+/: Toggle sidebar
    if (e.metaKey && e.key === '/') {
      e.preventDefault();
      toggleSidebar();
    }

    // Escape: Close modals
    if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

### 7.3 Focus Management

```typescript
// Focus trap for modals
import { useFocusTrap } from '@/hooks/use-focus-trap';

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useFocusTrap(isOpen);

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50"
    >
      {children}
    </div>
  );
}
```

---

## 8. Animation & Transitions

### 8.1 Framer Motion Examples

```typescript
// Animated message
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.2 }}
>
  <Message {...messageProps} />
</motion.div>
```

```typescript
// Staggered list animation
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }}
  initial="hidden"
  animate="show"
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 },
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## 9. Performance Optimizations

### 9.1 Code Splitting

```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@/components/editors/monaco-editor'), {
  loading: () => <div>Loading editor...</div>,
  ssr: false,
});

const Mermaid Diagram = dynamic(() => import('@/components/diagrams/mermaid'), {
  loading: () => <div>Rendering diagram...</div>,
  ssr: false,
});
```

### 9.2 Virtual Scrolling

```typescript
// For long message lists
import { useVirtualizer } from '@tanstack/react-virtual';

export function MessageList({ messages }: { messages: Message[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimated message height
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-full overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const message = messages[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <Message {...message} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

**Next:** [Backend Architecture](./BACKEND_ARCHITECTURE.md)

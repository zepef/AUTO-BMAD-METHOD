"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Quote,
  Link,
  Image,
  Eye,
  FileDown,
  Copy,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  initialContent?: string;
  artifactType?: "prd" | "architecture" | "story" | "epic" | "tech-spec" | "document";
  onSave?: (content: string) => void;
  className?: string;
}

// PRD Template
const PRD_TEMPLATE = `# Product Requirements Document

## 1. Overview
Brief description of the product/feature

## 2. Problem Statement
What problem are we solving?

## 3. Goals & Objectives
- Goal 1
- Goal 2
- Goal 3

## 4. User Stories
### User Story 1
As a [user type], I want to [action] so that [benefit]

## 5. Requirements
### Functional Requirements
- Requirement 1
- Requirement 2

### Non-Functional Requirements
- Performance requirements
- Security requirements
- Scalability requirements

## 6. Success Metrics
- Metric 1: Target value
- Metric 2: Target value

## 7. Timeline & Milestones
- Phase 1: Description (Date)
- Phase 2: Description (Date)

## 8. Dependencies & Risks
### Dependencies
- Dependency 1

### Risks
- Risk 1: Mitigation strategy
`;

const ARCHITECTURE_TEMPLATE = `# Architecture Document

## 1. System Overview
High-level description of the system

## 2. Architecture Goals
- Goal 1: Scalability
- Goal 2: Performance
- Goal 3: Security

## 3. System Components
### Component 1
Description and responsibilities

### Component 2
Description and responsibilities

## 4. Data Flow
Describe how data flows through the system

## 5. Technology Stack
- Frontend:
- Backend:
- Database:
- Infrastructure:

## 6. API Design
### Endpoint 1
\`\`\`
GET /api/resource
\`\`\`

## 7. Security Considerations
- Authentication strategy
- Authorization approach
- Data encryption

## 8. Performance & Scalability
- Expected load
- Caching strategy
- Database optimization

## 9. Deployment Strategy
- Environment setup
- CI/CD pipeline
- Rollback plan
`;

const STORY_TEMPLATE = `# User Story

## Story Title
As a [user type], I want to [action] so that [benefit]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Notes
Implementation considerations and technical details

## Design Considerations
UI/UX notes and design requirements

## Testing Strategy
- Unit tests
- Integration tests
- E2E tests

## Definition of Done
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Deployed to staging
`;

const TEMPLATES = {
  prd: PRD_TEMPLATE,
  architecture: ARCHITECTURE_TEMPLATE,
  story: STORY_TEMPLATE,
  epic: "# Epic\n\n## Overview\n\n## Stories\n\n## Timeline\n",
  "tech-spec": "# Technical Specification\n\n## Overview\n\n## Implementation Details\n",
  document: "# Document\n\n## Content\n",
};

export function MarkdownEditor({
  initialContent = "",
  artifactType = "document",
  onSave,
  className,
}: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent || TEMPLATES[artifactType]);
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("split");

  const insertMarkdown = (syntax: string, placeholder = "text") => {
    const textarea = document.getElementById("markdown-textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || placeholder;

    let newText = "";
    let cursorOffset = 0;

    switch (syntax) {
      case "bold":
        newText = `**${selectedText}**`;
        cursorOffset = selectedText === placeholder ? 2 : newText.length;
        break;
      case "italic":
        newText = `*${selectedText}*`;
        cursorOffset = selectedText === placeholder ? 1 : newText.length;
        break;
      case "h1":
        newText = `# ${selectedText}`;
        cursorOffset = newText.length;
        break;
      case "h2":
        newText = `## ${selectedText}`;
        cursorOffset = newText.length;
        break;
      case "h3":
        newText = `### ${selectedText}`;
        cursorOffset = newText.length;
        break;
      case "ul":
        newText = `- ${selectedText}`;
        cursorOffset = newText.length;
        break;
      case "ol":
        newText = `1. ${selectedText}`;
        cursorOffset = newText.length;
        break;
      case "code":
        newText = `\`${selectedText}\``;
        cursorOffset = selectedText === placeholder ? 1 : newText.length;
        break;
      case "quote":
        newText = `> ${selectedText}`;
        cursorOffset = newText.length;
        break;
      case "link":
        newText = `[${selectedText}](url)`;
        cursorOffset = selectedText === placeholder ? 1 : newText.length - 4;
        break;
      case "image":
        newText = `![${selectedText}](image-url)`;
        cursorOffset = newText.length - 1;
        break;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);

    // Set cursor position after state update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
    }, 0);
  };

  const handleSave = () => {
    onSave?.(content);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleExport = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${artifactType}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering (in production, use a library like marked or react-markdown)
    let html = text
      // Headings
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      // Code inline
      .replace(/`(.*?)`/gim, '<code class="bg-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      // Lists
      .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4">$2</li>')
      // Checkboxes
      .replace(/- \[ \] (.*$)/gim, '<label class="flex items-center gap-2"><input type="checkbox" class="rounded" /> $1</label>')
      .replace(/- \[x\] (.*$)/gim, '<label class="flex items-center gap-2"><input type="checkbox" checked class="rounded" /> $1</label>')
      // Quote
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-neutral-300 pl-4 italic text-neutral-600">$1</blockquote>')
      // Line breaks
      .replace(/\n/gim, '<br />');

    return html;
  };

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-neutral-200 p-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown("bold")}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown("italic")}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown("h1")}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown("h2")}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown("h3")}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown("ul")}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown("ol")}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown("code")}
            title="Code"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown("quote")}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown("link")}
            title="Link"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown("image")}
            title="Image"
          >
            <Image className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
            <TabsList className="h-8">
              <TabsTrigger value="edit" className="text-xs">
                Edit
              </TabsTrigger>
              <TabsTrigger value="split" className="text-xs">
                Split
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-xs">
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="ghost" size="sm" onClick={handleCopy} title="Copy">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExport} title="Export">
            <FileDown className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "edit" && (
          <textarea
            id="markdown-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-full w-full resize-none p-6 font-mono text-sm focus:outline-none"
            placeholder="Start writing your document..."
          />
        )}

        {viewMode === "preview" && (
          <div className="h-full overflow-auto p-6">
            <div
              className="prose prose-neutral max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </div>
        )}

        {viewMode === "split" && (
          <div className="grid h-full grid-cols-2 divide-x divide-neutral-200">
            <textarea
              id="markdown-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-full w-full resize-none p-6 font-mono text-sm focus:outline-none"
              placeholder="Start writing your document..."
            />
            <div className="h-full overflow-auto p-6">
              <div
                className="prose prose-neutral max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-2 text-xs text-neutral-500">
        <div className="flex items-center gap-4">
          <span>{content.split(/\s+/).filter(Boolean).length} words</span>
          <span>{content.length} characters</span>
          <span>{content.split("\n").length} lines</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {artifactType}
          </Badge>
          <span>Markdown</span>
        </div>
      </div>
    </div>
  );
}

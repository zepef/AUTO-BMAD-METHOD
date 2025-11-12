"use client";

import { useState } from "react";
import { ChatContainer } from "@/components/chat/chat-container";
import { AgentSelector } from "@/components/chat/agent-selector";
import { type Message, type Agent } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const MOCK_AGENTS: Agent[] = [
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

const MOCK_RESPONSES: Record<string, string[]> = {
  pm: [
    "Great question! Let me help you create a comprehensive Product Requirements Document (PRD) for your application.\n\nFirst, I'd like to understand a few key things:\n\n1. **What problem are you trying to solve?**\n2. **Who are your target users?**\n3. **What are the key features you envision?**\n\nOnce I have this information, I can help you create a structured PRD with:\n- Executive Summary\n- User Personas\n- Feature Requirements\n- Success Metrics",
    "Based on your input, here's what I recommend:\n\n## Key Features\n\n1. **User Authentication**\n   - Email/password login\n   - Social authentication (Google, GitHub)\n   - Password reset flow\n\n2. **Core Functionality**\n   - Dashboard with key metrics\n   - Data visualization\n   - Export capabilities\n\n3. **Collaboration**\n   - Team invitations\n   - Role-based access control\n   - Real-time updates\n\nWould you like me to elaborate on any of these areas?",
  ],
  architect: [
    "Let me help you design the technical architecture for this system.\n\n## System Architecture Overview\n\n```typescript\n// High-level architecture\ninterface SystemArchitecture {\n  frontend: 'Next.js 14 + React 18 + TypeScript';\n  backend: 'Node.js + Fastify + tRPC';\n  database: 'PostgreSQL + Prisma ORM';\n  caching: 'Redis';\n  deployment: 'Vercel (frontend) + Railway (backend)';\n}\n```\n\n### Key Design Decisions\n\n1. **Monorepo Structure** - Using Turborepo for better code organization\n2. **Type Safety** - End-to-end TypeScript with tRPC\n3. **Scalability** - Horizontal scaling with load balancing\n4. **Security** - JWT authentication, CORS, rate limiting\n\nShall we dive deeper into any specific component?",
  ],
  developer: [
    "I can help you implement that feature! Here's a sample implementation:\n\n```typescript\nimport { useState, useEffect } from 'react';\n\nexport function useDataFetcher<T>(url: string) {\n  const [data, setData] = useState<T | null>(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<Error | null>(null);\n\n  useEffect(() => {\n    async function fetchData() {\n      try {\n        const response = await fetch(url);\n        if (!response.ok) throw new Error('Failed to fetch');\n        const json = await response.json();\n        setData(json);\n      } catch (err) {\n        setError(err as Error);\n      } finally {\n        setLoading(false);\n      }\n    }\n    fetchData();\n  }, [url]);\n\n  return { data, loading, error };\n}\n```\n\nThis hook provides:\n- Type safety with generics\n- Loading and error states\n- Automatic cleanup",
  ],
  designer: [
    "Let me help you create an excellent user experience!\n\n## UX Design Principles\n\n### 1. **User-Centered Design**\n- Focus on user needs first\n- Conduct user research\n- Create user personas\n- Map user journeys\n\n### 2. **Visual Hierarchy**\n- Use size, color, and spacing effectively\n- Guide user attention to important elements\n- Maintain consistency throughout\n\n### 3. **Accessibility**\n- WCAG 2.1 AA compliance\n- Keyboard navigation\n- Screen reader support\n- Color contrast ratios\n\nWould you like me to create wireframes for your app?",
  ],
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState("pm");
  const [isLoading, setIsLoading] = useState(false);
  const [responseIndex, setResponseIndex] = useState<Record<string, number>>(
    {}
  );

  const selectedAgent = MOCK_AGENTS.find((a) => a.id === selectedAgentId);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response after delay
    setTimeout(() => {
      const agentResponses = MOCK_RESPONSES[selectedAgentId] || [
        "I understand. Let me help you with that!",
      ];
      const currentIndex = responseIndex[selectedAgentId] || 0;
      const response = agentResponses[currentIndex % agentResponses.length];

      const agentMessage: Message = {
        id: `msg-${Date.now()}-agent`,
        role: "agent",
        content: response,
        timestamp: new Date(),
        agentName: selectedAgent?.name,
        agentColor: selectedAgent?.color,
      };

      setMessages((prev) => [...prev, agentMessage]);
      setResponseIndex((prev) => ({
        ...prev,
        [selectedAgentId]: currentIndex + 1,
      }));
      setIsLoading(false);
    }, 1500 + Math.random() * 1000);
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
              Chat with specialized AI agents
            </p>
          </div>
          <AgentSelector
            agents={MOCK_AGENTS}
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
        />
      </div>
    </div>
  );
}

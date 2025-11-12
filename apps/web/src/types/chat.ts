export interface Message {
  id: string;
  role: "user" | "agent" | "system";
  content: string;
  timestamp: Date;
  agentName?: string;
  agentColor?: string;
  artifacts?: Artifact[];
  status?: "sending" | "sent" | "error";
}

export interface Artifact {
  id: string;
  type: "prd" | "architecture" | "story" | "epic" | "tech-spec" | "document";
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  color: string;
  description?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

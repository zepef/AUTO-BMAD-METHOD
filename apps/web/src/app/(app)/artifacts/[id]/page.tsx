"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MarkdownEditor } from "@/components/artifacts/markdown-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type ArtifactStatus = "draft" | "in-progress" | "completed";
type ArtifactType = "prd" | "architecture" | "story" | "epic" | "tech-spec" | "document";

interface Artifact {
  id: string;
  type: ArtifactType;
  title: string;
  description: string;
  content: string;
  updatedAt: string;
  status: ArtifactStatus;
}

// Mock data store (in production, this would be an API)
const MOCK_ARTIFACTS = new Map<string, Artifact>([
  [
    "1",
    {
      id: "1",
      type: "prd" as const,
      title: "E-commerce Platform PRD",
      description: "Product requirements for the new e-commerce platform",
      content: `# E-commerce Platform PRD

## 1. Overview
Building a modern e-commerce platform that enables small businesses to sell online with minimal technical knowledge.

## 2. Problem Statement
Small businesses struggle to establish an online presence due to:
- High costs of existing platforms
- Complex setup processes
- Limited customization options
- Poor mobile experience

## 3. Goals & Objectives
- Launch MVP within 3 months
- Onboard 100 businesses in first 6 months
- Achieve 99.9% uptime
- Mobile-first user experience

## 4. User Stories
### Business Owner
As a business owner, I want to create an online store in under 30 minutes so that I can start selling immediately.

### Customer
As a customer, I want to browse products on my phone so that I can shop on the go.

## 5. Requirements
### Functional Requirements
- Product catalog management
- Shopping cart functionality
- Secure payment processing
- Order management system
- Customer accounts
- Inventory tracking

### Non-Functional Requirements
- Page load time < 2 seconds
- PCI DSS compliance
- Support 10,000 concurrent users
- 99.9% uptime SLA

## 6. Success Metrics
- Time to first sale: < 24 hours
- Cart abandonment rate: < 30%
- Mobile conversion rate: > 2%
- Customer satisfaction: > 4.5/5

## 7. Timeline & Milestones
- Phase 1: Core commerce features (Month 1-2)
- Phase 2: Payment integration (Month 2)
- Phase 3: Beta testing (Month 3)
- Phase 4: Public launch (Month 3)

## 8. Dependencies & Risks
### Dependencies
- Payment gateway partnership (Stripe)
- Cloud infrastructure setup (AWS)
- SSL certificate provider

### Risks
- Risk: Payment integration delays
  - Mitigation: Start integration early, have backup provider
- Risk: Scalability issues at launch
  - Mitigation: Load testing, auto-scaling infrastructure
`,
      updatedAt: new Date().toISOString(),
      status: "in-progress" as const,
    },
  ],
  [
    "2",
    {
      id: "2",
      type: "architecture" as const,
      title: "System Architecture",
      description: "Technical architecture and design decisions",
      content: `# System Architecture

## 1. System Overview
Microservices-based architecture for e-commerce platform with separate services for catalog, cart, checkout, and user management.

## 2. Architecture Goals
- Scalability: Handle 10,000+ concurrent users
- Performance: < 2 second page loads
- Security: PCI DSS compliance, data encryption
- Reliability: 99.9% uptime, fault tolerance

## 3. System Components
### Frontend (Next.js)
- Server-side rendering for SEO
- Progressive Web App capabilities
- Real-time updates via WebSocket
- Responsive design system

### API Gateway (Kong)
- Rate limiting
- Authentication/authorization
- Request routing
- API versioning

### Catalog Service (Node.js)
- Product management
- Search and filtering
- Category management
- Image optimization

### Cart Service (Node.js)
- Session management
- Cart persistence
- Price calculations
- Inventory validation

### Checkout Service (Node.js)
- Payment processing
- Order creation
- Email notifications
- Webhook handling

### User Service (Node.js)
- Authentication (JWT)
- Profile management
- Address management
- Order history

## 4. Data Flow
1. User browses products → Frontend fetches from Catalog Service
2. User adds to cart → Cart Service stores in Redis + PostgreSQL
3. User proceeds to checkout → Checkout Service validates with Inventory
4. Payment processed → Stripe webhook triggers order creation
5. Order confirmation → Email Service sends confirmation

## 5. Technology Stack
- Frontend: Next.js 14, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL (primary), Redis (cache)
- Message Queue: RabbitMQ
- Infrastructure: AWS (ECS, RDS, ElastiCache, S3)
- CDN: CloudFront
- Monitoring: DataDog, Sentry

## 6. API Design
### Product Catalog
\`\`\`
GET /api/v1/products
GET /api/v1/products/:id
POST /api/v1/products (admin)
PUT /api/v1/products/:id (admin)
\`\`\`

### Cart Management
\`\`\`
GET /api/v1/cart
POST /api/v1/cart/items
DELETE /api/v1/cart/items/:id
\`\`\`

### Checkout
\`\`\`
POST /api/v1/checkout/session
POST /api/v1/checkout/complete
\`\`\`

## 7. Security Considerations
- Authentication: JWT with refresh tokens
- Authorization: Role-based access control (RBAC)
- Data encryption: TLS 1.3 in transit, AES-256 at rest
- PCI DSS: Stripe handles card data, no storage
- Rate limiting: 100 requests/minute per IP
- OWASP Top 10 mitigation strategies

## 8. Performance & Scalability
- Expected load: 10,000 concurrent users, 1M requests/day
- Caching strategy: Redis for hot data (products, cart)
- Database optimization: Read replicas, connection pooling
- CDN: Static assets and product images on CloudFront
- Auto-scaling: ECS with target tracking on CPU/memory

## 9. Deployment Strategy
- Environment setup: Dev, Staging, Production
- CI/CD pipeline: GitHub Actions → Docker → ECS
- Blue-green deployment for zero downtime
- Rollback plan: Previous Docker image ready to deploy
- Database migrations: Run before deployment with rollback scripts
`,
      updatedAt: new Date().toISOString(),
      status: "completed" as const,
    },
  ],
]);

export default function ArtifactEditorPage() {
  const params = useParams();
  const router = useRouter();
  const artifactId = params.id as string;

  const [artifact, setArtifact] = useState(MOCK_ARTIFACTS.get(artifactId));
  const [title, setTitle] = useState(artifact?.title || "");
  const [description, setDescription] = useState(artifact?.description || "");
  const [status, setStatus] = useState<ArtifactStatus>(artifact?.status || "draft");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (artifact) {
      setTitle(artifact.title);
      setDescription(artifact.description);
      setStatus(artifact.status);
    }
  }, [artifact]);

  const handleSave = (content: string) => {
    if (artifact) {
      const updated = {
        ...artifact,
        title,
        description,
        status,
        content,
        updatedAt: new Date().toISOString(),
      };
      MOCK_ARTIFACTS.set(artifactId, updated);
      setArtifact(updated);
      setHasUnsavedChanges(false);
      alert("Artifact saved successfully!");
    }
  };

  const handleGenerateWithAI = () => {
    alert("AI generation will be implemented with the real AI integration!");
  };

  if (!artifact) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900">Artifact not found</h2>
          <p className="mt-2 text-neutral-600">
            The artifact you're looking for doesn't exist.
          </p>
          <Button className="mt-4" onClick={() => router.push("/chat")}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-neutral-50">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/chat")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="h-6 w-px bg-neutral-200" />

          <div className="flex flex-col gap-1">
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="h-8 border-none px-0 text-lg font-semibold focus-visible:ring-0"
              placeholder="Artifact title"
            />
            <Input
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="h-6 border-none px-0 text-sm text-neutral-600 focus-visible:ring-0"
              placeholder="Brief description"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={status} onValueChange={(v) => {
            setStatus(v as ArtifactStatus);
            setHasUnsavedChanges(true);
          }}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="gap-2"
            onClick={handleGenerateWithAI}
          >
            <Sparkles className="h-4 w-4" />
            Generate with AI
          </Button>

          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-xs">
              Unsaved changes
            </Badge>
          )}
        </div>
      </header>

      {/* Editor */}
      <main className="flex-1 overflow-hidden">
        <MarkdownEditor
          initialContent={artifact.content}
          artifactType={artifact.type}
          onSave={handleSave}
        />
      </main>
    </div>
  );
}

/**
 * Project Templates
 *
 * Pre-configured project templates with default artifacts
 */

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "web" | "mobile" | "enterprise" | "game" | "ai" | "other";
  defaultArtifacts: {
    type: "prd" | "architecture" | "story" | "epic" | "tech-spec" | "document";
    title: string;
    description: string;
    content: string;
    status: "draft" | "in-progress" | "completed" | "archived";
  }[];
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "blank",
    name: "Blank Project",
    description: "Start from scratch with no predefined artifacts",
    icon: "📄",
    category: "other",
    defaultArtifacts: [],
  },
  {
    id: "ecommerce",
    name: "E-commerce Platform",
    description: "Online store with product catalog, cart, and checkout",
    icon: "🛒",
    category: "web",
    defaultArtifacts: [
      {
        type: "prd",
        title: "E-commerce Platform PRD",
        description: "Product requirements for e-commerce platform",
        status: "draft",
        content: `# E-commerce Platform PRD

## 1. Overview
Building an e-commerce platform that enables online selling with product catalog, shopping cart, and checkout functionality.

## 2. Problem Statement
- Businesses need an easy way to sell products online
- Customers want seamless shopping experiences
- Secure payment processing is essential

## 3. Goals & Objectives
- Launch MVP within 3 months
- Support 1,000+ products
- Mobile-first experience
- Secure payment processing

## 4. User Stories

### Customer
- Browse products by category
- Search for specific items
- Add items to cart
- Complete secure checkout
- Track order status

### Business Owner
- Manage product catalog
- Process orders
- View sales analytics
- Manage inventory

## 5. Requirements

### Functional Requirements
- Product catalog with categories
- Shopping cart persistence
- Secure payment processing (Stripe)
- Order management
- Customer accounts
- Inventory tracking
- Email notifications

### Non-Functional Requirements
- Page load time < 2 seconds
- PCI DSS compliance
- 99.9% uptime
- Mobile responsive design

## 6. Success Metrics
- Conversion rate > 2%
- Cart abandonment < 30%
- Average order value > $50
- Customer satisfaction > 4.5/5
`,
      },
      {
        type: "architecture",
        title: "System Architecture",
        description: "Technical architecture and design decisions",
        status: "draft",
        content: `# System Architecture

## 1. System Overview
Modern e-commerce platform built with microservices architecture.

## 2. Technology Stack
- Frontend: Next.js 14, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, tRPC
- Database: PostgreSQL, Redis
- Payments: Stripe
- Hosting: Vercel (frontend), AWS (backend)

## 3. Key Components

### Frontend
- Server-side rendering for SEO
- Progressive Web App (PWA)
- Real-time cart updates
- Responsive design system

### Backend Services
- Product Service: Catalog management
- Cart Service: Session management
- Checkout Service: Payment processing
- Order Service: Order management
- User Service: Authentication

### Infrastructure
- CDN: CloudFront for static assets
- Database: PostgreSQL for transactional data
- Cache: Redis for sessions and frequently accessed data
- File Storage: S3 for product images

## 4. Security
- SSL/TLS encryption
- PCI DSS compliance via Stripe
- JWT authentication
- Rate limiting
- Input validation
`,
      },
    ],
  },
  {
    id: "saas",
    name: "SaaS Application",
    description: "Multi-tenant SaaS platform with subscriptions",
    icon: "💼",
    category: "web",
    defaultArtifacts: [
      {
        type: "prd",
        title: "SaaS Platform PRD",
        description: "Product requirements for SaaS application",
        status: "draft",
        content: `# SaaS Platform PRD

## 1. Overview
Building a multi-tenant SaaS platform with subscription management and team collaboration.

## 2. Problem Statement
- Teams need collaborative tools
- Manual processes are inefficient
- Data silos prevent productivity

## 3. Goals & Objectives
- Launch beta in 6 months
- 100 paying customers in first year
- 99.9% uptime SLA
- Net Promoter Score > 50

## 4. User Stories

### Team Admin
- Create and manage workspace
- Invite team members
- Assign roles and permissions
- Manage subscription
- View usage analytics

### Team Member
- Collaborate on projects
- Share files and resources
- Receive notifications
- Track activity

## 5. Requirements

### Functional Requirements
- Multi-tenant architecture
- Team workspaces
- Role-based access control (RBAC)
- Subscription management (Stripe)
- Real-time collaboration
- Activity tracking
- Email notifications
- RESTful API

### Non-Functional Requirements
- Response time < 200ms
- Support 10,000 concurrent users
- Data encryption at rest and in transit
- GDPR compliance
- SOC 2 compliance

## 6. Success Metrics
- Monthly Recurring Revenue (MRR) growth
- Customer Acquisition Cost (CAC)
- Customer Lifetime Value (LTV)
- Churn rate < 5%
- User engagement rate > 60%
`,
      },
    ],
  },
  {
    id: "mobile-app",
    name: "Mobile Application",
    description: "Cross-platform iOS and Android mobile app",
    icon: "📱",
    category: "mobile",
    defaultArtifacts: [
      {
        type: "prd",
        title: "Mobile App PRD",
        description: "Product requirements for mobile application",
        status: "draft",
        content: `# Mobile Application PRD

## 1. Overview
Building a cross-platform mobile application for iOS and Android.

## 2. Problem Statement
- Users need mobile access to key features
- Native apps are expensive to build twice
- App store distribution is required

## 3. Goals & Objectives
- Launch on both platforms simultaneously
- 10,000 downloads in first month
- 4+ star rating on app stores
- < 3% crash rate

## 4. User Stories

### Mobile User
- Install app from app store
- Sign in with social or email
- Access core features offline
- Receive push notifications
- Sync data across devices

## 5. Requirements

### Functional Requirements
- iOS and Android support
- Offline functionality
- Push notifications
- Social authentication
- Biometric login
- Camera integration
- Location services
- Background sync

### Non-Functional Requirements
- App size < 50MB
- Launch time < 2 seconds
- Battery efficient
- Accessibility (WCAG AA)
- Support iOS 15+ and Android 10+

## 6. Technical Approach
- Framework: React Native or Flutter
- State Management: Redux/MobX
- API: GraphQL or REST
- Analytics: Firebase Analytics
- Crash Reporting: Sentry

## 7. Success Metrics
- Daily Active Users (DAU)
- Session length > 5 minutes
- Retention rate (Day 1, 7, 30)
- App store rating > 4.0
- Crash-free sessions > 99%
`,
      },
    ],
  },
  {
    id: "api",
    name: "API Service",
    description: "RESTful or GraphQL API backend service",
    icon: "🔌",
    category: "web",
    defaultArtifacts: [
      {
        type: "tech-spec",
        title: "API Service Technical Specification",
        description: "Technical design for API service",
        status: "draft",
        content: `# API Service Technical Specification

## 1. Overview
Building a scalable RESTful/GraphQL API service.

## 2. API Design

### REST Endpoints
- \`GET /api/v1/resources\` - List resources
- \`GET /api/v1/resources/:id\` - Get resource
- \`POST /api/v1/resources\` - Create resource
- \`PUT /api/v1/resources/:id\` - Update resource
- \`DELETE /api/v1/resources/:id\` - Delete resource

### Authentication
- JWT-based authentication
- OAuth 2.0 support
- API key authentication
- Rate limiting per client

## 3. Technology Stack
- Runtime: Node.js 20+
- Framework: Express or Fastify
- Language: TypeScript
- Database: PostgreSQL
- Cache: Redis
- Queue: Bull/BullMQ
- Documentation: OpenAPI/Swagger

## 4. Architecture

### Layers
1. **Routes**: HTTP endpoint definitions
2. **Controllers**: Request handling
3. **Services**: Business logic
4. **Repositories**: Data access
5. **Models**: Data structures

### Middleware
- Authentication
- Validation (Zod)
- Error handling
- Logging (Winston)
- Rate limiting
- CORS

## 5. Data Models

### Resource Model
\`\`\`typescript
interface Resource {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}
\`\`\`

## 6. Security
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- XSS protection
- CSRF tokens for state-changing operations
- Rate limiting (100 requests/minute)
- API key rotation

## 7. Performance
- Response caching with Redis
- Database query optimization
- Pagination (limit/offset or cursor-based)
- Gzip compression
- CDN for static assets

## 8. Monitoring & Logging
- Request/response logging
- Error tracking (Sentry)
- Performance monitoring (DataDog)
- Health check endpoint
- Metrics dashboard
`,
      },
    ],
  },
  {
    id: "ai-chatbot",
    name: "AI Chatbot",
    description: "Conversational AI assistant with LLM integration",
    icon: "🤖",
    category: "ai",
    defaultArtifacts: [
      {
        type: "prd",
        title: "AI Chatbot PRD",
        description: "Product requirements for AI chatbot",
        status: "draft",
        content: `# AI Chatbot PRD

## 1. Overview
Building an intelligent chatbot powered by large language models (LLMs).

## 2. Problem Statement
- Customer support is expensive and slow
- Users need 24/7 assistance
- Common questions are repetitive

## 3. Goals & Objectives
- Handle 80% of support inquiries automatically
- Response time < 3 seconds
- 90% user satisfaction rate
- Reduce support costs by 50%

## 4. User Stories

### End User
- Ask questions in natural language
- Get instant, accurate responses
- Escalate to human when needed
- Continue conversations across sessions

### Support Team
- Monitor chatbot performance
- Review conversation logs
- Train bot with new knowledge
- Handle escalations

## 5. Requirements

### Functional Requirements
- Natural language understanding
- Context-aware responses
- Multi-turn conversations
- Knowledge base integration
- Human escalation
- Conversation history
- Multi-language support
- Rich media responses (links, images, buttons)

### Non-Functional Requirements
- Response time < 3 seconds
- 99.9% uptime
- Support 1,000 concurrent chats
- Multilingual (English, Spanish, French)
- GDPR compliant

## 6. Technical Approach
- LLM: OpenAI GPT-4 or Anthropic Claude
- Framework: LangChain or LlamaIndex
- Vector DB: Pinecone or Weaviate
- Backend: Python (FastAPI) or Node.js
- Frontend: React chat widget
- Database: PostgreSQL

## 7. Success Metrics
- Automation rate (% handled without human)
- First response time
- Resolution rate
- User satisfaction (CSAT)
- Escalation rate
`,
      },
      {
        type: "architecture",
        title: "Chatbot Architecture",
        description: "Technical architecture for AI chatbot",
        status: "draft",
        content: `# Chatbot Architecture

## 1. System Components

### Chat Widget (Frontend)
- Embedded JavaScript widget
- React-based UI
- WebSocket for real-time messaging
- Message history
- Rich media support

### Chat API (Backend)
- RESTful API for messages
- WebSocket server
- Session management
- Authentication

### LLM Service
- OpenAI/Anthropic API integration
- Prompt engineering
- Response streaming
- Token management

### Knowledge Base
- Vector database (Pinecone/Weaviate)
- Document embeddings
- Semantic search
- RAG (Retrieval Augmented Generation)

### Analytics
- Conversation tracking
- Performance metrics
- User feedback
- A/B testing

## 2. Data Flow

1. User sends message → Chat Widget
2. Widget → Chat API via WebSocket
3. Chat API → LLM Service
4. LLM Service → Knowledge Base (context retrieval)
5. LLM Service → OpenAI/Claude API
6. Streaming response → User

## 3. Security
- End-to-end encryption
- PII detection and masking
- Rate limiting
- Content moderation
- Audit logging
`,
      },
    ],
  },
  {
    id: "game",
    name: "Game Project",
    description: "Video game with design document template",
    icon: "🎮",
    category: "game",
    defaultArtifacts: [
      {
        type: "document",
        title: "Game Design Document (GDD)",
        description: "Complete game design specification",
        status: "draft",
        content: `# Game Design Document (GDD)

## 1. Game Overview

### Concept
[Brief description of the game concept]

### Genre
[Game genre: Action, RPG, Puzzle, Strategy, etc.]

### Target Audience
- Age: [Age range]
- Platform: [PC, Console, Mobile, etc.]
- Experience: [Casual, Hardcore, etc.]

### Unique Selling Points (USP)
- [What makes this game unique]
- [Key differentiators]

## 2. Gameplay

### Core Mechanics
- [Primary gameplay mechanic]
- [Secondary mechanics]
- [Player actions]

### Game Flow
1. [Tutorial/Introduction]
2. [Main gameplay loop]
3. [Progression]
4. [End game]

### Controls
- [Input methods]
- [Control scheme]

## 3. Story & Setting

### Narrative
[Story synopsis]

### Characters
- **Protagonist**: [Description]
- **Antagonist**: [Description]
- **Supporting Characters**: [List]

### World/Setting
[Description of game world]

## 4. Art & Audio

### Art Style
- Visual style: [2D, 3D, Pixel Art, etc.]
- Color palette: [Description]
- UI/UX design: [Description]

### Audio
- Music: [Style and mood]
- Sound effects: [Categories]
- Voice acting: [If applicable]

## 5. Technical Requirements

### Platform
- Target platforms: [PC, Console, Mobile]
- Minimum specs: [Hardware requirements]

### Engine
- Game engine: [Unity, Unreal, Godot, custom]

### Technology
- Programming languages
- Frameworks and libraries
- Backend services (if multiplayer)

## 6. Monetization (if applicable)
- Business model: [Premium, F2P, Subscription]
- In-app purchases
- Ads strategy

## 7. Milestones
- **Prototype**: [Date]
- **Alpha**: [Date]
- **Beta**: [Date]
- **Release**: [Date]
`,
      },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise System",
    description: "Large-scale enterprise application with compliance",
    icon: "🏢",
    category: "enterprise",
    defaultArtifacts: [
      {
        type: "prd",
        title: "Enterprise System PRD",
        description: "Enterprise application requirements",
        status: "draft",
        content: `# Enterprise System PRD

## 1. Overview
Building an enterprise-grade system with security, compliance, and scalability.

## 2. Problem Statement
- Legacy systems are inefficient
- Data is siloed across departments
- Compliance requirements are complex
- Manual processes slow down operations

## 3. Goals & Objectives
- Consolidate 5+ legacy systems
- Reduce operational costs by 30%
- Achieve SOC 2 Type II certification
- Support 10,000+ concurrent users

## 4. Stakeholders
- **Executive Sponsors**: C-level leadership
- **IT Department**: System administrators
- **Business Users**: End users across departments
- **Compliance Team**: Legal and security
- **External Auditors**: Third-party auditors

## 5. Requirements

### Functional Requirements
- Single Sign-On (SSO)
- Role-based access control (RBAC)
- Audit logging
- Data import/export
- Reporting and analytics
- Workflow automation
- Document management
- Integration with existing systems (SAP, Salesforce, etc.)

### Non-Functional Requirements
- **Security**: SOC 2, ISO 27001, GDPR compliance
- **Performance**: < 1 second response time
- **Scalability**: Support 10,000+ users
- **Availability**: 99.99% uptime SLA
- **Disaster Recovery**: RPO < 1 hour, RTO < 4 hours
- **Accessibility**: WCAG 2.1 AA compliance

## 6. Compliance & Security
- Data encryption at rest (AES-256)
- Data encryption in transit (TLS 1.3)
- Multi-factor authentication (MFA)
- Regular penetration testing
- Security awareness training
- Incident response plan
- Data retention policies
- GDPR right to be forgotten

## 7. Integration Requirements
- REST API for external systems
- SAML 2.0 for SSO
- LDAP/Active Directory integration
- Webhook support for events
- Bulk data import/export (CSV, Excel)

## 8. Success Metrics
- System adoption rate > 90%
- User productivity improvement > 25%
- Reduction in manual errors > 50%
- Time to complete workflows reduced by 40%
- Compliance audit pass rate 100%
`,
      },
      {
        type: "architecture",
        title: "Enterprise Architecture",
        description: "Technical architecture for enterprise system",
        status: "draft",
        content: `# Enterprise Architecture

## 1. Architecture Overview
Microservices-based architecture with high availability and disaster recovery.

## 2. Technology Stack
- **Frontend**: React, TypeScript, Material-UI
- **Backend**: Java Spring Boot or .NET Core
- **Database**: PostgreSQL (primary), MongoDB (documents)
- **Cache**: Redis Cluster
- **Message Queue**: RabbitMQ or Apache Kafka
- **Search**: Elasticsearch
- **API Gateway**: Kong or AWS API Gateway
- **Container**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: Jenkins or GitLab CI
- **Monitoring**: Prometheus, Grafana, ELK Stack

## 3. Architecture Patterns

### Microservices
- User Service
- Auth Service
- Workflow Service
- Document Service
- Integration Service
- Reporting Service
- Notification Service

### Data Architecture
- Event-driven architecture (EDA)
- CQRS (Command Query Responsibility Segregation)
- Event sourcing for audit trail
- Database per service

### Security Architecture
- Zero Trust Network
- API Gateway for authentication
- Service mesh (Istio) for inter-service communication
- Secrets management (HashiCorp Vault)

## 4. High Availability
- Multi-region deployment
- Load balancing (AWS ALB)
- Auto-scaling based on metrics
- Database replication (master-slave)
- Redis clustering
- Blue-green deployment

## 5. Disaster Recovery
- Automated backups (hourly incremental, daily full)
- Cross-region replication
- Recovery Time Objective (RTO): 4 hours
- Recovery Point Objective (RPO): 1 hour
- Disaster recovery drills (quarterly)

## 6. Monitoring & Observability
- Application Performance Monitoring (APM)
- Log aggregation (ELK Stack)
- Distributed tracing (Jaeger)
- Real-time alerts (PagerDuty)
- SLA dashboards

## 7. Compliance
- Audit logging of all actions
- Encryption key management
- Data masking for PII
- Access control policies
- Regular security scans (SAST, DAST)
`,
      },
    ],
  },
];

export function getTemplateById(id: string): ProjectTemplate | undefined {
  return PROJECT_TEMPLATES.find((template) => template.id === id);
}

export function getTemplatesByCategory(
  category: ProjectTemplate["category"]
): ProjectTemplate[] {
  return PROJECT_TEMPLATES.filter((template) => template.category === category);
}

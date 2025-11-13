/**
 * Database Seed Script
 *
 * Populates the database with initial data for development
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: "demo@flowforge.dev" },
    update: {},
    create: {
      email: "demo@flowforge.dev",
      name: "Demo User",
    },
  });

  console.log(`✓ Created user: ${user.email}`);

  // Create demo project
  const project = await prisma.project.upsert({
    where: { id: "demo-project-1" },
    update: {},
    create: {
      id: "demo-project-1",
      name: "E-commerce Platform",
      description: "Building a modern e-commerce platform for small businesses",
      status: "active",
      userId: user.id,
    },
  });

  console.log(`✓ Created project: ${project.name}`);

  // Create example PRD artifact
  await prisma.artifact.upsert({
    where: { id: "artifact-prd-1" },
    update: {},
    create: {
      id: "artifact-prd-1",
      type: "prd",
      title: "E-commerce Platform PRD",
      description: "Product requirements for the new e-commerce platform",
      status: "in-progress",
      userId: user.id,
      projectId: project.id,
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
    },
  });

  console.log(`✓ Created artifact: E-commerce Platform PRD`);

  // Create example Architecture artifact
  await prisma.artifact.upsert({
    where: { id: "artifact-arch-1" },
    update: {},
    create: {
      id: "artifact-arch-1",
      type: "architecture",
      title: "System Architecture",
      description: "Technical architecture and design decisions",
      status: "completed",
      userId: user.id,
      projectId: project.id,
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

### Services
- Catalog Service: Product management, search
- Cart Service: Session management, persistence
- Checkout Service: Payment processing, orders
- User Service: Authentication, profiles

## 4. Technology Stack
- Frontend: Next.js 14, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL (primary), Redis (cache)
- Message Queue: RabbitMQ
- Infrastructure: AWS (ECS, RDS, ElastiCache, S3)
- CDN: CloudFront
- Monitoring: DataDog, Sentry

## 5. Security Considerations
- Authentication: JWT with refresh tokens
- Authorization: Role-based access control (RBAC)
- Data encryption: TLS 1.3 in transit, AES-256 at rest
- PCI DSS: Stripe handles card data
- Rate limiting: 100 requests/minute per IP
`,
    },
  });

  console.log(`✓ Created artifact: System Architecture`);

  // Create example Story artifact
  await prisma.artifact.upsert({
    where: { id: "artifact-story-1" },
    update: {},
    create: {
      id: "artifact-story-1",
      type: "story",
      title: "User Authentication Story",
      description: "Implement email/password authentication",
      status: "draft",
      userId: user.id,
      projectId: project.id,
      content: `# User Story: Email/Password Authentication

## Story
As a business owner, I want to create an account with email and password so that I can access my store dashboard securely.

## Acceptance Criteria
- [ ] User can register with email and password
- [ ] Password must be at least 8 characters
- [ ] User receives confirmation email
- [ ] User can log in with credentials
- [ ] User can reset forgotten password
- [ ] Session persists for 7 days

## Technical Notes
- Use bcrypt for password hashing
- JWT tokens for session management
- Email service: SendGrid
- Rate limiting on auth endpoints

## Testing Strategy
- Unit tests for password validation
- Integration tests for registration flow
- E2E tests for complete auth journey
`,
    },
  });

  console.log(`✓ Created artifact: User Authentication Story`);

  // Create additional projects
  const project2 = await prisma.project.create({
    data: {
      name: "Mobile App Redesign",
      description: "Complete UX overhaul for iOS and Android applications",
      status: "active",
      userId: user.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: "API Gateway Service",
      description: "Microservices architecture with API gateway pattern",
      status: "completed",
      userId: user.id,
    },
  });

  console.log(`✓ Created additional projects`);

  // Create chat sessions
  const chatSession1 = await prisma.chatSession.create({
    data: {
      title: "Product Requirements Discussion",
      userId: user.id,
      projectId: project.id,
    },
  });

  const chatSession2 = await prisma.chatSession.create({
    data: {
      title: "Architecture Review and Planning",
      userId: user.id,
      projectId: project.id,
    },
  });

  const chatSession3 = await prisma.chatSession.create({
    data: {
      title: "Mobile App Design Brainstorming",
      userId: user.id,
      projectId: project2.id,
    },
  });

  console.log(`✓ Created chat sessions`);

  // Create messages for chat session 1
  await prisma.message.createMany({
    data: [
      {
        role: "user",
        content: "I need help defining the requirements for an e-commerce platform. Where should we start?",
        userId: user.id,
        sessionId: chatSession1.id,
      },
      {
        role: "assistant",
        content: "Great! Let's start by understanding your target audience and business goals. An e-commerce platform typically serves two main user types: business owners (who manage products and orders) and customers (who browse and purchase). What's your primary business objective?",
        userId: user.id,
        sessionId: chatSession1.id,
        agentId: "pm",
      },
      {
        role: "user",
        content: "We want to help small businesses get online quickly without technical knowledge. The main goal is to onboard 100 businesses in the first 6 months.",
        userId: user.id,
        sessionId: chatSession1.id,
      },
      {
        role: "assistant",
        content: "Perfect! That's a clear objective. For small businesses with limited technical knowledge, we should focus on: 1) Quick setup process (< 30 minutes to launch), 2) Pre-built templates, 3) Simple product management, 4) Integrated payment processing. Let me help you structure this into a comprehensive PRD with user stories, requirements, and success metrics.",
        userId: user.id,
        sessionId: chatSession1.id,
        agentId: "pm",
      },
    ],
  });

  // Create messages for chat session 2
  await prisma.message.createMany({
    data: [
      {
        role: "user",
        content: "What architecture pattern would you recommend for an e-commerce platform that needs to handle 10,000 concurrent users?",
        userId: user.id,
        sessionId: chatSession2.id,
      },
      {
        role: "assistant",
        content: "For that scale, I'd recommend a microservices architecture. Here's why: 1) Scalability: Each service can scale independently based on demand, 2) Fault isolation: If one service fails, others continue working, 3) Technology flexibility: Use the best tool for each service. For e-commerce, I'd suggest these core services: Catalog Service, Cart Service, Checkout Service, and User Service.",
        userId: user.id,
        sessionId: chatSession2.id,
        agentId: "architect",
      },
      {
        role: "user",
        content: "That makes sense. What about the technology stack?",
        userId: user.id,
        sessionId: chatSession2.id,
      },
      {
        role: "assistant",
        content: "I'd recommend: Frontend: Next.js 14 with React and TypeScript for SEO and performance. Backend: Node.js with Express for API services. Database: PostgreSQL for transactional data, Redis for caching. Message Queue: RabbitMQ for async processing. Infrastructure: AWS with ECS for container orchestration. This stack provides excellent performance, scalability, and developer experience.",
        userId: user.id,
        sessionId: chatSession2.id,
        agentId: "architect",
      },
    ],
  });

  console.log(`✓ Created chat messages`);

  // Create additional artifacts for other projects
  await prisma.artifact.create({
    data: {
      type: "document",
      title: "Mobile App User Research",
      description: "User interview findings and insights",
      status: "completed",
      userId: user.id,
      projectId: project2.id,
      content: `# Mobile App User Research

## Research Goals
Understand pain points in the current mobile experience and identify opportunities for improvement.

## Methodology
- 15 user interviews
- 100 survey responses
- App analytics review

## Key Findings
1. Navigation is confusing (73% of users struggled)
2. Search functionality is hard to find
3. Users want dark mode
4. Performance issues on older devices

## Recommendations
- Redesign navigation with bottom tabs
- Add prominent search bar
- Implement dark mode
- Optimize images and reduce bundle size
`,
    },
  });

  console.log(`✓ Created additional artifacts`);

  // Create agent configs
  const agentConfigs = [
    { agentId: "pm", model: "gpt-4-turbo-preview", temperature: 0.7 },
    { agentId: "architect", model: "gpt-4-turbo-preview", temperature: 0.5 },
    { agentId: "developer", model: "gpt-4-turbo-preview", temperature: 0.4 },
    { agentId: "designer", model: "claude-3-opus-20240229", temperature: 0.8 },
  ];

  for (const config of agentConfigs) {
    await prisma.agentConfig.upsert({
      where: { agentId: config.agentId },
      update: {},
      create: config,
    });
    console.log(`✓ Created agent config: ${config.agentId}`);
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

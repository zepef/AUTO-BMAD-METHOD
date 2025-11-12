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

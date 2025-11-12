# Backend Integration Setup

Complete setup guide for Prisma + tRPC backend integration in FlowForge.

## Overview

FlowForge uses a modern, type-safe backend stack:

- **Prisma** - Type-safe database ORM
- **tRPC** - End-to-end type-safe API
- **React Query** - Data fetching and caching
- **Zod** - Runtime validation
- **SQLite** - Development database (easily switchable to PostgreSQL)

## Quick Start

### 1. Environment Setup

Create `.env` file in `apps/web/`:

```env
DATABASE_URL="file:./dev.db"
```

### 2. Initialize Database

```bash
cd apps/web

# Generate Prisma Client
pnpm db:generate

# Push schema to database (creates tables)
pnpm db:push

# (Optional) Open Prisma Studio to view/edit data
pnpm db:studio
```

### 3. Start Development

```bash
pnpm dev
```

The backend is now ready! tRPC automatically handles:

- Type generation from server to client
- Request validation with Zod
- Error handling
- Data serialization with SuperJSON

## Database Schema

### Models

**User**

- id, email, name, timestamps
- Relations: projects, artifacts, messages

**Project**

- id, name, description, status, timestamps
- Relations: user, artifacts, messages

**Artifact** (PRDs, Architecture docs, Stories, etc.)

- id, type, title, description, content, status, timestamps
- Types: prd, architecture, story, epic, tech-spec, document
- Status: draft, in-progress, completed
- Relations: user, project

**Message** (Chat history)

- id, role, content, agentId, timestamp
- Relations: user, project

**AgentConfig** (Agent preferences)

- id, agentId, provider, model, temperature, enabled

## tRPC API

### Server-Side (Creating APIs)

Location: `src/server/routers/`

Example router:

```typescript
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const exampleRouter = createTRPCRouter({
  // Query (read data)
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.example.findMany();
  }),

  // Mutation (write data)
  create: publicProcedure.input(z.object({ name: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.example.create({
      data: input,
    });
  }),
});
```

Add to `src/server/routers/_app.ts`:

```typescript
export const appRouter = createTRPCRouter({
  artifact: artifactRouter,
  example: exampleRouter, // <-- Add here
});
```

### Client-Side (Using APIs)

In React components:

```typescript
import { trpc } from "@/lib/trpc/client";

function MyComponent() {
  // Query
  const { data, isLoading, error } = trpc.artifact.list.useQuery({
    type: "prd",
    limit: 10,
  });

  // Mutation
  const createArtifact = trpc.artifact.create.useMutation({
    onSuccess: () => {
      // Refresh data
      utils.artifact.list.invalidate();
    },
  });

  const handleCreate = () => {
    createArtifact.mutate({
      type: "prd",
      title: "New PRD",
      content: "# PRD Content",
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.artifacts.map((artifact) => (
        <div key={artifact.id}>{artifact.title}</div>
      ))}
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}
```

## Artifact API Reference

### Queries

**`artifact.list`**

- Lists artifacts with optional filtering
- Input: `{ projectId?, type?, limit?, cursor? }`
- Returns: `{ artifacts, nextCursor }`

**`artifact.getById`**

- Gets single artifact with related data
- Input: `{ id: string }`
- Returns: `Artifact with user and project`

**`artifact.stats`**

- Gets artifact statistics
- Input: none
- Returns: `{ total, byType, byStatus }`

### Mutations

**`artifact.create`**

- Creates new artifact
- Input: `{ type, title, description?, content?, status?, projectId? }`
- Returns: `Created artifact`

**`artifact.update`**

- Updates existing artifact
- Input: `{ id, title?, description?, content?, status?, type? }`
- Returns: `Updated artifact`

**`artifact.delete`**

- Deletes artifact
- Input: `{ id: string }`
- Returns: `Deleted artifact`

## Database Management

### Common Commands

```bash
# Generate Prisma Client (after schema changes)
pnpm db:generate

# Push schema changes to database (no migrations)
pnpm db:push

# Create and run migrations (for production)
pnpm db:migrate

# Open Prisma Studio (visual database editor)
pnpm db:studio

# Seed database with initial data
pnpm db:seed
```

### Schema Changes

1. Edit `prisma/schema.prisma`
2. Run `pnpm db:generate` to update Prisma Client
3. Run `pnpm db:push` to apply changes to database

### Production Deployment

For production, switch to PostgreSQL:

1. Update `DATABASE_URL` in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/flowforge"
```

2. Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql" // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

3. Run migrations:

```bash
pnpm db:migrate
```

## Type Safety

tRPC provides full type safety:

```typescript
// ✅ TypeScript knows the return type
const { data } = trpc.artifact.list.useQuery({ type: 'prd' });
//     ^? { artifacts: Artifact[], nextCursor?: string }

// ✅ Input validation
createArtifact.mutate({
  type: 'invalid', // ❌ Error: Type must be one of the enum values
  title: '', // ❌ Error: Title must be at least 1 character
});
```

## Error Handling

```typescript
const { error } = trpc.artifact.getById.useQuery({ id: '123' });

if (error) {
  // Zod validation errors
  if (error.data?.zodError) {
    console.error('Validation errors:', error.data.zodError);
  }

  // General error message
  console.error('Error:', error.message);
}
```

## Best Practices

1. **Use transactions for complex operations**

```typescript
await ctx.prisma.$transaction(async (tx) => {
  const artifact = await tx.artifact.create({ ... });
  await tx.message.create({ ... });
  return artifact;
});
```

2. **Optimize queries with select/include**

```typescript
await ctx.prisma.artifact.findMany({
  select: { id: true, title: true }, // Only fetch needed fields
  include: { user: true }, // Include related data
});
```

3. **Use cursor-based pagination for large lists**

```typescript
const { data } = trpc.artifact.list.useQuery({
  limit: 20,
  cursor: lastArtifactId,
});
```

4. **Invalidate queries after mutations**

```typescript
const utils = trpc.useUtils();

createArtifact.mutate(data, {
  onSuccess: () => {
    utils.artifact.list.invalidate(); // Refresh list
  },
});
```

## Authentication (Future)

Authentication will be added with:

- NextAuth.js for session management
- Protected procedures with middleware
- User context in tRPC

Example (to be implemented):

```typescript
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { user: ctx.user } });
});
```

## Troubleshooting

### Prisma Client not generated

```bash
pnpm db:generate
```

### Type errors after schema changes

1. Run `pnpm db:generate`
2. Restart TypeScript server in your IDE

### Database locked error (SQLite)

- Close Prisma Studio if open
- Restart dev server

### tRPC endpoint not found

- Check that `TRPCProvider` wraps your app in `layout.tsx`
- Verify API route exists at `app/api/trpc/[trpc]/route.ts`

## Next Steps

- [ ] Add user authentication
- [ ] Implement project CRUD
- [ ] Add message/chat history storage
- [ ] Set up real-time subscriptions
- [ ] Add file upload for artifacts
- [ ] Implement collaborative editing

## Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [tRPC Docs](https://trpc.io/docs)
- [React Query Docs](https://tanstack.com/query/latest/docs/react)
- [Zod Docs](https://zod.dev/)

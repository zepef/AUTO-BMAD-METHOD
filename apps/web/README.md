# FlowForge - AI-Driven Product Development Platform

FlowForge is a modern web application that streamlines product development through AI-powered workflows, collaborative chat sessions, and intelligent artifact generation.

## Features

### Core Features

- **AI Chat Workspace** - Real-time chat with specialized AI agents (PM, Architect, Developer, Designer)
- **Projects Management** - Organize work with projects, artifacts, and chat sessions
- **Artifact Generation** - Automatically create PRDs, architecture docs, user stories, and more from conversations
- **Dashboard** - Unified view of all projects, artifacts, and chat sessions

### Secondary Features

- **Global Search (Cmd+K)** - Instant search across projects, artifacts, and conversations
- **Chat History** - Persistent chat sessions with project linking and filtering
- **Project Linking** - Connect chat sessions to specific projects for better organization
- **Markdown Editor** - Rich text editing for all artifacts with preview support

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: tRPC v11 for type-safe APIs
- **Database**: Prisma v6 with SQLite (development) / PostgreSQL (production)
- **UI Components**: shadcn/ui, Radix UI primitives
- **AI Integration**: OpenAI GPT-4 (streaming chat responses)
- **State Management**: React Query (TanStack Query v5)

## Prerequisites

- **Node.js**: v20.0.0 or higher ([Download](https://nodejs.org))
- **npm**: v10.0.0 or higher (included with Node.js)

## Getting Started

### 1. Installation

```bash
# Navigate to the web app directory
cd apps/web

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env` file in the `apps/web` directory with the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# OpenAI API Configuration
OPENAI_API_KEY="your-openai-api-key-here"
OPENAI_MODEL="gpt-4-turbo-preview"

# Application URL (for development)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Important**: Replace `your-openai-api-key-here` with your actual OpenAI API key. Get one at [platform.openai.com](https://platform.openai.com).

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:push

# Seed the database with sample data
npm run db:seed
```

The seed script will create:

- Demo user account
- 3 sample projects (E-commerce Platform, Mobile App Redesign, API Gateway Service)
- 4 sample artifacts (PRDs, Architecture docs, User Stories)
- 3 chat sessions with realistic conversations
- Agent configurations for PM, Architect, Developer, and Designer

### 4. Run Development Server

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see FlowForge running!

## Available Scripts

### Development

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

### Database

- `npm run db:generate` - Generate Prisma client from schema
- `npm run db:push` - Push schema changes to database (development)
- `npm run db:migrate` - Create and run migrations (production)
- `npm run db:seed` - Populate database with sample data
- `npm run db:studio` - Open Prisma Studio (visual database editor)

### Type Checking

- `npm run type-check` - Check TypeScript types without emitting files

## Project Structure

```
apps/web/
├── prisma/
│   ├── schema.prisma      # Database schema definition
│   └── seed.ts            # Database seed script
├── public/                # Static assets
├── src/
│   ├── app/              # Next.js 14 App Router pages
│   │   ├── (app)/        # Main application routes
│   │   │   ├── page.tsx  # Dashboard homepage
│   │   │   ├── chat/     # Chat workspace
│   │   │   ├── projects/ # Projects management
│   │   │   └── artifacts/# Artifacts editor
│   │   └── api/          # API routes
│   │       └── chat/     # Streaming chat endpoint
│   ├── components/       # React components
│   │   ├── chat/         # Chat-related components
│   │   ├── layout/       # Layout components
│   │   ├── projects/     # Project components
│   │   └── ui/           # shadcn/ui components
│   ├── lib/              # Utility libraries
│   │   ├── trpc/         # tRPC client and server setup
│   │   └── utils.ts      # Helper functions
│   ├── server/           # Backend code
│   │   ├── routers/      # tRPC routers (API endpoints)
│   │   └── trpc.ts       # tRPC configuration
│   ├── styles/           # Global styles
│   └── types/            # TypeScript type definitions
├── .env                  # Environment variables (create this)
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Key Concepts

### tRPC Routes

FlowForge uses tRPC for type-safe API endpoints:

- **`/api/trpc/project.*`** - Projects CRUD operations
- **`/api/trpc/artifact.*`** - Artifacts management
- **`/api/trpc/chat.*`** - Chat sessions and messages
- **`/api/chat`** - Streaming AI chat endpoint

### Database Models

Main Prisma models:

- **User** - User accounts (demo user for now)
- **Project** - Projects with name, description, status
- **Artifact** - Documents (PRD, Architecture, Story, etc.) linked to projects
- **ChatSession** - Chat conversations linked to projects
- **Message** - Individual chat messages with role and agent info
- **AgentConfig** - AI agent configurations (model, temperature)

### AI Agents

FlowForge includes 4 specialized AI agents:

1. **John (PM)** - Product Manager - Helps define requirements and user stories
2. **Sarah (Architect)** - Technical Architect - Designs system architecture
3. **Mike (Developer)** - Senior Developer - Implements features and writes code
4. **Emma (Designer)** - UX Designer - Creates user experiences

Each agent has unique personality, expertise, and speaking style.

## Common Tasks

### Adding a New Project

1. Navigate to Projects page
2. Click "New Project" button
3. Fill in project details (name, description, status)
4. Click "Create Project"

### Starting a Chat Session

1. Navigate to Chat page
2. Click "New" to start a fresh session
3. Select an AI agent from the dropdown
4. (Optional) Link to a project
5. Start chatting!

### Generating an Artifact from Chat

1. Have a conversation with an AI agent
2. Click "Generate Artifact" button in chat header
3. Choose artifact type (PRD, Architecture, Story, etc.)
4. Add title and description
5. Click "Generate Artifact"
6. The artifact will be created with your full conversation history

### Using Global Search

1. Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)
2. Type your search query
3. Use arrow keys to navigate results
4. Press Enter to open the selected item

## Troubleshooting

### Database Issues

**Problem**: "Database not found" or "Schema out of sync"

```bash
# Reset and regenerate the database
npm run db:generate
npm run db:push
npm run db:seed
```

### OpenAI API Errors

**Problem**: Chat responses failing

- Check your `.env` file has a valid `OPENAI_API_KEY`
- Verify your OpenAI account has credits available
- Check the model name is correct (`gpt-4-turbo-preview`)

### Port Already in Use

**Problem**: Port 3000 is already in use

```bash
# Run on a different port
PORT=3001 npm run dev
```

### TypeScript Errors

**Problem**: Type errors after pulling changes

```bash
# Regenerate Prisma client types
npm run db:generate

# Check for type errors
npm run type-check
```

## Production Deployment

### Database Migration

For production, use PostgreSQL and proper migrations:

```bash
# Update DATABASE_URL in .env to PostgreSQL connection string
# Create and apply migrations
npm run db:migrate

# Deploy migrations
npx prisma migrate deploy
```

### Build and Deploy

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Environment Variables

Required for production:

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4-turbo-preview"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NODE_ENV="production"
```

## Development Tips

### Keyboard Shortcuts

- `Cmd+K` / `Ctrl+K` - Open global search
- Standard text editing shortcuts work in markdown editor

### Database Inspection

Use Prisma Studio to visually inspect and edit database:

```bash
npm run db:studio
```

Opens at [http://localhost:5555](http://localhost:5555)

### Hot Reload

Development server automatically reloads when you:

- Edit React components
- Modify tRPC routes
- Update styles

No need to restart the server!

### Debugging

Enable verbose logging:

```env
# Add to .env for detailed logs
DEBUG="trpc:*"
```

## Contributing

When contributing to FlowForge:

1. Create a new branch for your feature
2. Run tests and type checks before committing
3. Follow existing code style and patterns
4. Update documentation for new features
5. Submit a pull request with clear description

## License

MIT License - See [LICENSE](../../LICENSE) for details

---

**Need Help?**

- 🐛 Report bugs in [GitHub Issues](https://github.com/bmad-code-org/BMAD-METHOD/issues)
- 💬 Join our [Discord Community](https://discord.gg/gk8jAdXWmj)
- 📧 Contact: support@flowforge.dev (placeholder)

Built with ❤️ using Next.js, tRPC, and Prisma

# BMad Method - Frequently Asked Questions (FAQ)

## Table of Contents

- [General Questions](#general-questions)
- [Installation & Setup](#installation--setup)
- [Working with Agents](#working-with-agents)
- [Workflows & Execution](#workflows--execution)
- [Configuration & Customization](#configuration--customization)
- [Troubleshooting](#troubleshooting)
- [Development & Best Practices](#development--best-practices)

---

## General Questions

### What is BMad Method?

BMad Method is a comprehensive AI-driven agile development framework built on BMad-CORE (Collaboration Optimized Reflection Engine). It provides specialized AI agents and guided workflows to help teams build software more effectively through human-AI collaboration.

### What's the difference between BMad Core, BMad Method, and BMad Builder?

- **BMad Core**: The foundation framework providing agent orchestration, workflow engine, and modular architecture
- **BMad Method (BMM)**: The flagship module for software and game development with 12 specialized agents and 34 workflows
- **BMad Builder (BMB)**: A meta-framework for creating your own custom agents, workflows, and modules
- **Creative Intelligence Suite (CIS)**: Innovation and brainstorming workflows using proven creative methodologies

### Is BMad Method free?

Yes! BMad Method is open source under the MIT License. You're free to use, modify, and distribute it.

### Which IDEs are supported?

BMad Method supports 17+ IDEs including:

- Claude Code (recommended)
- Cursor
- Windsurf
- VS Code with various AI extensions
- GitHub Copilot Chat
- And many more - see [docs/ide-info/](./ide-info/) for the complete list

### What's the difference between v4 and v6?

v6 is a complete rewrite with major improvements:

- Scale-adaptive planning tracks (Quick Flow, BMad Method, Enterprise)
- Update-safe customization system
- Multi-language support
- Story-centric implementation with just-in-time context
- Document sharding for 90% token savings
- Party mode for multi-agent collaboration

See the [v4 to v6 Upgrade Guide](./v4-to-v6-upgrade.md) for details.

---

## Installation & Setup

### How do I install BMad Method?

```bash
# v6 Alpha (recommended for new projects)
npx bmad-method@alpha install

# Stable v4
npx bmad-method install
```

### Installation failed - what should I do?

1. **Check Node.js version**: Ensure you have Node.js 20+ installed (`node --version`)
2. **Check permissions**: Make sure you have write access to the project directory
3. **Try with --reset-config**: `npx bmad-method@alpha install --reset-config`
4. **Check the logs**: Look for specific error messages that indicate the problem
5. **Ask for help**: Join our [Discord](https://discord.gg/gk8jAdXWmj) #bugs-issues channel

### Can I install BMad Method in an existing project?

Yes! BMad Method works with both greenfield (new) and brownfield (existing) projects. For existing codebases, follow the [Brownfield Guide](../src/modules/bmm/docs/brownfield-guide.md).

### What folder structure does BMad Method create?

```
your-project/
└── .bmad/              # or your custom folder name
    ├── core/           # Core framework + BMad Master
    ├── bmm/            # BMad Method module (optional)
    ├── bmb/            # BMad Builder module (optional)
    ├── cis/            # Creative Intelligence Suite (optional)
    └── _cfg/           # Your customizations (survives updates)
```

### Can I change the installation folder name?

Yes! During installation, you'll be prompted for the folder name. The default is `.bmad`, but you can use any name like `bmad`, `.ai`, `agents`, etc.

### How do I update BMad Method?

```bash
npx bmad-method@alpha update
```

Your customizations in `_cfg/` will be preserved.

### How do I uninstall BMad Method?

```bash
npx bmad-method@alpha uninstall
```

Or manually delete the `.bmad/` folder (or whatever you named it).

---

## Working with Agents

### How do I load an agent?

Agent loading is IDE-specific. See your IDE's guide in [docs/ide-info/](./ide-info/). Generally:

1. Open your project in the IDE
2. Load the agent file (e.g., `.bmad/bmm/agents/pm.md`)
3. Start a new chat with the agent

### Why isn't my agent loading?

Common causes:

- **Wrong file location**: Make sure you're loading from `.bmad/[module]/agents/`
- **Installation incomplete**: Run `npx bmad-method@alpha status` to verify
- **IDE not configured**: Check your IDE-specific setup in [docs/ide-info/](./ide-info/)
- **Permissions issue**: Ensure the files are readable

### Can I use multiple agents at once?

Yes! Use **Party Mode**: `/bmad:core:workflows:party-mode`

This starts a multi-agent collaboration where all installed agents contribute their expertise.

### How do I customize an agent?

Create a customization file in `.bmad/_cfg/agents/[agent-name].yaml`:

```yaml
name: 'Custom Name'
role: 'Custom Role'
persona: 'Custom personality description...'
communication_language: 'English'
```

See your agent's documentation for available customization options.

### Can agents access my entire codebase?

Agents only see what's in their current context window. For brownfield projects, run the `document-project` workflow first to create reference documentation.

---

## Workflows & Execution

### What are the three planning tracks?

1. **Quick Flow Track**: Bug fixes, small features (tech-spec only) - fastest path
2. **BMad Method Track**: Products, platforms, complex features (PRD + Architecture + UX)
3. **Enterprise Method Track**: Enterprise systems with extended planning (Security/DevOps/Test) - coming soon

Not sure which? Run `*workflow-init` for guidance.

### How do I execute a workflow?

Three ways:

**Method 1: Agent Menu** (Recommended for beginners)

1. Load an agent
2. Tell the agent what to run: `*workflow-init` or "Run workflow-init"

**Method 2: Direct Slash Commands**

```
/bmad:bmm:workflows:workflow-init
/bmad:bmm:workflows:prd
```

**Method 3: Party Mode**

```
/bmad:core:workflows:party-mode
```

Then execute any workflow with multi-agent collaboration.

### What does "fresh chat" mean?

Starting a fresh chat means opening a new conversation with the agent. This prevents context window limitations and ensures the agent has maximum available tokens for the workflow.

### Do I need to follow all phases?

It depends on your planning track:

- **Quick Flow**: Phase 2 (tech-spec) → Phase 4 (implementation)
- **BMad Method**: Phase 1 (optional) → Phase 2 (PRD) → Phase 3 (architecture) → Phase 4 (stories)
- **Enterprise Method**: All phases including extended planning

### Can I skip workflows?

Not recommended! Each workflow builds context for the next. Skipping workflows may result in incomplete documentation or missing requirements.

### What is \*workflow-init?

`*workflow-init` is a guided setup workflow that:

1. Analyzes your project goal
2. Recommends the appropriate planning track
3. Sets up your workflow path
4. Creates initial tracking files

Always start here for new projects!

### What is workflow-status?

`*workflow-status` tells you what to do next based on your current progress. It reads your workflow tracking files and recommends the next step.

---

## Configuration & Customization

### Where are configuration files stored?

- **Core config**: `.bmad/core/config.yaml`
- **Module configs**: `.bmad/[module]/config.yaml`
- **Your customizations**: `.bmad/_cfg/` (survives updates)

### How does configuration inheritance work?

Configuration resolves in this order:

1. Core config (user name, languages, output folder)
2. Module configs (inherit from core, add module-specific)
3. Workflow configs (inherit from module, add workflow-specific)
4. Runtime prompts (fill in any remaining unknowns)

### Can I change output folders after installation?

Yes! Edit `.bmad/core/config.yaml` and update the `output_folder` setting. Some workflows may also prompt you to override the location.

### How do I enable game development agents?

During BMM installation, answer "Yes" when asked about game development. This installs additional agents: Game Designer, Game Developer, Game Architect, Game Scrum Master.

### What is document sharding?

An advanced optimization that splits large documents (PRD, Architecture, etc.) into smaller files organized by sections. This enables Phase 4 workflows to load only needed sections, saving 90%+ tokens.

See the [Document Sharding Guide](./document-sharding-guide.md) for details.

---

## Troubleshooting

### Agent says "workflow not found" or "workflow is todo"

The workflow hasn't been implemented yet. Check the agent's menu for available workflows, or see the module's workflow documentation.

### Variables like {project_name} aren't resolving

1. Check that installation completed successfully: `npx bmad-method@alpha status`
2. Verify config files exist in `.bmad/[module]/config.yaml`
3. Try running `*workflow-init` to set up tracking files
4. If still broken, reinstall: `npx bmad-method@alpha install --reset-config`

### Workflow is stuck or not progressing

1. Ensure you're in a **fresh chat** (context window may be full)
2. Check that prerequisite workflows have been completed
3. Run `*workflow-status` to see what's needed
4. Verify input files exist (e.g., PRD.md for architecture workflow)

### "Cannot find module" errors during npm test

Run `npm install` first! This installs all dependencies needed for development.

### Slash commands don't work in my IDE

Slash command syntax varies by IDE. Check your IDE's guide in [docs/ide-info/](./ide-info/) for the correct format.

### Installation says "v4 detected" but I want v6

BMad v6 can detect and upgrade v4 installations. Follow the prompts or see the [v4 to v6 Upgrade Guide](./v4-to-v6-upgrade.md).

---

## Development & Best Practices

### Should I commit the .bmad/ folder to git?

**Recommended approach:**

- **Commit**: `.bmad/` folder (agents and workflows)
- **Ignore**: `.bmad-ephemeral/` folder (temporary Phase 4 artifacts)

This ensures team members have the same agents/workflows without manual installation.

Alternative: Add `.bmad/` to `.gitignore` and have each developer run `npx bmad-method@alpha install`.

### What's the difference between docs/ and .bmad-ephemeral/?

- **docs/**: Durable documentation (PRD, Architecture, UX designs) - committed to git
- **.bmad-ephemeral/**: Temporary Phase 4 artifacts (sprint status, stories, epics) - gitignored

### How do I write better stories?

1. Use the `create-story` workflow - don't write manually
2. Ensure acceptance criteria are testable
3. Link to relevant PRD sections
4. Keep stories small (1-3 days of work)
5. Use `story-context` workflow to generate just-in-time context

### What's the recommended team workflow?

1. **PM**: Runs `product-brief` → `prd` workflows
2. **Architect**: Runs `architecture` workflow
3. **PM/SM**: Runs `create-epics-and-stories` workflow
4. **SM**: Runs `sprint-planning` workflow
5. **Developers**: Run `dev-story` for each story
6. **SM**: Runs `story-done` when complete

### Can I use BMad Method with non-AI developers?

Yes! BMad Method produces standard agile artifacts (PRD, architecture docs, user stories) that any developer can follow. The AI agents just help create and maintain these artifacts.

### How do I contribute to BMad Method?

1. Join [Discord](https://discord.gg/gk8jAdXWmj) #general-dev
2. Read [CONTRIBUTING.md](../CONTRIBUTING.md)
3. Check existing issues or create one
4. Discuss your proposed changes
5. Submit a PR (200-400 lines ideal, 800 max)

### Where can I get help?

- **Discord**: [Join community](https://discord.gg/gk8jAdXWmj) - #general-dev, #bugs-issues
- **GitHub Issues**: [Report bugs/request features](https://github.com/bmad-code-org/BMAD-METHOD/issues)
- **Documentation**: Start with [docs/index.md](./index.md)
- **YouTube**: [BMad Code Channel](https://www.youtube.com/@BMadCode) (videos coming soon)

---

## Still have questions?

- 💬 Ask in [Discord #general-dev](https://discord.gg/gk8jAdXWmj)
- 📝 Check the [complete documentation](./index.md)
- 🐛 Report issues on [GitHub](https://github.com/bmad-code-org/BMAD-METHOD/issues)
- 🎥 Subscribe to [BMad Code YouTube](https://www.youtube.com/@BMadCode) for video tutorials

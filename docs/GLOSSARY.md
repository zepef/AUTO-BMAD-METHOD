# BMad Method Glossary

Complete reference of terms, concepts, and acronyms used throughout the BMad Method ecosystem.

---

## Core Concepts

### BMad-CORE

**BMad-CORE** (Collaboration Optimized Reflection Engine) is the foundational framework powering all BMad modules. It provides:
- Agent orchestration system
- Workflow engine with XML-based execution
- Modular architecture for domain-specific solutions
- IDE integration layer
- Update-safe customization system

**Philosophy**: C.O.R.E. = **C**ollaboration, **O**ptimized, **R**eflection, **E**ngine

### BMad Method (BMM)

The flagship module for AI-driven agile software and game development. Includes 12 specialized agents and 34 workflows covering all phases from planning to implementation.

### BMad Builder (BMB)

Meta-framework for creating custom agents, workflows, and modules. Use this to extend BMad-CORE with domain-specific solutions (legal, medical, finance, creative, etc.).

### Creative Intelligence Suite (CIS)

Module providing innovation and brainstorming workflows using proven creative methodologies. Includes 5 specialized agents and 5 interactive workflows.

---

## Agents

### Agent

A specialized AI persona with domain expertise, configured role, and curated workflows. Agents are defined in YAML format and compiled to markdown files for IDE consumption.

**Example agents**: Product Manager (PM), Architect, Developer, UX Designer, Test Architect (TEA)

### Agent Menu

The interactive menu displayed when an agent is loaded, showing available workflows and shortcuts for execution.

### Agent Customization

The ability to modify agent properties (name, role, persona, language) via YAML files in `.bmad/_cfg/agents/` that survive updates.

### Party Mode

Multi-agent orchestration mode where all installed agents collaborate on a task or workflow. Activated via `/bmad:core:workflows:party-mode`.

### BMad Master

The orchestrator agent in BMad-CORE with comprehensive knowledge of all installed modules, agents, and workflows. Acts as the guide for the entire system.

---

## Workflows

### Workflow

A guided, multi-step process with structured instructions, best practices, and validation checkpoints. Defined by three files:
- `workflow.yaml` - Configuration and variables
- `instructions.md` - Step-by-step execution instructions
- `template.md` - Output document template (optional)

### Workflow Execution

The process of running a workflow, typically in a fresh chat with an agent. Workflows can be triggered via:
- Agent menu (natural language or shortcuts)
- Direct slash commands
- Party mode

### Fresh Chat

Starting a new conversation with an agent to ensure maximum available context window for workflow execution. Essential for complex workflows.

### Child Workflow

A workflow invoked by another (parent) workflow using `<invoke-workflow>` XML directive. Enables workflow composition and reuse.

### Task

A reusable, standalone component (typically XML-based) that can be invoked by multiple workflows. Examples: `workflow.xml`, `adv-elicit.xml`, `index-docs.xml`.

---

## Planning & Development

### Planning Tracks

BMad Method's scale-adaptive system with three tracks:

#### Quick Flow Track
Bug fixes and small features requiring only a tech-spec. Fastest path from idea to implementation.

#### BMad Method Track
Products, platforms, and complex features requiring PRD, Architecture, and UX design. Full planning workflow.

#### Enterprise Method Track
Enterprise systems with extended planning including Security, DevOps, and Test Strategy (coming soon).

### Scale Levels (Legacy v4 Terminology)

The v4 system had 5 levels (0-4). v6 replaced this with Planning Tracks, but some documentation may reference:
- **Level 0**: Bug fixes (now Quick Flow)
- **Level 1**: Small features (now Quick Flow)
- **Level 2-4**: Various complexity levels (now BMad Method or Enterprise tracks)

### Four Phases

BMad Method's development methodology:

#### Phase 1: Analysis (Optional)
Brainstorming, research, domain exploration, product briefs. Used for new product ideation.

#### Phase 2: Planning (Required)
Scale-adaptive planning: PRD (BMad Method track), tech-spec (Quick Flow), or GDD (game development).

#### Phase 3: Solutioning (Track-dependent)
Architecture decisions, technical design, pattern selection. Required for BMad Method track.

#### Phase 4: Implementation (Iterative)
Story-centric development with sprint planning, story creation, development, code review, and retrospectives.

---

## Artifacts & Documentation

### PRD (Product Requirements Document)

Comprehensive requirements document created by PM agent. Defines features, user stories, acceptance criteria, and success metrics.

### GDD (Game Design Document)

Game-specific requirements document defining gameplay mechanics, narrative, art direction, and technical requirements.

### Tech-Spec (Technical Specification)

Lightweight specification for Quick Flow track. Defines problem, solution approach, implementation steps, and testing strategy.

### Architecture Document

Technical design document defining system architecture, patterns, technology choices, data models, and architectural decision records (ADRs).

### ADR (Architectural Decision Record)

Structured record of an architectural decision including context, decision, rationale, and consequences.

### Story

A single unit of work in Phase 4 following user story format: "As a [persona], I want [goal], so that [benefit]". Includes acceptance criteria and tasks.

### Epic

A collection of related stories representing a major feature or capability. Used to organize Phase 4 implementation.

### Story Context

Just-in-time context XML generated for a story, including relevant PRD sections, architecture excerpts, and existing code patterns.

### Durable Documentation

Permanent project documentation stored in `docs/` (or configured output folder). Includes PRD, Architecture, UX designs. Should be committed to git.

### Ephemeral Artifacts

Temporary Phase 4 working files stored in `.bmad-ephemeral/`. Includes sprint status, stories, epics, and temporary contexts. Typically gitignored.

---

## Technical Concepts

### Document Sharding

Advanced optimization that splits large documents into smaller files organized by sections. Enables workflows to load only needed sections, providing 90%+ token savings.

**Structure**:
```
PRD/
├── index.md           # Table of contents
├── 1-overview.md      # Section 1
├── 2-features.md      # Section 2
└── ...
```

### Variable Resolution

The process of resolving configuration variables through the inheritance chain:
1. Core config → Module config → Workflow config
2. External file references (e.g., `{config_source}:project_name`)
3. System variables (e.g., `{project-root}`, `{date}`)
4. Runtime prompts for unknowns

### Configuration Inheritance

Multi-layer configuration system where child configs inherit and can override parent values:
```
Core config → Module config → Workflow config → Runtime
```

### Manifest Files

CSV files generated during installation that enable runtime discovery of agents, workflows, and tasks:
- `agent-manifest.csv` - All installed agents
- `workflow-manifest.csv` - All available workflows
- `task-manifest.csv` - All reusable tasks

### Web Bundles

Self-contained agent files with all dependencies embedded inline. Enables usage in web-based IDEs without file system access.

---

## Installation & Configuration

### Installation Directory

The folder containing all BMad Method files. Default is `.bmad` but can be customized during installation.

### Module

A self-contained package of agents, workflows, tasks, and documentation for a specific domain. Modules are installed independently.

### Module Installer

JavaScript file in each module's `_module-installer/` directory that handles module-specific installation logic.

### Configuration Collector

Installation component that interactively gathers user preferences via prompts defined in `install-config.yaml`.

### Dependency Resolver

Installation component that resolves cross-module dependencies and ensures required modules are installed.

### IDE Integration

Automatic configuration of IDE-specific files (slash commands, shortcuts) during installation. Supports 17+ IDEs.

### Update-Safe Customization

The system that preserves user customizations in `_cfg/` during module updates. Custom agent configurations survive all updates.

---

## Workflows & Execution

### workflow-init

Essential initialization workflow that:
1. Analyzes project goal
2. Recommends appropriate planning track
3. Creates workflow path tracking files
4. Sets up project structure

Always run this first for new projects!

### workflow-status

Status check workflow that reads tracking files and recommends the next step based on current progress.

### Sprint Status

YAML file tracking all epics and stories through the development lifecycle. Used by Phase 4 workflows to coordinate implementation.

### Story Lifecycle

The progression of a story through states:
```
TODO → IN_PROGRESS → READY_FOR_REVIEW → DONE
```

Managed via workflows: `story-ready`, `story-review`, `story-done`

---

## Advanced Concepts

### Advanced Elicitation

Structured questioning technique using 30+ methods (Socratic, Five Whys, Devil's Advocate, etc.) to deeply explore requirements and assumptions.

Invoked at strategic points via: `<invoke-task>adv-elicit.xml</invoke-task>`

### XML Task Engine

The workflow execution engine that interprets XML-based task definitions with structured directives:
- `<step>`, `<substep>`, `<action>` - Hierarchical instructions
- `<critical>` - Mandatory rules
- `<check>`, `<if>`, `<goto>` - Control flow
- `<invoke-task>`, `<invoke-workflow>` - Composition

### Flattener

Tool that aggregates an entire codebase into a single XML file for LLM context. Used by the `document-project` workflow for brownfield projects.

### Brownfield Project

Existing codebase being integrated with BMad Method. Requires running `document-project` workflow first to create reference documentation.

### Greenfield Project

New project starting from scratch with BMad Method. Can proceed directly to planning phases.

---

## File Extensions & Formats

### .agent.yaml

Source format for agent definitions. Contains persona, menu items, critical actions, and configuration. Compiled to `.md` during installation.

### .md (Markdown)

Distributed format for agents. Contains compiled agent content with resolved variables. This is what IDEs load.

### workflow.yaml

Workflow configuration file defining variables, input/output files, and execution parameters.

### instructions.md

Workflow instruction file with step-by-step guidance for the agent executing the workflow.

### template.md

Optional workflow output template with placeholders for generated content.

### checklist.md

Optional workflow validation checklist ensuring completeness and quality standards.

---

## CLI Commands

### install
Installs BMad Method with interactive module selection and configuration.

### update
Updates installed modules while preserving customizations.

### uninstall
Removes BMad Method installation.

### status
Shows installation status, installed modules, and configured IDEs.

### doctor
Runs comprehensive health checks on installation integrity (new in v6).

### list
Lists available modules and their descriptions.

### build
Builds web bundles for web-based IDE distribution.

---

## Acronyms

- **BMad**: Breakthrough Method of Agile AI-Driven Development
- **CORE**: Collaboration Optimized Reflection Engine
- **BMM**: BMad Method Module
- **BMB**: BMad Builder Module
- **CIS**: Creative Intelligence Suite
- **PM**: Product Manager
- **SM**: Scrum Master
- **TEA**: Test Engineer Architect
- **PRD**: Product Requirements Document
- **GDD**: Game Design Document
- **ADR**: Architectural Decision Record
- **IDE**: Integrated Development Environment
- **CLI**: Command Line Interface
- **YAML**: YAML Ain't Markup Language (configuration format)
- **XML**: eXtensible Markup Language (task definition format)
- **CSV**: Comma-Separated Values (manifest format)

---

## Common Shortcuts

Throughout BMad Method documentation and agents:

- `*workflow-init` - Shortcut for workflow-init
- `*workflow-status` - Shortcut for workflow-status
- `*prd` - Shortcut for PRD workflow
- `*arch` - Shortcut for architecture workflow
- `*story` - Shortcut for create-story workflow
- `*dev` - Shortcut for dev-story workflow

---

## Getting Help

**Terms not in this glossary?**
- Check the [FAQ](./FAQ.md)
- Browse [complete documentation](./index.md)
- Ask in [Discord #general-dev](https://discord.gg/gk8jAdXWmj)
- Search [GitHub issues](https://github.com/bmad-code-org/BMAD-METHOD/issues)

---

_This glossary is maintained as part of BMad Method v6 documentation._

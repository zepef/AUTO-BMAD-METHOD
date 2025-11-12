# BMad Method Examples

Real-world examples demonstrating different planning tracks and workflows.

---

## Available Examples

### 1. [Quick Flow: Bug Fix](./quick-flow-bug-fix/)
**Planning Track:** Quick Flow
**Complexity:** Level 0 (Single bug fix)
**Time to complete:** 15-30 minutes
**Best for:** Learning the basics, simple changes

**Scenario:** Fix a date formatting bug in a Node.js application

**What you'll learn:**
- Quick Flow workflow execution
- Tech-spec creation
- Story-centric development
- Testing and validation

---

### 2. [BMad Method Track: Web Application](./bmm-track-web-app/)
**Planning Track:** BMad Method
**Complexity:** Level 2-3 (Product/Platform)
**Time to complete:** 2-4 hours
**Best for:** Understanding full planning workflow

**Scenario:** Build a task management web application from scratch

**What you'll learn:**
- Complete Phase 1-4 workflow
- PRD creation
- Architecture decision-making
- Epic and story breakdown
- Story-centric implementation

---

### 3. [Custom Module Creation](./custom-module/)
**Tool:** BMad Builder (BMB)
**Complexity:** Advanced
**Time to complete:** 1-2 hours
**Best for:** Creating domain-specific solutions

**Scenario:** Build a custom "Legal Review" module with specialized agents

**What you'll learn:**
- Creating custom agents
- Designing guided workflows
- Module structure and installation
- Agent customization system

---

## How to Use These Examples

### Option 1: Step-by-Step Tutorial (Recommended for Beginners)

1. **Choose an example** based on your learning goal
2. **Read the README** in the example directory
3. **Follow the step-by-step instructions**
4. **Compare your results** with provided sample outputs

### Option 2: Reference Implementation (For Experienced Users)

- Browse example files to understand patterns
- Use as templates for your own projects
- Adapt workflows to your specific needs

---

## Prerequisites

Before starting any example:

1. **Install BMad Method**
   ```bash
   npx bmad-method@alpha install
   ```

2. **Verify installation**
   ```bash
   npx bmad-method@alpha doctor
   ```

3. **Choose your IDE**
   - See [docs/ide-info/](../docs/ide-info/) for setup

4. **Understand basics**
   - Read the [Quick Start Guide](../src/modules/bmm/docs/quick-start.md)
   - Review the [Glossary](../docs/GLOSSARY.md) for terminology

---

## Example Comparison Matrix

| Example | Track | Phases Used | Agents Used | Workflows | Artifacts Created | Estimated Time |
|---------|-------|-------------|-------------|-----------|-------------------|----------------|
| **Bug Fix** | Quick Flow | 2, 4 | Developer | tech-spec, dev-story | Tech-spec, Story, Code | 15-30 min |
| **Web App** | BMad Method | 1, 2, 3, 4 | PM, Architect, Dev | product-brief, prd, architecture, create-epics-and-stories, dev-story | Product Brief, PRD, Architecture, Epics, Stories, Code | 2-4 hours |
| **Custom Module** | BMB | N/A | BMad Builder | create-agent, create-workflow, create-module | Agent YAML, Workflow files, Module structure | 1-2 hours |

---

## Learning Paths

### Path 1: Absolute Beginner
1. Start with [Quick Flow Bug Fix](./quick-flow-bug-fix/)
2. Try a simple feature using Quick Flow
3. Move to [Web App Example](./bmm-track-web-app/) for full workflow
4. Explore [Custom Module](./custom-module/) when ready to extend

### Path 2: Experienced Developer
1. Skim [Web App Example](./bmm-track-web-app/) README
2. Try implementing a feature in your own project
3. Reference examples as needed
4. Create [Custom Module](./custom-module/) for your domain

### Path 3: Team Lead / Architect
1. Review all example READMEs to understand capabilities
2. Choose appropriate track for your team's project
3. Pilot with [Web App Example](./bmm-track-web-app/)
4. Customize agents and workflows for your team

---

## Sample Project Ideas

Use these as practice after completing the examples:

### Quick Flow Projects
- Add authentication to existing API
- Fix validation bug in form submission
- Improve error handling in service
- Add logging to critical paths
- Update deprecated package usage

### BMad Method Projects
- Build a blog platform with CMS
- Create a real-time chat application
- Develop an e-commerce storefront
- Build a project management tool
- Create a data visualization dashboard

### Custom Module Projects
- Legal document review module
- Medical diagnosis assistance module
- Financial analysis module
- Academic research assistant module
- Creative writing companion module

---

## Contributing Examples

Want to add your own example?

1. **Create a new directory** in `examples/`
2. **Include these files:**
   - `README.md` - Step-by-step instructions
   - `WALKTHROUGH.md` - Detailed execution log
   - `sample-outputs/` - Expected artifacts
3. **Follow the template** structure from existing examples
4. **Submit a PR** following [CONTRIBUTING.md](../CONTRIBUTING.md)

**Good example contributions:**
- Real-world scenarios from your experience
- Different project types (API, CLI, mobile, game, etc.)
- Different domains (fintech, healthcare, education, etc.)
- Edge cases or complex scenarios
- Brownfield project examples

---

## Troubleshooting Examples

**Example won't run:**
- Ensure BMad Method is installed: `bmad status`
- Check you're in the example directory
- Verify you loaded the correct agent

**Different results than example:**
- AI responses are non-deterministic (expected variation)
- Your configuration may differ (names, paths)
- Focus on workflow steps, not exact wording

**Stuck on a step:**
- Check the [Troubleshooting Guide](../docs/TROUBLESHOOTING.md)
- Review the [FAQ](../docs/FAQ.md)
- Ask in [Discord #general-dev](https://discord.gg/gk8jAdXWmj)

---

## Additional Resources

- **[Documentation Index](../docs/index.md)** - All guides and references
- **[BMM Workflows](../src/modules/bmm/workflows/README.md)** - Detailed workflow documentation
- **[Agents Guide](../src/modules/bmm/docs/agents-guide.md)** - Understanding all agents
- **[Discord Community](https://discord.gg/gk8jAdXWmj)** - Get help and share your work

---

## Feedback

Found an issue with an example? Have suggestions?

- 🐛 [Report an issue](https://github.com/bmad-code-org/BMAD-METHOD/issues)
- 💬 [Discuss in Discord](https://discord.gg/gk8jAdXWmj)
- ⭐ [Star the repo](https://github.com/bmad-code-org/BMAD-METHOD) if these examples helped!

---

_Examples for BMad Method v6.0.0-alpha.8_

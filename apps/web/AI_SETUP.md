# FlowForge AI Integration Setup

FlowForge supports multiple AI providers with real-time streaming responses. This guide will help you set up AI integration.

## Supported Providers

- **OpenAI** (GPT-4, GPT-3.5)
- **Anthropic** (Claude 3 Opus, Sonnet, Haiku)

## Quick Start

### 1. Get API Keys

**OpenAI:**

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (starts with `sk-...`)

**Anthropic:**

1. Go to https://console.anthropic.com/
2. Create an API key
3. Copy the key (starts with `sk-ant-...`)

### 2. Configure Environment Variables

Create a `.env.local` file in the `apps/web` directory:

```bash
cd apps/web
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
# Choose your provider
DEFAULT_AI_PROVIDER=openai

# OpenAI Configuration
OPENAI_API_KEY=sk-your-key-here
DEFAULT_MODEL=gpt-4-turbo-preview

# Or use Anthropic
# DEFAULT_AI_PROVIDER=anthropic
# ANTHROPIC_API_KEY=sk-ant-your-key-here
# DEFAULT_MODEL=claude-3-sonnet-20240229
```

### 3. Start the Development Server

```bash
pnpm dev
```

Visit http://localhost:3000/chat and start chatting!

## AI Agents

FlowForge includes 4 specialized AI agents, each with custom prompts:

### 1. Product Manager (John)

- **Expertise**: Product requirements, user stories, PRDs
- **Model**: GPT-4 Turbo (recommended)
- **Temperature**: 0.7 (balanced)
- **Best for**: Creating PRDs, defining features, prioritization

### 2. Technical Architect (Sarah)

- **Expertise**: System architecture, technical design
- **Model**: GPT-4 or Claude 3 Sonnet
- **Temperature**: 0.5 (more focused)
- **Best for**: Architecture diagrams, tech stack decisions, API design

### 3. Senior Developer (Mike)

- **Expertise**: Code implementation, debugging
- **Model**: GPT-4 Turbo
- **Temperature**: 0.4 (precise)
- **Best for**: Writing code, fixing bugs, code reviews

### 4. UX Designer (Emma)

- **Expertise**: User experience, visual design
- **Model**: GPT-4 or Claude 3 Opus
- **Temperature**: 0.8 (more creative)
- **Best for**: UX research, wireframes, design systems

## Available Models

### OpenAI

- `gpt-4-turbo-preview` - Most capable, best for complex tasks
- `gpt-4` - Very capable, slightly older
- `gpt-3.5-turbo` - Fast and economical

### Anthropic

- `claude-3-opus-20240229` - Most capable, best reasoning
- `claude-3-sonnet-20240229` - Balanced performance and speed
- `claude-3-haiku-20240307` - Fast and economical

## Features

### Real-time Streaming

All responses stream in real-time for a better user experience. You'll see the AI's response appear word-by-word as it's generated.

### Agent-Specific Prompts

Each agent has a carefully crafted system prompt that defines their:

- Role and expertise
- Communication style
- Output format preferences
- Specialized knowledge

### Conversation History

The chat maintains full conversation history, allowing the AI to:

- Remember previous messages
- Provide context-aware responses
- Build on earlier discussions

## Customization

### Change Default Provider

Edit `.env.local`:

```env
DEFAULT_AI_PROVIDER=anthropic  # or 'openai'
```

### Change Default Model

Edit `.env.local`:

```env
DEFAULT_MODEL=claude-3-opus-20240229
```

### Modify Agent Prompts

Edit `apps/web/src/lib/ai/agent-prompts.ts` to customize agent behavior.

## Troubleshooting

### "API key not configured" Error

**Problem**: Missing API key for selected provider

**Solution**:

1. Check `.env.local` exists in `apps/web/`
2. Verify the API key is set correctly
3. Restart the dev server: `pnpm dev`

### Slow Responses

**Problem**: AI takes too long to respond

**Solutions**:

- Try a faster model (gpt-3.5-turbo or claude-3-haiku)
- Check your internet connection
- Verify API quota hasn't been exceeded

### Build Errors

**Problem**: TypeScript or build errors

**Solution**:

```bash
# Clean and rebuild
rm -rf .next
pnpm build
```

## Cost Management

### Estimated Costs (as of 2024)

**OpenAI GPT-4 Turbo:**

- Input: $0.01 per 1K tokens (~750 words)
- Output: $0.03 per 1K tokens

**Anthropic Claude 3 Sonnet:**

- Input: $0.003 per 1K tokens
- Output: $0.015 per 1K tokens

### Tips to Reduce Costs

1. **Use cheaper models** for simple tasks:
   - GPT-3.5-turbo for basic questions
   - Claude Haiku for quick responses

2. **Limit conversation length**:
   - Clear chat history when starting new topics
   - Keep messages concise

3. **Set usage limits** on your API dashboard

## Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore` by default
2. **Use environment variables** - Never hardcode API keys
3. **Rotate keys regularly** - Generate new keys periodically
4. **Monitor usage** - Check API dashboard for unusual activity
5. **Use read-only keys** - If available from your provider

## Next Steps

- Integrate conversation persistence with database
- Add conversation history management
- Implement artifact generation
- Add cost tracking and analytics
- Support for more AI providers (Google Gemini, local LLMs)

## Support

For issues or questions:

- Check the [Vercel AI SDK docs](https://sdk.vercel.ai/docs)
- Open an issue on GitHub
- Review the FlowForge documentation

---

**Happy building with FlowForge! 🚀**

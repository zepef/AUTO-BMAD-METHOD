import { streamText } from "ai";
import { getAIClient, getDefaultModel, type AIProvider } from "@/lib/ai/providers";
import { getAgentPrompt } from "@/lib/ai/agent-prompts";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, agentId, provider, model } = await req.json();

    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      return new Response("Messages are required", { status: 400 });
    }

    // Get API key based on provider
    const selectedProvider = (provider || process.env.DEFAULT_AI_PROVIDER || "anthropic") as AIProvider;
    let apiKey: string | undefined;

    switch (selectedProvider) {
      case "openai":
        apiKey = process.env.OPENAI_API_KEY;
        break;
      case "anthropic":
        apiKey = process.env.ANTHROPIC_API_KEY;
        break;
      default:
        return new Response(`Unsupported provider: ${selectedProvider}`, {
          status: 400,
        });
    }

    if (!apiKey) {
      return new Response(
        `API key not configured for provider: ${selectedProvider}. Please add ${selectedProvider.toUpperCase()}_API_KEY to your environment variables.`,
        { status: 500 }
      );
    }

    // Get agent configuration
    const agentPrompt = getAgentPrompt(agentId || "developer");
    const selectedModel = model || getDefaultModel(selectedProvider);

    // Get AI client
    const aiModel = getAIClient({
      provider: selectedProvider,
      model: selectedModel,
      apiKey,
    });

    // Stream the response
    const result = streamText({
      model: aiModel,
      system: agentPrompt.systemPrompt,
      messages,
      temperature: agentPrompt.temperature || 0.7,
      maxOutputTokens: 4000,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

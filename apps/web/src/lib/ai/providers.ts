import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";

export type AIProvider = "openai" | "anthropic";

export interface AIConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
}

// Model mappings for each provider
export const PROVIDER_MODELS = {
  openai: {
    "gpt-4-turbo": "gpt-4-turbo-preview",
    "gpt-4": "gpt-4",
    "gpt-3.5-turbo": "gpt-3.5-turbo",
  },
  anthropic: {
    "claude-3-opus": "claude-3-opus-20240229",
    "claude-3-sonnet": "claude-3-sonnet-20240229",
    "claude-3-haiku": "claude-3-haiku-20240307",
  },
};

export function getAIClient(config: AIConfig) {
  switch (config.provider) {
    case "openai":
      return createOpenAI({
        apiKey: config.apiKey,
      })(config.model);

    case "anthropic":
      return createAnthropic({
        apiKey: config.apiKey,
      })(config.model);

    default:
      throw new Error(`Unsupported AI provider: ${config.provider}`);
  }
}

export function getDefaultModel(provider: AIProvider): string {
  switch (provider) {
    case "openai":
      return "gpt-4-turbo-preview";
    case "anthropic":
      return "claude-3-sonnet-20240229";
    default:
      return "gpt-4-turbo-preview";
  }
}

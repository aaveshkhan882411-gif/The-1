import { AIProvider, ChatMessage, AICompletionOptions, AIResponse } from "../types";

export interface LocalProviderConfig {
  baseUrl?: string;
  apiKey?: string;
  defaultModel?: string;
}

export class LocalProvider implements AIProvider {
  public name = "local-inference";
  private baseUrl: string;
  private apiKey: string;
  private defaultModel: string;

  constructor(config?: LocalProviderConfig) {
    this.baseUrl = config?.baseUrl || process.env.AI_BASE_URL || "http://localhost:8000/v1";
    this.apiKey = config?.apiKey || process.env.AI_API_KEY || "local-key";
    this.defaultModel = config?.defaultModel || process.env.AI_MODEL || "growthai-sales-7b";
  }

  async generateCompletion(
    messages: ChatMessage[],
    options?: AICompletionOptions
  ): Promise<AIResponse> {
    const model = options?.model || this.defaultModel;
    const url = `${this.baseUrl.replace(/\/+$/, "")}/chat/completions`;

    const bodyPayload: Record<string, unknown> = {
      model,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        ...(m.name ? { name: m.name } : {}),
        ...(m.tool_call_id ? { tool_call_id: m.tool_call_id } : {})
      })),
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 1024
    };

    if (options?.tools && options.tools.length > 0) {
      bodyPayload.tools = options.tools.map((t) => ({
        type: "function",
        function: {
          name: t.name,
          description: t.description,
          parameters: t.parameters
        }
      }));
      if (options.tool_choice) {
        bodyPayload.tool_choice = options.tool_choice;
      }
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(bodyPayload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Local inference server error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];

    return {
      content: choice?.message?.content ?? null,
      tool_calls: choice?.message?.tool_calls ?? undefined,
      usage: data.usage
        ? {
            prompt_tokens: data.usage.prompt_tokens || 0,
            completion_tokens: data.usage.completion_tokens || 0,
            total_tokens: data.usage.total_tokens || 0
          }
        : undefined
    };
  }
}


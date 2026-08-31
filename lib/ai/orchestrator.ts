import { LocalProvider } from "./providers/local-provider";
import { ChatMessage, AICompletionOptions, AIResponse, ToolDefinition } from "./types";

export interface OrchestrationContext {
  tenantId: string;
  agentId: string;
  systemPrompt: string;
  allowedTools?: ToolDefinition[];
}

export class AIOrchestrator {
  private provider: LocalProvider;

  constructor(provider?: LocalProvider) {
    this.provider = provider || new LocalProvider();
  }

  async runAgentTurn(
    context: OrchestrationContext,
    conversationHistory: ChatMessage[],
    userMessage: string,
    options?: AICompletionOptions
  ): Promise<AIResponse> {
    if (!context.tenantId || !context.agentId) {
      throw new Error("Tenant context and Agent ID are required for AI execution.");
    }

    const messages: ChatMessage[] = [
      {
        role: "system",
        content: context.systemPrompt
      },
      ...conversationHistory,
      {
        role: "user",
        content: userMessage
      }
    ];

    const completionOptions: AICompletionOptions = {
      ...options,
      tools: context.allowedTools && context.allowedTools.length > 0 ? context.allowedTools : undefined,
      tool_choice: context.allowedTools && context.allowedTools.length > 0 ? "auto" : undefined
    };

    return await this.provider.generateCompletion(messages, completionOptions);
  }
}


import type {
  AgentConfig,
  AgentContext,
  AgentHandler,
  AgentResult,
} from "./types";

export interface RegisteredAgent {
  config: AgentConfig;
  handler: AgentHandler;
}

class AgentRegistry {
  private readonly agents = new Map<string, RegisteredAgent>();

  register(
    config: AgentConfig,
    handler: AgentHandler,
  ): void {
    if (this.agents.has(config.id)) {
      throw new Error(
        `Agent "${config.id}" is already registered.`,
      );
    }

    this.agents.set(config.id, {
      config,
      handler,
    });
  }

  unregister(agentId: string): boolean {
    return this.agents.delete(agentId);
  }

  has(agentId: string): boolean {
    return this.agents.has(agentId);
  }

  get(agentId: string): RegisteredAgent | undefined {
    return this.agents.get(agentId);
  }

  list(): RegisteredAgent[] {
    return Array.from(this.agents.values());
  }

  async execute<TInput = unknown, TOutput = unknown>(
    agentId: string,
    context: AgentContext,
    input: TInput,
  ): Promise<AgentResult<TOutput>> {
    const registeredAgent = this.agents.get(agentId);

    if (!registeredAgent) {
      throw new Error(`Agent "${agentId}" is not registered.`);
    }

    if (!registeredAgent.config.enabled) {
      throw new Error(`Agent "${agentId}" is disabled.`);
    }

    return registeredAgent.handler(
      context,
      input,
    ) as Promise<AgentResult<TOutput>>;
  }

  clear(): void {
    this.agents.clear();
  }
}

export const agentRegistry = new AgentRegistry();

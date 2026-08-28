import type {
  AgentConfig,
  AgentContext,
  AgentHandler,
  AgentResult,
} from "./types";
import { agentRegistry } from "./registry";
import {
  AgentDisabledError,
  AgentExecutionError,
  AgentNotFoundError,
} from "./errors";

export class AgentManager {
  register(
    config: AgentConfig,
    handler: AgentHandler,
  ): void {
    agentRegistry.register(config, handler);
  }

  unregister(agentId: string): boolean {
    return agentRegistry.unregister(agentId);
  }

  get(agentId: string) {
    return agentRegistry.get(agentId);
  }

  list() {
    return agentRegistry.list();
  }

  async execute<TInput = unknown, TOutput = unknown>(
    agentId: string,
    context: AgentContext,
    input: TInput,
  ): Promise<AgentResult<TOutput>> {
    const registeredAgent =
      agentRegistry.get(agentId);

    if (!registeredAgent) {
      throw new AgentNotFoundError(agentId);
    }

    if (!registeredAgent.config.enabled) {
      throw new AgentDisabledError(agentId);
    }

    try {
      return await agentRegistry.execute<
        TInput,
        TOutput
      >(agentId, context, input);
    } catch (error) {
      if (
        error instanceof AgentNotFoundError ||
        error instanceof AgentDisabledError
      ) {
        throw error;
      }

      throw new AgentExecutionError(
        agentId,
        `Agent "${agentId}" execution failed.`,
        error,
      );
    }
  }
}

export const agentManager = new AgentManager();

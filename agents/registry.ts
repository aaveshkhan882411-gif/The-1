import type {
  AgentConfig,
  AgentHandler,
  AgentRegistryEntry,
} from "./types";

class AgentRegistry {
  private readonly agents = new Map<string, AgentRegistryEntry>();

  register(
    config: AgentConfig,
    handler: AgentHandler,
  ): void {
    if (this.agents.has(config.id)) {
      throw new Error(`Agent "${config.id}" is already registered.`);
    }

    this.agents.set(config.id, {
      agent: {
        id: config.id,
        name: config.name,
      },
      config,
    });
  }

  unregister(agentId: string): boolean {
    return this.agents.delete(agentId);
  }

  has(agentId: string): boolean {
    return this.agents.has(agentId);
  }

  get(agentId: string): AgentRegistryEntry | undefined {
    return this.agents.get(agentId);
  }

  list(): AgentRegistryEntry[] {
    return Array.from(this.agents.values());
  }

  clear(): void {
    this.agents.clear();
  }
}

export const agentRegistry = new AgentRegistry();

import type { AgentStatus } from "./types";
import { agentRegistry } from "./registry";

export interface AgentHealth {
  agentId: string;
  status: AgentStatus;
  enabled: boolean;
  healthy: boolean;
}

export function checkAgentHealth(
  agentId: string,
): AgentHealth {
  const registeredAgent = agentRegistry.get(agentId);

  if (!registeredAgent) {
    throw new Error(`Agent "${agentId}" is not registered.`);
  }

  const { config } = registeredAgent;

  return {
    agentId: config.id,
    status: config.status,
    enabled: config.enabled,
    healthy:
      config.enabled &&
      config.status === "active",
  };
}

export function checkAllAgentsHealth(): AgentHealth[] {
  return agentRegistry.list().map(({ config }) => ({
    agentId: config.id,
    status: config.status,
    enabled: config.enabled,
    healthy:
      config.enabled &&
      config.status === "active",
  }));
}

import type {
  AgentConfig,
  AgentStatus,
} from "./types";
import { agentRegistry } from "./registry";

export function getAgentStatus(
  agentId: string,
): AgentStatus | undefined {
  return agentRegistry.get(agentId)?.config.status;
}

export function enableAgent(
  agentId: string,
): AgentConfig {
  const registeredAgent = agentRegistry.get(agentId);

  if (!registeredAgent) {
    throw new Error(`Agent "${agentId}" is not registered.`);
  }

  registeredAgent.config.enabled = true;
  registeredAgent.config.status = "active";

  return registeredAgent.config;
}

export function disableAgent(
  agentId: string,
): AgentConfig {
  const registeredAgent = agentRegistry.get(agentId);

  if (!registeredAgent) {
    throw new Error(`Agent "${agentId}" is not registered.`);
  }

  registeredAgent.config.enabled = false;
  registeredAgent.config.status = "inactive";

  return registeredAgent.config;
}

export function pauseAgent(
  agentId: string,
): AgentConfig {
  const registeredAgent = agentRegistry.get(agentId);

  if (!registeredAgent) {
    throw new Error(`Agent "${agentId}" is not registered.`);
  }

  registeredAgent.config.enabled = false;
  registeredAgent.config.status = "paused";

  return registeredAgent.config;
}

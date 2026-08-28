export type AgentStatus =
  | "active"
  | "inactive"
  | "paused"
  | "error";

export type AgentExecutionStatus =
  | "idle"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface AgentConfig {
  id: string;
  name: string;
  description?: string;
  status: AgentStatus;
  enabled: boolean;
  version: string;
  settings?: Record<string, unknown>;
}

export interface AgentContext {
  agentId: string;
  tenantId?: string;
  userId?: string;
  requestId?: string;
  input?: unknown;
  metadata?: Record<string, unknown>;
}

export interface AgentResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  executionId?: string;
  metadata?: Record<string, unknown>;
}

export interface AgentExecution {
  id: string;
  agentId: string;
  status: AgentExecutionStatus;
  startedAt: string;
  completedAt?: string;
  error?: string;
  result?: unknown;
}

export type AgentHandler<TInput = unknown, TOutput = unknown> = (
  context: AgentContext,
  input: TInput
) => Promise<AgentResult<TOutput>>;

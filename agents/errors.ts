export class AgentError extends Error {
  public readonly code: string;
  public readonly agentId?: string;
  public readonly cause?: unknown;

  constructor(
    code: string,
    message: string,
    options?: {
      agentId?: string;
      cause?: unknown;
    },
  ) {
    super(message);

    this.name = "AgentError";
    this.code = code;
    this.agentId = options?.agentId;
    this.cause = options?.cause;

    Object.setPrototypeOf(
      this,
      new.target.prototype,
    );
  }
}

export class AgentNotFoundError extends AgentError {
  constructor(agentId: string) {
    super(
      "AGENT_NOT_FOUND",
      `Agent "${agentId}" was not found.`,
      { agentId },
    );
  }
}

export class AgentDisabledError extends AgentError {
  constructor(agentId: string) {
    super(
      "AGENT_DISABLED",
      `Agent "${agentId}" is disabled.`,
      { agentId },
    );
  }
}

export class AgentExecutionError extends AgentError {
  constructor(
    agentId: string,
    message: string,
    cause?: unknown,
  ) {
    super(
      "AGENT_EXECUTION_FAILED",
      message,
      {
        agentId,
        cause,
      },
    );
  }
}

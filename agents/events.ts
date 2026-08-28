export type AgentEventType =
  | "registered"
  | "started"
  | "completed"
  | "failed"
  | "paused"
  | "disabled"
  | "enabled";

export interface AgentEvent {
  type: AgentEventType;
  agentId: string;
  timestamp: string;
  executionId?: string;
  metadata?: Record<string, unknown>;
}

type AgentEventListener = (
  event: AgentEvent,
) => void | Promise<void>;

class AgentEventBus {
  private readonly listeners = new Map<
    AgentEventType,
    Set<AgentEventListener>
  >();

  on(
    type: AgentEventType,
    listener: AgentEventListener,
  ): () => void {
    const listeners =
      this.listeners.get(type) ??
      new Set<AgentEventListener>();

    listeners.add(listener);
    this.listeners.set(type, listeners);

    return () => {
      listeners.delete(listener);

      if (listeners.size === 0) {
        this.listeners.delete(type);
      }
    };
  }

  async emit(
    event: AgentEvent,
  ): Promise<void> {
    const listeners = this.listeners.get(event.type);

    if (!listeners) {
      return;
    }

    await Promise.all(
      Array.from(listeners).map((listener) =>
        listener(event),
      ),
    );
  }

  clear(): void {
    this.listeners.clear();
  }
}

export const agentEventBus = new AgentEventBus();

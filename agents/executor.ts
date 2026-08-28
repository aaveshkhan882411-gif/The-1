import type {
  AgentContext,
  AgentResult,
} from "./types";
import { agentRegistry } from "./registry";

export async function executeAgent<
  TInput = unknown,
  TOutput = unknown,
>(
  agentId: string,
  context: AgentContext,
  input: TInput,
): Promise<AgentResult<TOutput>> {
  return agentRegistry.execute<TInput, TOutput>(
    agentId,
    context,
    input,
  );
}

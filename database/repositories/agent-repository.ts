/**
 * @file database/repositories/agent-repository.ts
 * @description PostgreSQL repository for GrowthAI agents.
 *
 * All agent database operations are centralized here.
 * Tenant isolation is enforced for all tenant-scoped operations.
 */

import "server-only";

import type {
  DatabaseAdapter,
  QueryOptions,
  QueryResult,
  UUID,
} from "../types";
import { Repository } from "../repository";

export type AgentStatus =
  | "active"
  | "inactive"
  | "paused"
  | "error";

export interface AgentRecord {
  readonly id: UUID;
  readonly tenant_id: UUID;
  readonly name: string;
  readonly type: string;
  readonly status: AgentStatus;
  readonly configuration: Record<string, unknown>;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface CreateAgentInput {
  readonly tenant_id: UUID;
  readonly name: string;
  readonly type: string;
  readonly status?: AgentStatus;
  readonly configuration?: Record<string, unknown>;
}

export interface UpdateAgentInput {
  readonly name?: string;
  readonly type?: string;
  readonly status?: AgentStatus;
  readonly configuration?: Record<string, unknown>;
}

export interface AgentQueryOptions extends QueryOptions {
  readonly tenantId: UUID;
  readonly status?: AgentStatus;
  readonly type?: string;
}

export class AgentRepository extends Repository<
  AgentRecord,
  CreateAgentInput,
  UpdateAgentInput
> {
  public constructor(db: DatabaseAdapter) {
    super(db, "agents");
  }

  public async findById(
    id: UUID,
    tenantId: UUID,
  ): Promise<AgentRecord | null> {
    const result = await this.db.query<AgentRecord>(
      `
        SELECT
          id,
          tenant_id,
          name,
          type,
          status,
          configuration,
          created_at,
          updated_at
        FROM agents
        WHERE id = $1
          AND tenant_id = $2
        LIMIT 1
      `,
      [id, tenantId],
    );

    return result.rows[0] ?? null;
  }

  public async findMany(
    options: AgentQueryOptions,
  ): Promise<QueryResult<AgentRecord>> {
    const limit = Math.min(
      Math.max(Math.floor(options.limit ?? 25), 1),
      100,
    );

    const offset = Math.max(
      Math.floor(options.offset ?? 0),
      0,
    );

    const params: unknown[] = [options.tenantId];

    const conditions: string[] = [
      "tenant_id = $1",
    ];

    if (options.status) {
      params.push(options.status);
      conditions.push(`status = $${params.length}`);
    }

    if (options.type) {
      params.push(options.type);
      conditions.push(`type = $${params.length}`);
    }

    const limitParam = params.length + 1;
    const offsetParam = params.length + 2;

    const result = await this.db.query<AgentRecord>(
      `
        SELECT
          id,
          tenant_id,
          name,
          type,
          status,
          configuration,

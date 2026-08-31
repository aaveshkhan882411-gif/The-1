/**
 * @file database/repositories/agent-repository.ts
 * @description PostgreSQL repository for GrowthAI agents.
 *
 * All agent database operations are centralized here.
 * Tenant isolation is enforced at repository level.
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
  readonly tenantId?: UUID;
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

  /**
   * Finds an agent by ID.
   *
   * When tenantId is supplied, the agent must belong
   * to that tenant.
   */
  public async findById(
    id: UUID,
    tenantId?: UUID,
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
          AND ($2::uuid IS NULL OR tenant_id = $2)
        LIMIT 1
      `,
      [id, tenantId ?? null],
    );

    return result.rows[0] ?? null;
  }

  /**
   * Returns agents belonging to a tenant.
   */
  public async findMany(
    options: AgentQueryOptions = {},
  ): Promise<QueryResult<AgentRecord>> {
    const limit = Math.min(
      Math.max(Math.floor(options.limit ?? 25), 1),
      100,
    );

    const offset = Math.max(
      Math.floor(options.offset ?? 0),
      0,
    );

    if (!options.tenantId) {
      return {
        rows: [],
        count: 0,
      };
    }

    const params: unknown[] = [options.tenantId];
    const conditions: string[] = [
      "tenant_id = $1",
    ];

    if (options.status) {
      params.push(options.status);
      conditions.push(
        `status = $${params.length}`,
      );
    }

    if (options.type) {
      params.push(options.type);
      conditions.push(
        `type = $${params.length}`,
      );
    }

    const limitParam = params.length + 1;
    const offsetParam = params.length + 2;

    params.push(limit, offset);

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
        WHERE ${conditions.join(" AND ")}
        ORDER BY created_at DESC
        LIMIT $${limitParam}
        OFFSET $${offsetParam}
      `,
      params,
    );

    const countParams = params.slice(
      0,
      params.length - 2,
    );

    const countResult =
      await this.db.query<{ count: string }>(
        `
          SELECT COUNT(*)::text AS count
          FROM agents
          WHERE ${conditions.join(" AND ")}
        `,
        countParams,
      );

    return {
      rows: result.rows,
      count: Number(
        countResult.rows[0]?.count ?? 0,
      ),
    };
  }

  /**
   * Creates a new AI agent.
   */
  public async create(
    input: CreateAgentInput,
  ): Promise<AgentRecord> {
    const name = input.name.trim();
    const type = input.type.trim();

    if (!input.tenant_id) {
      throw new Error("Tenant ID is required.");
    }

    if (!name) {
      throw new Error("Agent name is required.");
    }

    if (!type) {
      throw new Error("Agent type is required.");
    }

    const status = input.status ?? "active";

    const configuration =
      input.configuration ?? {};

    const result = await this.db.query<AgentRecord>(
      `
        INSERT INTO agents (
          tenant_id,
          name,
          type,
          status,
          configuration
        )
        VALUES ($1, $2, $3, $4, $5::jsonb)
        RETURNING
          id,
          tenant_id,
          name,
          type,
          status,
          configuration,
          created_at,
          updated_at
      `,
      [
        input.tenant_id,
        name,
        type,
        status,
        JSON.stringify(configuration),
      ],
    );

    const agent = result.rows[0];

    if (!agent) {
      throw new Error(
        "Failed to create agent.",
      );
    }

    return agent;
  }

  /**
   * Updates an existing agent.
   *
   * tenant_id is intentionally immutable.
   */
  public async update(
    id: UUID,
    input: UpdateAgentInput,
  ): Promise<AgentRecord> {
    const existing = await this.findById(id);

    if (!existing) {
      throw new Error("Agent not found.");
    }

    const name =
      input.name !== undefined
        ? input.name.trim()
        : existing.name;

    const type =
      input.type !== undefined
        ? input.type.trim()
        : existing.type;

    const status =
      input.status ?? existing.status;

    const configuration =
      input.configuration ??
      existing.configuration;

    if (!name) {
      throw new Error("Agent name is required.");
    }

    if (!type) {
      throw new Error("Agent type is required.");
    }

    const result = await this.db.query<AgentRecord>(
      `
        UPDATE agents
        SET
          name = $1,
          type = $2,
          status = $3,
          configuration = $4::jsonb
        WHERE id = $5
        RETURNING
          id,
          tenant_id,
          name,
          type,
          status,
          configuration,
          created_at,
          updated_at
      `,
      [
        name,
        type,
        status,
        JSON.stringify(configuration),
        id,
      ],
    );

    const agent = result.rows[0];

    if (!agent) {
      throw new Error(
        "Failed to update agent.",
      );
    }

    return agent;
  }

  /**
   * Deletes an agent by ID.
   */
  public async delete(
    id: UUID,
  ): Promise<void> {
    const result = await this.db.execute(
      `
        DELETE FROM agents
        WHERE id = $1
      `,
      [id],
    );

    if (result.affectedRows === 0) {
      throw new Error("Agent not found.");
    }
  }

  /**
   * Returns the number of agents belonging to a tenant.
   */
  public async countByTenant(
    tenantId: UUID,
  ): Promise<number> {
    const result = await this.db.query<{
      count: string;
    }>(
      `
        SELECT COUNT(*)::text AS count
        FROM agents
        WHERE tenant_id = $1
      `,
      [tenantId],
    );

    return Number(
      result.rows[0]?.count ?? 0,
    );
  }

  /**
   * Returns the number of active agents belonging
   * to a tenant.
   */
  public async countActiveByTenant(
    tenantId: UUID,
  ): Promise<number> {
    const result = await this.db.query<{
      count: string;
    }>(
      `
        SELECT COUNT(*)::text AS count
        FROM agents
        WHERE tenant_id = $1
          AND status = 'active'
      `,
      [tenantId],
    );

    return Number(
      result.rows[0]?.count ?? 0,
    );
  }
}

export default AgentRepository;

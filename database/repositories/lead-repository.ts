/**
 * @file database/repositories/lead-repository.ts
 * @description PostgreSQL repository for GrowthAI leads.
 *
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

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "appointment"
  | "converted"
  | "lost"
  | "archived";

export interface LeadRecord {
  readonly id: UUID;
  readonly tenant_id: UUID;
  readonly name: string;
  readonly email: string | null;
  readonly phone: string | null;
  readonly company: string | null;
  readonly source: string | null;
  readonly status: LeadStatus;
  readonly notes: string | null;
  readonly assigned_agent_id: UUID | null;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface CreateLeadInput {
  readonly tenant_id: UUID;
  readonly name: string;
  readonly email?: string | null;
  readonly phone?: string | null;
  readonly company?: string | null;
  readonly source?: string | null;
  readonly status?: LeadStatus;
  readonly notes?: string | null;
  readonly assigned_agent_id?: UUID | null;
}

export interface UpdateLeadInput {
  readonly name?: string;
  readonly email?: string | null;
  readonly phone?: string | null;
  readonly company?: string | null;
  readonly source?: string | null;
  readonly status?: LeadStatus;
  readonly notes?: string | null;
  readonly assigned_agent_id?: UUID | null;
}

export interface LeadQueryOptions extends QueryOptions {
  readonly tenantId: UUID;
  readonly status?: LeadStatus;
  readonly assignedAgentId?: UUID;
}

export class LeadRepository extends Repository<
  LeadRecord,
  CreateLeadInput,
  UpdateLeadInput
> {
  public constructor(db: DatabaseAdapter) {
    super(db, "leads");
  }

  public async findById(
    id: UUID,
    tenantId: UUID,
  ): Promise<LeadRecord | null> {
    const result = await this.db.query<LeadRecord>(
      `
        SELECT
          id,
          tenant_id,
          name,
          email,
          phone,
          company,
          source,
          status,
          notes,
          assigned_agent_id,
          created_at,
          updated_at
        FROM leads
        WHERE id = $1
          AND tenant_id = $2
        LIMIT 1
      `,
      [id, tenantId],
    );

    return result.rows[0] ?? null;
  }

  public async findMany(
    options: LeadQueryOptions,
  ): Promise<QueryResult<LeadRecord>> {
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

    if (options.assignedAgentId) {
      params.push(options.assignedAgentId);
      conditions.push(
        `assigned_agent_id = $${params.length}`,
      );
    }

    const limitParam = params.length + 1;
    const offsetParam = params.length + 2;

    const result = await this.db.query<LeadRecord>(
      `
        SELECT
          id,
          tenant_id,
          name,
          email,
          phone,
          company,
          source,
          status,
          notes,
          assigned_agent_id,
          created_at,
          updated_at
        FROM leads
        WHERE ${conditions.join(" AND ")}
        ORDER BY created_at DESC
        LIMIT $${limitParam}
        OFFSET $${offsetParam}
      `,
      [...params, limit, offset],
    );

    const countResult = await this.db.query<{ count: string }>(
      `
        SELECT COUNT(*)::text AS count
        FROM leads
        WHERE ${conditions.join(" AND ")}
      `,
      params,
    );

    return {
      rows: result.rows,
      count: Number(countResult.rows[0]?.count ?? 0),
    };
  }

  private async assertAgentBelongsToTenant(
    agentId: UUID,
    tenantId: UUID,
  ): Promise<void> {
    const result = await this.db.query<{ id: UUID }>(
      `
        SELECT id
        FROM agents
        WHERE id = $1
          AND tenant_id = $2
        LIMIT 1
      `,
      [agentId, tenantId],
    );

    if (!result.rows[0]) {
      throw new Error(
        "Assigned agent does not belong to the tenant.",
      );
    }
  }

  public async create(
    input: CreateLeadInput,
  ): Promise<LeadRecord> {
    const name = input.name.trim();

    if (!input.tenant_id) {
      throw new Error("Tenant ID is required.");
    }

    if (!name) {
      throw new Error("Lead name is required.");
    }

    if (input.assigned_agent_id) {
      await this.assertAgentBelongsToTenant(
        input.assigned_agent_id,
        input.tenant_id,
      );
    }

    const result = await this.db.query<LeadRecord>(
      `
        INSERT INTO leads (
          tenant_id,
          name,
          email,
          phone,
          company,
          source,
          status,
          notes,
          assigned_agent_id
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9
        )
        RETURNING
          id,
          tenant_id,
          name,
          email,
          phone,
          company,
          source,
          status,
          notes,
          assigned_agent_id,
          created_at,
          updated_at
      `,
      [
        input.tenant_id,
        name,
        input.email ?? null,
        input.phone ?? null,
        input.company ?? null,
        input.source ?? null,
        input.status ?? "new",
        input.notes ?? null,
        input.assigned_agent_id ?? null,
      ],
    );

    const lead = result.rows[0];

    if (!lead) {
      throw new Error("Failed to create lead.");
    }

    return lead;
  }

  public async update(
    id: UUID,
    tenantId: UUID,
    input: UpdateLeadInput,
  ): Promise<LeadRecord> {
    const existing = await this.findById(id, tenantId);

    if (!existing) {
      throw new Error("Lead not found.");
    }

    const name =
      input.name !== undefined
        ? input.name.trim()
        : existing.name;

    if (!name) {
      throw new Error("Lead name is required.");
    }

    const assignedAgentId =
      input.assigned_agent_id !== undefined
        ? input.assigned_agent_id
        : existing.assigned_agent_id;

    if (assignedAgentId) {
      await this.assertAgentBelongsToTenant(
        assignedAgentId,
        tenantId,
      );
    }

    const result = await this.db.query<LeadRecord>(
      `
        UPDATE leads
        SET
          name = $1,
          email = $2,
          phone = $3,
          company = $4,
          source = $5,
          status = $6,
          notes = $7,
          assigned_agent_id = $8
        WHERE id = $9
          AND tenant_id = $10
        RETURNING
          id,
          tenant_id,
          name,
          email,
          phone,
          company,
          source,
          status,
          notes,
          assigned_agent_id,
          created_at,
          updated_at
      `,
      [
        name,
        input.email !== undefined
          ? input.email
          : existing.email,
        input.phone !== undefined
          ? input.phone
          : existing.phone,
        input.company !== undefined
          ? input.company
          : existing.company,
        input.source !== undefined
          ? input.source
          : existing.source,
        input.status ?? existing.status,
        input.notes !== undefined
          ? input.notes
          : existing.notes,
        assignedAgentId,
        id,
        tenantId,
      ],
    );

    const lead = result.rows[0];

    if (!lead) {
      throw new Error("Failed to update lead.");
    }

    return lead;
  }

  public async delete(
    id: UUID,
    tenantId: UUID,
  ): Promise<void> {
    const result = await this.db.execute(
      `
        DELETE FROM leads
        WHERE id = $1
          AND tenant_id = $2
      `,
      [id, tenantId],
    );

    if (result.affectedRows === 0) {
      throw new Error("Lead not found.");
    }
  }

  public async countByTenant(
    tenantId: UUID,
  ): Promise<number> {
    const result = await this.db.query<{ count: string }>(
      `
        SELECT COUNT(*)::text AS count
        FROM leads
        WHERE tenant_id = $1
      `,
      [tenantId],
    );

    return Number(result.rows[0]?.count ?? 0);
  }

  public async countSince(
    tenantId: UUID,
    since: Date,
  ): Promise<number> {
    const result = await this.db.query<{ count: string }>(
      `
        SELECT COUNT(*)::text AS count
        FROM leads
        WHERE tenant_id = $1
          AND created_at >= $2
      `,
      [tenantId, since.toISOString()],
    );

    return Number(result.rows[0]?.count ?? 0);
  }
}

export default LeadRepository;

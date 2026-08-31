/**
 * @file database/repositories/audit-log-repository.ts
 * @description PostgreSQL repository for immutable GrowthAI audit logs.
 *
 * Audit logs are append-only.
 * Tenant filtering is enforced for tenant-scoped reads.
 */

import "server-only";

import type {
  DatabaseAdapter,
  QueryOptions,
  QueryResult,
  UUID,
  Json,
} from "../types";
import { Repository } from "../repository";

export interface AuditLogRecord {
  readonly id: UUID;
  readonly tenant_id: UUID | null;
  readonly user_id: UUID | null;
  readonly event: string;
  readonly request_id: string | null;
  readonly ip_address: string | null;
  readonly user_agent: string | null;
  readonly metadata: Json;
  readonly created_at: string;
}

export interface CreateAuditLogInput {
  readonly tenant_id?: UUID | null;
  readonly user_id?: UUID | null;
  readonly event: string;
  readonly request_id?: string | null;
  readonly ip_address?: string | null;
  readonly user_agent?: string | null;
  readonly metadata?: Json;
}

export interface AuditLogQueryOptions extends QueryOptions {
  readonly tenantId: UUID;
  readonly userId?: UUID;
  readonly event?: string;
}

export class AuditLogRepository extends Repository<
  AuditLogRecord,
  CreateAuditLogInput,
  never
> {
  public constructor(db: DatabaseAdapter) {
    super(db, "audit_logs");
  }

  public async findById(
    id: UUID,
    tenantId: UUID,
  ): Promise<AuditLogRecord | null> {
    const result = await this.db.query<AuditLogRecord>(
      `
        SELECT
          id,
          tenant_id,
          user_id,
          event,
          request_id,
          ip_address::text AS ip_address,
          user_agent,
          metadata,
          created_at
        FROM audit_logs
        WHERE id = $1
          AND tenant_id = $2
        LIMIT 1
      `,
      [id, tenantId],
    );

    return result.rows[0] ?? null;
  }

  public async findMany(
    options: AuditLogQueryOptions,
  ): Promise<QueryResult<AuditLogRecord>> {
    const limit = Math.min(
      Math.max(Math.floor(options.limit ?? 50), 1),
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

    if (options.userId) {
      params.push(options.userId);
      conditions.push(`user_id = $${params.length}`);
    }

    if (options.event) {
      params.push(options.event);
      conditions.push(`event = $${params.length}`);
    }

    const limitParam = params.length + 1;
    const offsetParam = params.length + 2;

    const result = await this.db.query<AuditLogRecord>(
      `
        SELECT
          id,
          tenant_id,
          user_id,
          event,
          request_id,
          ip_address::text AS ip_address,
          user_agent,
          metadata,
          created_at
        FROM audit_logs
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
        FROM audit_logs
        WHERE ${conditions.join(" AND ")}
      `,
      params,
    );

    return {
      rows: result.rows,
      count: Number(countResult.rows[0]?.count ?? 0),
    };
  }

  public async create(
    input: CreateAuditLogInput,
  ): Promise<AuditLogRecord> {
    const event = input.event.trim();

    if (!event) {
      throw new Error("Audit event is required.");
    }

    if (event.length > 64) {
      throw new Error(
        "Audit event must not exceed 64 characters.",
      );
    }

    if (input.user_id && !input.tenant_id) {
      throw new Error(
        "Tenant ID is required when user ID is provided.",
      );
    }

    const result = await this.db.query<AuditLogRecord>(
      `
        INSERT INTO audit_logs (
          tenant_id,
          user_id,
          event,
          request_id,
          ip_address,
          user_agent,
          metadata
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7::jsonb
        )
        RETURNING
          id,
          tenant_id,
          user_id,
          event,
          request_id,
          ip_address::text AS ip_address,
          user_agent,
          metadata,
          created_at
      `,
      [
        input.tenant_id ?? null,
        input.user_id ?? null,
        event,
        input.request_id ?? null,
        input.ip_address ?? null,
        input.user_agent ?? null,
        JSON.stringify(input.metadata ?? {}),
      ],
    );

    const record = result.rows[0];

    if (!record) {
      throw new Error("Failed to create audit log.");
    }

    return record;
  }

  public async update(): Promise<never> {
    throw new Error(
      "Audit logs are immutable and cannot be updated.",
    );
  }

  public async delete(): Promise<void> {
    throw new Error(
      "Audit logs cannot be deleted through the repository.",
    );
  }
}

export default AuditLogRepository;

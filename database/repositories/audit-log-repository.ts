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
  readonly tenantId?: UUID;
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
  ): Promise<AuditLogRecord | null> {
    const result =
      await this.db.query<AuditLogRecord>(
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
          LIMIT 1
        `,
        [id],
      );

    return result.rows[0] ?? null;
  }

  public async findMany(
    options: AuditLogQueryOptions = {},
  ): Promise<QueryResult<AuditLogRecord>> {
    const limit = Math.min(
      Math.max(Math.floor(options.limit ?? 50), 1),
      100,
    );

    const offset = Math.max(
      Math.floor(options.offset ?? 0),
      0,
    );

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (options.tenantId) {
      params.push(options.tenantId);
      conditions.push(
        `tenant_id = $${params.length}`,
      );
    }

    if (options.userId) {
      params.push(options.userId);
      conditions.push(
        `user_id = $${params.length}`,
      );
    }

    if (options.event) {
      params.push(options.event);
      conditions.push(
        `event = $${params.length}`,
      );
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const limitParam = params.length + 1;
    const offsetParam = params.length + 2;

    const result =
      await this.db.query<AuditLogRecord>(
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
          ${whereClause}
          ORDER BY created_at DESC
          LIMIT $${limitParam}
          OFFSET $${offsetParam}
        `,
        [...params, limit, offset],
      );

    const countResult =
      await this.db.query<{ count: string }>(
        `
          SELECT COUNT(*)::text AS count
          FROM audit_logs
          ${whereClause}
        `,
        params,
      );

    return {
      rows: result.rows,
      count: Number(
        countResult.rows[0]?.count ?? 0,
      ),
    };
  }

  public async create(
    input: CreateAuditLogInput,
  ): Promise<AuditLogRecord> {
    const event = input.event.trim();

    if (!event) {
      throw new Error(
        "Audit event is required.",
      );
    }

    if (event.length > 64) {
      throw new Error(
        "Audit event must not exceed 64 characters.",
      );
    }

    const result =
      await this.db.query<AuditLogRecord>(
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
          JSON.stringify(
            input.metadata ?? {},
          ),
        ],
      );

    const record = result.rows[0];

    if (!record) {
      throw new Error(
        "Failed to create audit log.",
      );
    }

    return record;
  }

  /**
   * Audit logs are immutable.
   */
  public async update(): Promise<never> {
    throw new Error(
      "Audit logs are immutable and cannot be updated.",
    );
  }

  /**
   * Audit logs are retained for security/audit purposes.
   */
  public async delete(): Promise<void> {
    throw new Error(
      "Audit logs cannot be deleted through the repository.",
    );
  }
}

export default AuditLogRepository;

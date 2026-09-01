/**
 * @file database/repositories/audit-log-repository.ts
 * @description Repository pattern implementation for Audit Log records.
 */

export type UUID = string;

export interface AuditLogRecord {
  id: UUID;
  tenantId: UUID;
  userId?: UUID;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface CreateAuditLogInput {
  tenantId: UUID;
  userId?: UUID;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}

export interface Repository<T, TCreateInput, TUpdateInput = never> {
  findById(id: string): Promise<T | null>;
  create(input: TCreateInput): Promise<T>;
  findAll?(filter?: Record<string, unknown>): Promise<T[]>;
}

export class AuditLogRepository implements Repository<AuditLogRecord, CreateAuditLogInput, never> {
  private logs: AuditLogRecord[] = [];

  /**
   * Find audit log entry by ID.
   * tenantId is optional to satisfy base Repository interface.
   */
  public async findById(
    id: UUID,
    tenantId?: UUID
  ): Promise<AuditLogRecord | null> {
    const record = this.logs.find((log) => {
      if (tenantId) {
        return log.id === id && log.tenantId === tenantId;
      }
      return log.id === id;
    });

    return record || null;
  }

  /**
   * Create a new audit log record.
   */
  public async create(input: CreateAuditLogInput): Promise<AuditLogRecord> {
    const record: AuditLogRecord = {
      id: crypto.randomUUID(),
      tenantId: input.tenantId,
      userId: input.userId,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      metadata: input.metadata,
      createdAt: new Date(),
    };

    this.logs.push(record);
    return record;
  }

  /**
   * List all logs for a specific tenant.
   */
  public async findByTenantId(tenantId: UUID): Promise<AuditLogRecord[]> {
    return this.logs.filter((log) => log.tenantId === tenantId);
  }
}

export const auditLogRepository = new AuditLogRepository();
export default auditLogRepository;

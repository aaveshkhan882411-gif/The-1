import { AuditLogRepository } from "../database/repositories/audit-log-repository";
import { DatabaseRecord } from "../database/types";

export interface CreateAuditLogInput {
  tenant_id: string;
  user_id?: string | null;
  event: string;
  request_id?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  metadata?: Record<string, unknown>;
}

export class AuditLogService {
  private auditRepo: AuditLogRepository;

  constructor(auditRepo?: AuditLogRepository) {
    this.auditRepo = auditRepo || new AuditLogRepository();
  }

  async logEvent(input: CreateAuditLogInput): Promise<DatabaseRecord> {
    if (!input.tenant_id || !input.event) {
      throw new Error("Tenant ID and event name are required for audit logging.");
    }

    return await this.auditRepo.create({
      tenant_id: input.tenant_id,
      user_id: input.user_id || null,
      event: input.event,
      request_id: input.request_id || null,
      ip_address: input.ip_address || null,
      user_agent: input.user_agent || null,
      metadata: JSON.stringify(input.metadata || {}),
      created_at: new Date().toISOString()
    });
  }

  async listAuditLogs(
    tenantId: string,
    filters?: { user_id?: string; event?: string },
    limit = 50,
    offset = 0
  ): Promise<DatabaseRecord[]> {
    if (!tenantId) {
      throw new Error("Tenant ID is required.");
    }

    const criteria: Record<string, unknown> = { tenant_id: tenantId };
    if (filters?.user_id) criteria.user_id = filters.user_id;
    if (filters?.event) criteria.event = filters.event;

    return await this.auditRepo.findMany(criteria, { limit, offset });
  }
}


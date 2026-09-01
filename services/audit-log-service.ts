import * as AuditRepoModule from "../database/repositories/audit-log-repository";
import { DatabaseRecord } from "../database/types";

// Get constructor or instance whether it is default or named export
const RepoClass: any =
  (AuditRepoModule as any).AuditLogRepository ||
  (AuditRepoModule as any).default ||
  AuditRepoModule;

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
  private auditRepo: any;

  constructor(auditRepo?: any) {
    if (auditRepo) {
      this.auditRepo = auditRepo;
    } else if (typeof RepoClass === "function") {
      this.auditRepo = new RepoClass();
    } else {
      this.auditRepo = RepoClass;
    }
  }

  async logEvent(input: CreateAuditLogInput): Promise<DatabaseRecord> {
    if (!input.tenant_id || !input.event) {
      throw new Error("Tenant ID and event name are required for audit logging.");
    }

    const payload = {
      tenant_id: input.tenant_id,
      user_id: input.user_id || null,
      event: input.event,
      request_id: input.request_id || null,
      ip_address: input.ip_address || null,
      user_agent: input.user_agent || null,
      metadata: JSON.stringify(input.metadata || {}),
      created_at: new Date().toISOString(),
    };

    const created = await this.auditRepo.create(payload);

    return {
      id: (created as any)?.id || crypto.randomUUID(),
      created_at: payload.created_at,
      ...created,
    } as DatabaseRecord;
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

    const results = await this.auditRepo.findMany(criteria, { limit, offset });
    return (results || []) as DatabaseRecord[];
  }
}

export default AuditLogService;

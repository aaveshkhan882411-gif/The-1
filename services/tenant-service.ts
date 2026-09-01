import * as TenantRepoModule from "../database/repositories/tenant-repository";
import { DatabaseRecord } from "../database/types";

// Get constructor or instance whether it is default or named export
const RepoClass: any =
  (TenantRepoModule as any).TenantRepository ||
  (TenantRepoModule as any).default ||
  TenantRepoModule;

export interface CreateTenantInput {
  name: string;
  slug: string;
  plan?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateTenantInput {
  name?: string;
  status?: "active" | "suspended" | "deactivated";
  metadata?: Record<string, unknown>;
}

export class TenantService {
  private tenantRepo: any;

  constructor(tenantRepo?: any) {
    if (tenantRepo) {
      this.tenantRepo = tenantRepo;
    } else if (typeof RepoClass === "function") {
      try {
        this.tenantRepo = new RepoClass();
      } catch {
        this.tenantRepo = RepoClass;
      }
    } else {
      this.tenantRepo = RepoClass;
    }
  }

  async getTenantById(tenantId: string): Promise<DatabaseRecord | null> {
    if (!tenantId) {
      throw new Error("Tenant ID is required.");
    }
    const result = await this.tenantRepo.findById(tenantId);
    return (result || null) as DatabaseRecord | null;
  }

  async getTenantBySlug(slug: string): Promise<DatabaseRecord | null> {
    if (!slug) {
      throw new Error("Tenant slug is required.");
    }
    const result = await this.tenantRepo.findBySlug(slug);
    return (result || null) as DatabaseRecord | null;
  }

  async createTenant(input: CreateTenantInput): Promise<DatabaseRecord> {
    if (!input.name || !input.slug) {
      throw new Error("Tenant name and slug are required.");
    }

    const existing = await this.tenantRepo.findBySlug(input.slug);
    if (existing) {
      throw new Error(`Tenant with slug '${input.slug}' already exists.`);
    }

    const payload = {
      name: input.name,
      slug: input.slug,
      status: "active",
      plan: input.plan || "standard",
      metadata: input.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const created = await this.tenantRepo.create(payload);
    return created as DatabaseRecord;
  }

  async updateTenant(tenantId: string, input: UpdateTenantInput): Promise<DatabaseRecord | null> {
    if (!tenantId) {
      throw new Error("Tenant ID is required.");
    }

    const tenant = await this.tenantRepo.findById(tenantId);
    if (!tenant) {
      throw new Error("Tenant not found.");
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
      updatedAt: new Date()
    };

    if (input.name !== undefined) updateData.name = input.name;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.metadata !== undefined) updateData.metadata = input.metadata;

    const updated = await this.tenantRepo.update(tenantId, updateData);
    return (updated || null) as DatabaseRecord | null;
  }

  async deactivateTenant(tenantId: string): Promise<DatabaseRecord | null> {
    return await this.updateTenant(tenantId, { status: "deactivated" });
  }
}

export default TenantService;

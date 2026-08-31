import { TenantRepository } from "../database/repositories/tenant-repository";
import { DatabaseRecord } from "../database/types";

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
  private tenantRepo: TenantRepository;

  constructor(tenantRepo?: TenantRepository) {
    this.tenantRepo = tenantRepo || new TenantRepository();
  }

  async getTenantById(tenantId: string): Promise<DatabaseRecord | null> {
    if (!tenantId) {
      throw new Error("Tenant ID is required.");
    }
    return await this.tenantRepo.findById(tenantId);
  }

  async getTenantBySlug(slug: string): Promise<DatabaseRecord | null> {
    if (!slug) {
      throw new Error("Tenant slug is required.");
    }
    return await this.tenantRepo.findBySlug(slug);
  }

  async createTenant(input: CreateTenantInput): Promise<DatabaseRecord> {
    if (!input.name || !input.slug) {
      throw new Error("Tenant name and slug are required.");
    }

    const existing = await this.tenantRepo.findBySlug(input.slug);
    if (existing) {
      throw new Error(`Tenant with slug '${input.slug}' already exists.`);
    }

    return await this.tenantRepo.create({
      name: input.name,
      slug: input.slug,
      status: "active",
      plan: input.plan || "standard",
      metadata: JSON.stringify(input.metadata || {}),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
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
      updated_at: new Date().toISOString()
    };

    if (input.name !== undefined) updateData.name = input.name;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.metadata !== undefined) updateData.metadata = JSON.stringify(input.metadata);

    return await this.tenantRepo.update(tenantId, updateData);
  }

  async deactivateTenant(tenantId: string): Promise<DatabaseRecord | null> {
    return await this.updateTenant(tenantId, { status: "deactivated" });
  }
}


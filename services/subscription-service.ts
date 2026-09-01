import * as SubRepoModule from "../database/repositories/subscription-repository";
import { DatabaseRecord } from "../database/types";

// Get constructor or instance whether it is default or named export
const RepoClass: any =
  (SubRepoModule as any).SubscriptionRepository ||
  (SubRepoModule as any).default ||
  SubRepoModule;

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "cancelled"
  | "expired";

export type SubscriptionPlan = "standard" | "premium" | "enterprise";

export interface CreateSubscriptionInput {
  tenant_id: string;
  plan: SubscriptionPlan;
  provider: "paypal" | "stripe" | "manual";
  external_id: string;
  status?: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateSubscriptionInput {
  status?: SubscriptionStatus;
  plan?: SubscriptionPlan;
  current_period_start?: string;
  current_period_end?: string;
  metadata?: Record<string, unknown>;
}

export class SubscriptionService {
  private subscriptionRepo: any;

  constructor(subscriptionRepo?: any) {
    if (subscriptionRepo) {
      this.subscriptionRepo = subscriptionRepo;
    } else if (typeof RepoClass === "function") {
      this.subscriptionRepo = new RepoClass();
    } else {
      this.subscriptionRepo = RepoClass;
    }
  }

  async getSubscriptionById(tenantId: string, subscriptionId: string): Promise<DatabaseRecord | null> {
    if (!tenantId || !subscriptionId) {
      throw new Error("Tenant ID and Subscription ID are required.");
    }
    const sub = await this.subscriptionRepo.findById(subscriptionId);
    if (!sub) {
      return null;
    }

    const subTenantId = (sub as any).tenantId || (sub as any).tenant_id;
    if (subTenantId !== tenantId) {
      return null;
    }

    return sub as DatabaseRecord;
  }

  async getActiveSubscription(tenantId: string): Promise<DatabaseRecord | null> {
    if (!tenantId) {
      throw new Error("Tenant ID is required.");
    }
    const result = await this.subscriptionRepo.findActiveByTenant(tenantId);
    return (result || null) as DatabaseRecord | null;
  }

  async getByExternalId(externalId: string): Promise<DatabaseRecord | null> {
    if (!externalId) {
      throw new Error("External ID is required.");
    }
    const result = await this.subscriptionRepo.findByExternalId(externalId);
    return (result || null) as DatabaseRecord | null;
  }

  async createSubscription(input: CreateSubscriptionInput): Promise<DatabaseRecord> {
    if (!input.tenant_id || !input.plan || !input.external_id || !input.provider) {
      throw new Error("Missing required subscription parameters.");
    }

    const existing = await this.subscriptionRepo.findByExternalId(input.external_id);
    if (existing) {
      throw new Error(`Subscription with external ID '${input.external_id}' already exists.`);
    }

    const payload = {
      tenant_id: input.tenant_id,
      tenantId: input.tenant_id,
      plan: input.plan,
      provider: input.provider,
      external_id: input.external_id,
      externalId: input.external_id,
      status: input.status || "active",
      current_period_start: input.current_period_start,
      currentPeriodStart: input.current_period_start,
      current_period_end: input.current_period_end,
      currentPeriodEnd: input.current_period_end,
      metadata: input.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const created = await this.subscriptionRepo.create(payload);
    return created as DatabaseRecord;
  }

  async updateSubscription(
    subscriptionId: string,
    input: UpdateSubscriptionInput
  ): Promise<DatabaseRecord | null> {
    if (!subscriptionId) {
      throw new Error("Subscription ID is required.");
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
      updatedAt: new Date()
    };

    if (input.status !== undefined) updateData.status = input.status;
    if (input.plan !== undefined) updateData.plan = input.plan;
    if (input.current_period_start !== undefined) {
      updateData.current_period_start = input.current_period_start;
      updateData.currentPeriodStart = input.current_period_start;
    }
    if (input.current_period_end !== undefined) {
      updateData.current_period_end = input.current_period_end;
      updateData.currentPeriodEnd = input.current_period_end;
    }
    if (input.metadata !== undefined) {
      updateData.metadata = input.metadata;
    }

    const updated = await this.subscriptionRepo.update(subscriptionId, updateData);
    return (updated || null) as DatabaseRecord | null;
  }
}

export default SubscriptionService;

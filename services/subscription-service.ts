import { SubscriptionRepository } from "../database/repositories/subscription-repository";
import { DatabaseRecord } from "../database/types";

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
  private subscriptionRepo: SubscriptionRepository;

  constructor(subscriptionRepo?: SubscriptionRepository) {
    this.subscriptionRepo = subscriptionRepo || new SubscriptionRepository();
  }

  async getSubscriptionById(tenantId: string, subscriptionId: string): Promise<DatabaseRecord | null> {
    if (!tenantId || !subscriptionId) {
      throw new Error("Tenant ID and Subscription ID are required.");
    }
    const sub = await this.subscriptionRepo.findById(subscriptionId);
    if (!sub || sub.tenant_id !== tenantId) {
      return null;
    }
    return sub;
  }

  async getActiveSubscription(tenantId: string): Promise<DatabaseRecord | null> {
    if (!tenantId) {
      throw new Error("Tenant ID is required.");
    }
    return await this.subscriptionRepo.findActiveByTenant(tenantId);
  }

  async getByExternalId(externalId: string): Promise<DatabaseRecord | null> {
    if (!externalId) {
      throw new Error("External ID is required.");
    }
    return await this.subscriptionRepo.findByExternalId(externalId);
  }

  async createSubscription(input: CreateSubscriptionInput): Promise<DatabaseRecord> {
    if (!input.tenant_id || !input.plan || !input.external_id || !input.provider) {
      throw new Error("Missing required subscription parameters.");
    }

    const existing = await this.subscriptionRepo.findByExternalId(input.external_id);
    if (existing) {
      throw new Error(`Subscription with external ID '${input.external_id}' already exists.`);
    }

    return await this.subscriptionRepo.create({
      tenant_id: input.tenant_id,
      plan: input.plan,
      provider: input.provider,
      external_id: input.external_id,
      status: input.status || "active",
      current_period_start: input.current_period_start,
      current_period_end: input.current_period_end,
      metadata: JSON.stringify(input.metadata || {}),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  async updateSubscription(
    subscriptionId: string,
    input: UpdateSubscriptionInput
  ): Promise<DatabaseRecord | null> {
    if (!subscriptionId) {
      throw new Error("Subscription ID is required.");
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };

    if (input.status !== undefined) updateData.status = input.status;
    if (input.plan !== undefined) updateData.plan = input.plan;
    if (input.current_period_start !== undefined) updateData.current_period_start = input.current_period_start;
    if (input.current_period_end !== undefined) updateData.current_period_end = input.current_period_end;
    if (input.metadata !== undefined) updateData.metadata = JSON.stringify(input.metadata);

    return await this.subscriptionRepo.update(subscriptionId, updateData);
  }
}


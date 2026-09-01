/**
 * @file database/repositories/subscription-repository.ts
 * @description Repository pattern implementation for Subscriptions.
 */

export type UUID = string;

export type SubscriptionPlan = 'free' | 'starter' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';

export interface SubscriptionRecord {
  id: UUID;
  tenantId: UUID;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionInput {
  tenantId: UUID;
  plan: SubscriptionPlan;
  status?: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd?: boolean;
  metadata?: Record<string, unknown>;
}

export interface UpdateSubscriptionInput {
  plan?: SubscriptionPlan;
  status?: SubscriptionStatus;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  metadata?: Record<string, unknown>;
}

export interface Repository<T, TCreateInput, TUpdateInput> {
  findById(id: string): Promise<T | null>;
  create(input: TCreateInput): Promise<T>;
  update?(id: string, input: TUpdateInput): Promise<T | null>;
  delete?(id: string): Promise<boolean>;
}

export class SubscriptionRepository implements Repository<SubscriptionRecord, CreateSubscriptionInput, UpdateSubscriptionInput> {
  private subscriptions: SubscriptionRecord[] = [];

  /**
   * Find subscription by ID.
   * tenantId is optional to satisfy base Repository interface.
   */
  public async findById(
    id: UUID,
    tenantId?: UUID
  ): Promise<SubscriptionRecord | null> {
    const record = this.subscriptions.find((sub) => {
      if (tenantId) {
        return sub.id === id && sub.tenantId === tenantId;
      }
      return sub.id === id;
    });

    return record || null;
  }

  /**
   * Create a new subscription record.
   */
  public async create(input: CreateSubscriptionInput): Promise<SubscriptionRecord> {
    const record: SubscriptionRecord = {
      id: crypto.randomUUID(),
      tenantId: input.tenantId,
      plan: input.plan,
      status: input.status || 'active',
      currentPeriodStart: input.currentPeriodStart,
      currentPeriodEnd: input.currentPeriodEnd,
      cancelAtPeriodEnd: input.cancelAtPeriodEnd ?? false,
      metadata: input.metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.subscriptions.push(record);
    return record;
  }

  /**
   * Update an existing subscription.
   */
  public async update(
    id: UUID,
    input: UpdateSubscriptionInput
  ): Promise<SubscriptionRecord | null> {
    const index = this.subscriptions.findIndex((sub) => sub.id === id);
    if (index === -1) return null;

    const existing = this.subscriptions[index];
    const updated: SubscriptionRecord = {
      ...existing,
      ...input,
      updatedAt: new Date(),
    };

    this.subscriptions[index] = updated;
    return updated;
  }

  /**
   * Get subscription by tenant ID.
   */
  public async findByTenantId(tenantId: UUID): Promise<SubscriptionRecord | null> {
    const record = this.subscriptions.find((sub) => sub.tenantId === tenantId);
    return record || null;
  }
}

export const subscriptionRepository = new SubscriptionRepository();
export default subscriptionRepository;

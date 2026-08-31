/**
 * @file database/repositories/subscription-repository.ts
 * @description PostgreSQL repository for GrowthAI subscriptions.
 *
 * Tenant isolation is enforced for tenant-scoped operations.
 * External payment-provider IDs are stored for future PayPal/webhook use.
 */

import "server-only";

import type {
  DatabaseAdapter,
  QueryOptions,
  QueryResult,
  UUID,
} from "../types";
import { Repository } from "../repository";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "cancelled"
  | "expired";

export interface SubscriptionRecord {
  readonly id: UUID;
  readonly tenant_id: UUID;
  readonly plan: string;
  readonly status: SubscriptionStatus;
  readonly provider: string;
  readonly external_id: string | null;
  readonly current_period_start: string | null;
  readonly current_period_end: string | null;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface CreateSubscriptionInput {
  readonly tenant_id: UUID;
  readonly plan: string;
  readonly status?: SubscriptionStatus;
  readonly provider: string;
  readonly external_id?: string | null;
  readonly current_period_start?: string | null;
  readonly current_period_end?: string | null;
}

export interface UpdateSubscriptionInput {
  readonly plan?: string;
  readonly status?: SubscriptionStatus;
  readonly provider?: string;
  readonly external_id?: string | null;
  readonly current_period_start?: string | null;
  readonly current_period_end?: string | null;
}

export interface SubscriptionQueryOptions
  extends QueryOptions {
  readonly tenantId?: UUID;
  readonly status?: SubscriptionStatus;
  readonly provider?: string;
}

export class SubscriptionRepository extends Repository<
  SubscriptionRecord,
  CreateSubscriptionInput,
  UpdateSubscriptionInput
> {
  public constructor(db: DatabaseAdapter) {
    super(db, "subscriptions");
  }

  /**
   * Finds a subscription by ID.
   *
   * When tenantId is supplied, the subscription
   * must belong to that tenant.
   */
  public async findById(
    id: UUID,
    tenantId?: UUID,
  ): Promise<SubscriptionRecord | null> {
    const result =
      await this.db.query<SubscriptionRecord>(
        `
          SELECT
            id,
            tenant_id,
            plan,
            status,
            provider,
            external_id,
            current_period_start,
            current_period_end,
            created_at,
            updated_at
          FROM subscriptions
          WHERE id = $1
            AND (
              $2::uuid IS NULL
              OR tenant_id = $2
            )
          LIMIT 1
        `,
        [id, tenantId ?? null],
      );

    return result.rows[0] ?? null;
  }

  /**
   * Finds a subscription using its payment-provider
   * external ID.
   */
  public async findByExternalId(
    provider: string,
    externalId: string,
  ): Promise<SubscriptionRecord | null> {
    const result =
      await this.db.query<SubscriptionRecord>(
        `
          SELECT
            id,
            tenant_id,
            plan,
            status,
            provider,
            external_id,
            current_period_start,
            current_period_end,
            created_at,
            updated_at
          FROM subscriptions
          WHERE provider = $1
            AND external_id = $2
          LIMIT 1
        `,
        [provider, externalId],
      );

    return result.rows[0] ?? null;
  }

  /**
   * Returns subscriptions belonging to a tenant.
   */
  public async findMany(
    options: SubscriptionQueryOptions = {},
  ): Promise<QueryResult<SubscriptionRecord>> {
    const limit = Math.min(
      Math.max(
        Math.floor(options.limit ?? 25),
        1,
      ),
      100,
    );

    const offset = Math.max(
      Math.floor(options.offset ?? 0),
      0,
    );

    if (!options.tenantId) {
      return {
        rows: [],
        count: 0,
      };
    }

    const params: unknown[] = [
      options.tenantId,
    ];

    const conditions: string[] = [
      "tenant_id = $1",
    ];

    if (options.status) {
      params.push(options.status);
      conditions.push(
        `status = $${params.length}`,
      );
    }

    if (options.provider) {
      params.push(options.provider);
      conditions.push(
        `provider = $${params.length}`,
      );
    }

    const limitParam = params.length + 1;
    const offsetParam = params.length + 2;

    params.push(limit, offset);

    const result =
      await this.db.query<SubscriptionRecord>(
        `
          SELECT
            id,
            tenant_id,
            plan,
            status,
            provider,
            external_id,
            current_period_start,
            current_period_end,
            created_at,
            updated_at
          FROM subscriptions
          WHERE ${conditions.join(" AND ")}
          ORDER BY created_at DESC
          LIMIT $${limitParam}
          OFFSET $${offsetParam}
        `,
        params,
      );

    const countParams = params.slice(
      0,
      params.length - 2,
    );

    const countResult =
      await this.db.query<{ count: string }>(
        `
          SELECT COUNT(*)::text AS count
          FROM subscriptions
          WHERE ${conditions.join(" AND ")}
        `,
        countParams,
      );

    return {
      rows: result.rows,
      count: Number(
        countResult.rows[0]?.count ?? 0,
      ),
    };
  }

  /**
   * Creates a subscription.
   */
  public async create(
    input: CreateSubscriptionInput,
  ): Promise<SubscriptionRecord> {
    const plan = input.plan.trim();
    const provider = input.provider.trim();

    if (!input.tenant_id) {
      throw new Error("Tenant ID is required.");
    }

    if (!plan) {
      throw new Error("Subscription plan is required.");
    }

    if (!provider) {
      throw new Error(
        "Subscription provider is required.",
      );
    }

    const result =
      await this.db.query<SubscriptionRecord>(
        `
          INSERT INTO subscriptions (
            tenant_id,
            plan,
            status,
            provider,
            external_id,
            current_period_start,
            current_period_end
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7
          )
          RETURNING
            id,
            tenant_id,
            plan,
            status,
            provider,
            external_id,
            current_period_start,
            current_period_end,
            created_at,
            updated_at
        `,
        [
          input.tenant_id,
          plan,
          input.status ?? "active",
          provider,
          input.external_id ?? null,
          input.current_period_start ?? null,
          input.current_period_end ?? null,
        ],
      );

    const subscription = result.rows[0];

    if (!subscription) {
      throw new Error(
        "Failed to create subscription.",
      );
    }

    return subscription;
  }

  /**
   * Updates a subscription.
   *
   * tenant_id remains immutable.
   */
  public async update(
    id: UUID,
    input: UpdateSubscriptionInput,
  ): Promise<SubscriptionRecord> {
    const existing = await this.findById(id);

    if (!existing) {
      throw new Error(
        "Subscription not found.",
      );
    }

    const plan =
      input.plan !== undefined
        ? input.plan.trim()
        : existing.plan;

    const provider =
      input.provider !== undefined
        ? input.provider.trim()
        : existing.provider;

    if (!plan) {
      throw new Error(
        "Subscription plan is required.",
      );
    }

    if (!provider) {
      throw new Error(
        "Subscription provider is required.",
      );
    }

    const result =
      await this.db.query<SubscriptionRecord>(
        `
          UPDATE subscriptions
          SET
            plan = $1,
            status = $2,
            provider = $3,
            external_id = $4,
            current_period_start = $5,
            current_period_end = $6
          WHERE id = $7
          RETURNING
            id,
            tenant_id,
            plan,
            status,
            provider,
            external_id,
            current_period_start,
            current_period_end,
            created_at,
            updated_at
        `,
        [
          plan,
          input.status ?? existing.status,
          provider,
          input.external_id !== undefined
            ? input.external_id
            : existing.external_id,
          input.current_period_start !== undefined
            ? input.current_period_start
            : existing.current_period_start,
          input.current_period_end !== undefined
            ? input.current_period_end
            : existing.current_period_end,
          id,
        ],
      );

    const subscription = result.rows[0];

    if (!subscription) {
      throw new Error(
        "Failed to update subscription.",
      );
    }

    return subscription;
  }

  /**
   * Deletes a subscription.
   */
  public async delete(
    id: UUID,
  ): Promise<void> {
    const result = await this.db.execute(
      `
        DELETE FROM subscriptions
        WHERE id = $1
      `,
      [id],
    );

    if (result.affectedRows === 0) {
      throw new Error(
        "Subscription not found.",
      );
    }
  }

  /**
   * Returns the active subscription for a tenant.
   *
   * If multiple active records somehow exist,
   * the newest one is returned.
   */
  public async findActiveByTenant(
    tenantId: UUID,
  ): Promise<SubscriptionRecord | null> {
    const result =
      await this.db.query<SubscriptionRecord>(
        `
          SELECT
            id,
            tenant_id,
            plan,
            status,
            provider,
            external_id,
            current_period_start,
            current_period_end,
            created_at,
            updated_at
          FROM subscriptions
          WHERE tenant_id = $1
            AND status IN (
              'trialing',
              'active'
            )
          ORDER BY created_at DESC
          LIMIT 1
        `,
        [tenantId],
      );

    return result.rows[0] ?? null;
  }
}

export default SubscriptionRepository;

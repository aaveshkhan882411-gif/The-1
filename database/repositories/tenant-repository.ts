/**
 * @file database/repositories/tenant-repository.ts
 * @description PostgreSQL repository for GrowthAI tenants.
 *
 * This repository contains tenant-specific database operations.
 * Business logic should use this repository instead of executing
 * tenant SQL directly.
 */

import "server-only";

import type {
  DatabaseAdapter,
  QueryOptions,
  QueryResult,
  UUID,
} from "../types";
import { Repository } from "../repository";

export interface TenantRecord {
  readonly id: UUID;
  readonly name: string;
  readonly slug: string;
  readonly status: "active" | "suspended" | "deactivated";
  readonly created_at: string;
  readonly updated_at: string;
}

export interface CreateTenantInput {
  readonly name: string;
  readonly slug: string;
  readonly status?: "active" | "suspended" | "deactivated";
}

export interface UpdateTenantInput {
  readonly name?: string;
  readonly slug?: string;
  readonly status?: "active" | "suspended" | "deactivated";
}

export class TenantRepository extends Repository<
  TenantRecord,
  CreateTenantInput,
  UpdateTenantInput
> {
  public constructor(db: DatabaseAdapter) {
    super(db, "tenants");
  }

  /**
   * Finds a tenant by its UUID.
   */
  public async findById(
    id: UUID,
  ): Promise<TenantRecord | null> {
    const result = await this.db.query<TenantRecord>(
      `
        SELECT
          id,
          name,
          slug,
          status,
          created_at,
          updated_at
        FROM tenants
        WHERE id = $1
        LIMIT 1
      `,
      [id],
    );

    return result.rows[0] ?? null;
  }

  /**
   * Finds a tenant by its unique slug.
   */
  public async findBySlug(
    slug: string,
  ): Promise<TenantRecord | null> {
    const normalizedSlug = slug.trim().toLowerCase();

    if (!normalizedSlug) {
      return null;
    }

    const result = await this.db.query<TenantRecord>(
      `
        SELECT
          id,
          name,
          slug,
          status,
          created_at,
          updated_at
        FROM tenants
        WHERE slug = $1
        LIMIT 1
      `,
      [normalizedSlug],
    );

    return result.rows[0] ?? null;
  }

  /**
   * Returns a paginated list of tenants.
   */
  public async findMany(
    options: QueryOptions = {},
  ): Promise<QueryResult<TenantRecord>> {
    const limit = Math.min(
      Math.max(Math.floor(options.limit ?? 25), 1),
      100,
    );

    const offset = Math.max(
      Math.floor(options.offset ?? 0),
      0,
    );

    const result = await this.db.query<TenantRecord>(
      `
        SELECT
          id,
          name,
          slug,
          status,
          created_at,
          updated_at
        FROM tenants
        ORDER BY created_at DESC
        LIMIT $1
        OFFSET $2
      `,
      [limit, offset],
    );

    const countResult = await this.db.query<{ count: string }>(
      `
        SELECT COUNT(*)::text AS count
        FROM tenants
      `,
    );

    return {
      rows: result.rows,
      count: Number(countResult.rows[0]?.count ?? 0),
    };
  }

  /**
   * Creates a new tenant.
   */
  public async create(
    input: CreateTenantInput,
  ): Promise<TenantRecord> {
    const name = input.name.trim();
    const slug = input.slug.trim().toLowerCase();
    const status = input.status ?? "active";

    if (!name) {
      throw new Error("Tenant name is required.");
    }

    if (!slug) {
      throw new Error("Tenant slug is required.");
    }

    const result = await this.db.query<TenantRecord>(
      `
        INSERT INTO tenants (
          name,
          slug,
          status
        )
        VALUES ($1, $2, $3)
        RETURNING
          id,
          name,
          slug,
          status,
          created_at,
          updated_at
      `,
      [name, slug, status],
    );

    const tenant = result.rows[0];

    if (!tenant) {
      throw new Error("Failed to create tenant.");
    }

    return tenant;
  }

  /**
   * Updates an existing tenant.
   */
  public async update(
    id: UUID,
    input: UpdateTenantInput,
  ): Promise<TenantRecord> {
    const existing = await this.findById(id);

    if (!existing) {
      throw new Error("Tenant not found.");
    }

    const name =
      input.name !== undefined
        ? input.name.trim()
        : existing.name;

    const slug =
      input.slug !== undefined
        ? input.slug.trim().toLowerCase()
        : existing.slug;

    const status =
      input.status ?? existing.status;

    if (!name) {
      throw new Error("Tenant name is required.");
    }

    if (!slug) {
      throw new Error("Tenant slug is required.");
    }

    const result = await this.db.query<TenantRecord>(
      `
        UPDATE tenants
        SET
          name = $1,
          slug = $2,
          status = $3
        WHERE id = $4
        RETURNING
          id,
          name,
          slug,
          status,
          created_at,
          updated_at
      `,
      [name, slug, status, id],
    );

    const tenant = result.rows[0];

    if (!tenant) {
      throw new Error("Failed to update tenant.");
    }

    return tenant;
  }

  /**
   * Deletes a tenant.
   *
   * Database foreign keys use ON DELETE CASCADE/SET NULL
   * according to the initial schema.
   */
  public async delete(id: UUID): Promise<void> {
    const result = await this.db.execute(
      `
        DELETE FROM tenants
        WHERE id = $1
      `,
      [id],
    );

    if (result.affectedRows === 0) {
      throw new Error("Tenant not found.");
    }
  }
}

export default TenantRepository;

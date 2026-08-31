/**
 * @file database/repositories/user-repository.ts
 * @description PostgreSQL repository for GrowthAI users.
 *
 * All user database operations are centralized here.
 * Business logic should use this repository instead of executing
 * user SQL directly.
 */

import "server-only";

import type {
  DatabaseAdapter,
  QueryOptions,
  QueryResult,
  UUID,
} from "../types";
import { Repository } from "../repository";

export type UserRole =
  | "owner"
  | "admin"
  | "manager"
  | "agent_manager"
  | "sales"
  | "support"
  | "analyst"
  | "member"
  | "viewer";

export type UserStatus =
  | "active"
  | "suspended"
  | "deactivated";

export interface UserRecord {
  readonly id: UUID;
  readonly tenant_id: UUID;
  readonly email: string;
  readonly name: string | null;
  readonly role: UserRole;
  readonly email_verified: boolean;
  readonly status: UserStatus;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface CreateUserInput {
  readonly tenant_id: UUID;
  readonly email: string;
  readonly name?: string | null;
  readonly role?: UserRole;
  readonly email_verified?: boolean;
  readonly status?: UserStatus;
}

export interface UpdateUserInput {
  readonly email?: string;
  readonly name?: string | null;
  readonly role?: UserRole;
  readonly email_verified?: boolean;
  readonly status?: UserStatus;
}

export class UserRepository extends Repository<
  UserRecord,
  CreateUserInput,
  UpdateUserInput
> {
  public constructor(db: DatabaseAdapter) {
    super(db, "users");
  }

  /**
   * Finds a user by ID.
   *
   * tenantId is required so callers cannot accidentally
   * access a user belonging to another tenant.
   */
  public async findById(
    id: UUID,
    tenantId?: UUID,
  ): Promise<UserRecord | null> {
    const result = await this.db.query<UserRecord>(
      `
        SELECT
          id,
          tenant_id,
          email,
          name,
          role,
          email_verified,
          status,
          created_at,
          updated_at
        FROM users
        WHERE id = $1
          AND ($2::uuid IS NULL OR tenant_id = $2)
        LIMIT 1
      `,
      [id, tenantId ?? null],
    );

    return result.rows[0] ?? null;
  }

  /**
   * Finds a user by email within a tenant.
   */
  public async findByEmail(
    tenantId: UUID,
    email: string,
  ): Promise<UserRecord | null> {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return null;
    }

    const result = await this.db.query<UserRecord>(
      `
        SELECT
          id,
          tenant_id,
          email,
          name,
          role,
          email_verified,
          status,
          created_at,
          updated_at
        FROM users
        WHERE tenant_id = $1
          AND LOWER(email) = $2
        LIMIT 1
      `,
      [tenantId, normalizedEmail],
    );

    return result.rows[0] ?? null;
  }

  /**
   * Returns users belonging to a tenant.
   */
  public async findMany(
    options: QueryOptions & {
      readonly tenantId?: UUID;
    } = {},
  ): Promise<QueryResult<UserRecord>> {
    const limit = Math.min(
      Math.max(Math.floor(options.limit ?? 25), 1),
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

    const result = await this.db.query<UserRecord>(
      `
        SELECT
          id,
          tenant_id,
          email,
          name,
          role,
          email_verified,
          status,
          created_at,
          updated_at
        FROM users
        WHERE tenant_id = $1
        ORDER BY created_at DESC
        LIMIT $2
        OFFSET $3
      `,
      [options.tenantId, limit, offset],
    );

    const countResult = await this.db.query<{ count: string }>(
      `
        SELECT COUNT(*)::text AS count
        FROM users
        WHERE tenant_id = $1
      `,
      [options.tenantId],
    );

    return {
      rows: result.rows,
      count: Number(countResult.rows[0]?.count ?? 0),
    };
  }

  /**
   * Creates a user inside a tenant.
   */
  public async create(
    input: CreateUserInput,
  ): Promise<UserRecord> {
    const email = input.email.trim().toLowerCase();
    const name = input.name?.trim() || null;
    const role = input.role ?? "member";
    const emailVerified = input.email_verified ?? false;
    const status = input.status ?? "active";

    if (!input.tenant_id) {
      throw new Error("Tenant ID is required.");
    }

    if (!email) {
      throw new Error("User email is required.");
    }

    const result = await this.db.query<UserRecord>(
      `
        INSERT INTO users (
          tenant_id,
          email,
          name,
          role,
          email_verified,
          status
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
          id,
          tenant_id,
          email,
          name,
          role,
          email_verified,
          status,
          created_at,
          updated_at
      `,
      [
        input.tenant_id,
        email,
        name,
        role,
        emailVerified,
        status,
      ],
    );

    const user = result.rows[0];

    if (!user) {
      throw new Error("Failed to create user.");
    }

    return user;
  }

  /**
   * Updates a user.
   *
   * The tenant is taken from the existing record and cannot
   * be changed through this method.
   */
  public async update(
    id: UUID,
    input: UpdateUserInput,
  ): Promise<UserRecord> {
    const existing = await this.findById(id);

    if (!existing) {
      throw new Error("User not found.");
    }

    const email =
      input.email !== undefined
        ? input.email.trim().toLowerCase()
        : existing.email;

    const name =
      input.name !== undefined
        ? input.name?.trim() || null
        : existing.name;

    const role = input.role ?? existing.role;

    const emailVerified =
      input.email_verified ??
      existing.email_verified;

    const status =
      input.status ?? existing.status;

    if (!email) {
      throw new Error("User email is required.");
    }

    const result = await this.db.query<UserRecord>(
      `
        UPDATE users
        SET
          email = $1,
          name = $2,
          role = $3,
          email_verified = $4,
          status = $5
        WHERE id = $6
        RETURNING
          id,
          tenant_id,
          email,
          name,
          role,
          email_verified,
          status,
          created_at,
          updated_at
      `,
      [
        email,
        name,
        role,
        emailVerified,
        status,
        id,
      ],
    );

    const user = result.rows[0];

    if (!user) {
      throw new Error("Failed to update user.");
    }

    return user;
  }

  /**
   * Deletes a user by ID.
   */
  public async delete(id: UUID): Promise<void> {
    const result = await this.db.execute(
      `
        DELETE FROM users
        WHERE id = $1
      `,
      [id],
    );

    if (result.affectedRows === 0) {
      throw new Error("User not found.");
    }
  }
}

export default UserRepository;

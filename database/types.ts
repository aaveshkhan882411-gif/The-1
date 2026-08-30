/**
 * @file database/types.ts
 * @description Provider-independent database contracts for GrowthAI.
 *
 * PostgreSQL is the primary relational database target.
 *
 * IMPORTANT:
 * - DatabaseRecord represents the common minimum identity/audit fields.
 * - Not every table has an updated_at column.
 * - Tables that support updates may extend UpdatedDatabaseRecord.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json | undefined };

export type UUID = string;

/**
 * Minimum common database record contract.
 *
 * Every persisted record must have:
 * - id
 * - created_at
 *
 * updated_at is intentionally NOT required here because
 * immutable records such as audit_logs do not have it.
 */
export interface DatabaseRecord {
  readonly id: UUID;
  readonly created_at: string;
}

/**
 * Record contract for tables that support modification timestamps.
 */
export interface UpdatedDatabaseRecord
  extends DatabaseRecord {
  readonly updated_at: string;
}

export interface QueryOptions {
  readonly limit?: number;
  readonly offset?: number;
}

export interface QueryResult<T> {
  readonly rows: T[];
  readonly count?: number;
}

export interface DatabaseAdapter {
  query<T>(
    sql: string,
    params?: readonly unknown[],
  ): Promise<QueryResult<T>>;

  execute(
    sql: string,
    params?: readonly unknown[],
  ): Promise<{ affectedRows: number }>;

  transaction<T>(
    callback: (
      tx: DatabaseAdapter,
    ) => Promise<T>,
  ): Promise<T>;

  close(): Promise<void>;
}

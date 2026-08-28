/**
 * @file database/types.ts
 * @description Provider-independent database contracts for GrowthAI.
 *
 * The application depends on these contracts, not on a specific
 * database provider. PostgreSQL is the primary relational target.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json | undefined };

export type UUID = string;

export interface DatabaseRecord {
  id: UUID;
  created_at: string;
  updated_at: string;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
}

export interface QueryResult<T> {
  rows: T[];
  count?: number;
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
    callback: (tx: DatabaseAdapter) => Promise<T>,
  ): Promise<T>;

  close(): Promise<void>;
}

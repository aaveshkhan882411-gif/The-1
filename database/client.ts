/**
 * @file database/connection.ts
 * @description Self-hosted PostgreSQL connection and adapter for GrowthAI.
 *
 * IMPORTANT:
 * - Uses DATABASE_URL only.
 * - No Supabase.
 * - Designed for server-side use.
 * - Uses pg connection pooling.
 */

import 'server-only';

import { Pool, type PoolClient, type QueryResultRow } from 'pg';

import type {
  DatabaseAdapter,
  QueryResult,
} from './types';

export interface DatabaseConfig {
  readonly url: string;
  readonly maxConnections?: number;
  readonly connectionTimeoutMs?: number;
  readonly idleTimeoutMs?: number;
}

/**
 * Reads and validates PostgreSQL configuration.
 */
export function getDatabaseConfig(): DatabaseConfig {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    throw new Error('Missing environment variable: DATABASE_URL');
  }

  return {
    url,
    maxConnections: 20,
    connectionTimeoutMs: 10_000,
    idleTimeoutMs: 30_000,
  };
}

/**
 * Converts PostgreSQL query results into the provider-independent
 * QueryResult contract used by the application.
 */
function mapQueryResult<T>(
  result: { rows: QueryResultRow[]; rowCount: number | null },
): QueryResult<T> {
  return {
    rows: result.rows as T[],
    count: result.rowCount ?? result.rows.length,
  };
}

/**
 * PostgreSQL adapter implementing the application's DatabaseAdapter contract.
 */
class PostgreSQLAdapter implements DatabaseAdapter {
  constructor(
    private readonly pool: Pool,
  ) {}

  async query<T>(
    sql: string,
    params: readonly unknown[] = [],
  ): Promise<QueryResult<T>> {
    const result = await this.pool.query(
      sql,
      [...params],
    );

    return mapQueryResult<T>(result);
  }

  async execute(
    sql: string,
    params: readonly unknown[] = [],
  ): Promise<{ affectedRows: number }> {
    const result = await this.pool.query(
      sql,
      [...params],
    );

    return {
      affectedRows: result.rowCount ?? 0,
    };
  }

  async transaction<T>(
    callback: (tx: DatabaseAdapter) => Promise<T>,
  ): Promise<T> {
    const client: PoolClient = await this.pool.connect();

    try {
      await client.query('BEGIN');

      const transactionAdapter = new PostgreSQLTransactionAdapter(client);

      const result = await callback(transactionAdapter);

      await client.query('COMMIT');

      return result;
    } catch (error) {
      try {
        await client.query('ROLLBACK');
      } catch {
        // Preserve the original transaction error.
      }

      throw error;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

/**
 * Adapter used exclusively inside a PostgreSQL transaction.
 */
class PostgreSQLTransactionAdapter implements DatabaseAdapter {
  constructor(
    private readonly client: PoolClient,
  ) {}

  async query<T>(
    sql: string,
    params: readonly unknown[] = [],
  ): Promise<QueryResult<T>> {
    const result = await this.client.query(
      sql,
      [...params],
    );

    return mapQueryResult<T>(result);
  }

  async execute(
    sql: string,
    params: readonly unknown[] = [],
  ): Promise<{ affectedRows: number }> {
    const result = await this.client.query(
      sql,
      [...params],
    );

    return {
      affectedRows: result.rowCount ?? 0,
    };
  }

  async transaction<T>(
    callback: (tx: DatabaseAdapter) => Promise<T>,
  ): Promise<T> {
    /**
     * Nested transactions are deliberately not started here.
     *
     * PostgreSQL SAVEPOINT support can be added later if nested
     * transaction semantics are required.
     */
    return callback(this);
  }

  async close(): Promise<void> {
    /**
     * The parent transaction owns this connection.
     * Never close the PoolClient from inside the transaction adapter.
     */
  }
}

let pool: Pool | null = null;

/**
 * Returns the process-local PostgreSQL connection pool.
 *
 * The pool reuses connections instead of creating a new TCP connection
 * for every request.
 */
function getPool(): Pool {
  if (pool) {
    return pool;
  }

  const config = getDatabaseConfig();

  pool = new Pool({
    connectionString: config.url,
    max: config.maxConnections ?? 20,
    connectionTimeoutMillis: config.connectionTimeoutMs ?? 10_000,
    idleTimeoutMillis: config.idleTimeoutMs ?? 30_000,
    allowExitOnIdle: true,
  });

  pool.on('error', (error) => {
    console.error('[database] Unexpected PostgreSQL pool error:', error);
  });

  return pool;
}

/**
 * Creates the application's PostgreSQL database adapter.
 */
export function createDatabaseConnection(): DatabaseAdapter {
  return new PostgreSQLAdapter(getPool());
}

/**
 * Lightweight database health check.
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await getPool().query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

/**
 * @file database/connection.ts
 * @description Self-hosted PostgreSQL connection and adapter for GrowthAI.
 *
 * IMPORTANT:
 * - PostgreSQL only.
 * - No Supabase.
 * - Server-only.
 * - Uses DATABASE_URL.
 * - Uses a shared PostgreSQL connection pool.
 */

import 'server-only';

import { Pool, type PoolClient, type QueryResultRow } from 'pg';

import type {
  DatabaseAdapter,
  QueryResult,
} from './types';

export interface DatabaseConfig {
  readonly url: string;
  readonly maxConnections: number;
  readonly connectionTimeoutMs: number;
  readonly idleTimeoutMs: number;
}

export function getDatabaseConfig(): DatabaseConfig {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    throw new Error(
      'Missing environment variable: DATABASE_URL',
    );
  }

  return {
    url,
    maxConnections: 20,
    connectionTimeoutMs: 10_000,
    idleTimeoutMs: 30_000,
  };
}

function mapQueryResult<T>(
  result: {
    rows: QueryResultRow[];
    rowCount: number | null;
  },
): QueryResult<T> {
  return {
    rows: result.rows as T[],
    count: result.rowCount ?? result.rows.length,
  };
}

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
    return callback(this);
  }

  async close(): Promise<void> {
    // The parent PostgreSQL connection owns this client.
  }
}

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
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      const transactionAdapter =
        new PostgreSQLTransactionAdapter(client);

      const result = await callback(transactionAdapter);

      await client.query('COMMIT');

      return result;
    } catch (error) {
      try {
        await client.query('ROLLBACK');
      } catch {
        // Preserve the original error.
      }

      throw error;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    /*
     * The application uses a shared process-local pool.
     *
     * The pool is intentionally not closed for every query.
     * This prevents premature pool shutdown between requests.
     */
  }
}

let pool: Pool | null = null;

function getPool(): Pool {
  if (pool) {
    return pool;
  }

  const config = getDatabaseConfig();

  pool = new Pool({
    connectionString: config.url,
    max: config.maxConnections,
    connectionTimeoutMillis:
      config.connectionTimeoutMs,
    idleTimeoutMillis:
      config.idleTimeoutMs,
    allowExitOnIdle: true,
  });

  pool.on('error', (error) => {
    console.error(
      '[database] Unexpected PostgreSQL pool error:',
      error,
    );
  });

  return pool;
}

export function createDatabaseConnection(): DatabaseAdapter {
  return new PostgreSQLAdapter(getPool());
}

/**
 * Performs a lightweight PostgreSQL connectivity check.
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await getPool().query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

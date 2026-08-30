/**
 * @file database/client.ts
 * @description Server-safe database client for GrowthAI.
 *
 * IMPORTANT:
 * - Uses self-hosted PostgreSQL.
 * - No Supabase dependency.
 * - Never exposes DATABASE_URL to the browser.
 * - Database access must remain on the server.
 */

import 'server-only';

import {
  createDatabaseConnection,
  type DatabaseConfig,
  getDatabaseConfig,
} from './connection';
import type { DatabaseAdapter } from './types';

/**
 * Returns the database configuration used by the server.
 *
 * This function is server-only and must never be imported
 * into client-side/browser components.
 */
export function getClientDatabaseConfig(): DatabaseConfig {
  return getDatabaseConfig();
}

/**
 * Creates a server-side database client.
 *
 * Despite the filename "client.ts", this is NOT a browser/client-side
 * PostgreSQL client. PostgreSQL credentials must never be sent to
 * the browser.
 */
export function createDatabaseClient(): DatabaseAdapter {
  return createDatabaseConnection();
}

/**
 * Executes a read/query operation through the server-side
 * PostgreSQL database adapter.
 */
export async function queryDatabase<T>(
  sql: string,
  params: readonly unknown[] = [],
) {
  const db = createDatabaseClient();

  try {
    return await db.query<T>(sql, params);
  } finally {
    await db.close();
  }
}

/**
 * Executes a write operation through the server-side
 * PostgreSQL database adapter.
 */
export async function executeDatabase(
  sql: string,
  params: readonly unknown[] = [],
) {
  const db = createDatabaseClient();

  try {
    return await db.execute(sql, params);
  } finally {
    await db.close();
  }
}

/**
 * Executes multiple database operations inside one PostgreSQL
 * transaction.
 */
export async function transactionDatabase<T>(
  callback: (tx: DatabaseAdapter) => Promise<T>,
): Promise<T> {
  const db = createDatabaseClient();

  try {
    return await db.transaction(callback);
  } finally {
    await db.close();
  }
}

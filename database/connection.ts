/**
 * @file database/connection.ts
 * @description Database connection configuration and lifecycle contracts.
 */

import type { DatabaseAdapter } from './types';

export interface DatabaseConfig {
  url: string;
  maxConnections?: number;
  connectionTimeoutMs?: number;
  idleTimeoutMs?: number;
}

export function getDatabaseConfig(): DatabaseConfig {
  const url = process.env.DATABASE_URL;

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
 * Database adapter factory.
 *
 * The concrete PostgreSQL driver will be connected here later.
 * Application code must depend on DatabaseAdapter rather than a driver.
 */
export function createDatabaseConnection(): DatabaseAdapter {
  throw new Error(
    'Database adapter is not configured yet. Connect the PostgreSQL driver here.',
  );
}

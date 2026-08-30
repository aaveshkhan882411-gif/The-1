/**
 * @file database/health-check.ts
 * @description PostgreSQL database health and connectivity checks.
 */

import 'server-only';

import { createDatabaseConnection } from './connection';

export interface DatabaseHealth {
  readonly healthy: boolean;
  readonly latencyMs: number;
  readonly checkedAt: string;
  readonly error?: string;
}

/**
 * Checks whether the self-hosted PostgreSQL database is reachable.
 */
export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const startedAt = Date.now();
  const checkedAt = new Date().toISOString();

  try {
    const db = createDatabaseConnection();

    try {
      await db.query<{ ok: number }>('SELECT 1 AS ok');

      return {
        healthy: true,
        latencyMs: Date.now() - startedAt,
        checkedAt,
      };
    } finally {
      await db.close();
    }
  } catch (error: unknown) {
    return {
      healthy: false,
      latencyMs: Date.now() - startedAt,
      checkedAt,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown database connection error',
    };
  }
}

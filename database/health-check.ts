/**
 * @file database/health-check.ts
 * @description PostgreSQL database health and connectivity checks.
 *
 * IMPORTANT:
 * - Self-hosted PostgreSQL only.
 * - No Supabase dependency.
 * - Server-side only.
 * - Uses the application's DatabaseAdapter.
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
 *
 * The connection adapter is intentionally closed after the health check.
 * This keeps the health-check function lifecycle-safe with the current
 * database connection abstraction.
 */
export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const startedAt = Date.now();

  try {
    const db = createDatabaseConnection();

    try {
      await db.query<{ ok: number }>(
        'SELECT 1 AS ok',
      );

      return {
        healthy: true,
        latencyMs: Date.now() - startedAt,
        checkedAt: new Date().toISOString(),
      };
    } finally {
      await db.close();
    }
  } catch (error: unknown) {
    return {
      healthy: false,
      latencyMs: Date.now() - startedAt,
      checkedAt: new Date().toISOString(),
      error:
        error instanceof Error
          ? error.message
          : 'Unknown database connection error',
    };
  }
}

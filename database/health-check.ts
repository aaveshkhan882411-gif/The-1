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
 * Checks whether self-hosted PostgreSQL is reachable.
 */
export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const startedAt = Date.now();

  try {
    const db = createDatabaseConnection();

    try {
      const result = await db.query<{ ok: number }>(
        'SELECT 1 AS ok',
      );

      const ok = result.rows[0]?.ok === 1;

      if (!ok) {
        return {
          healthy: false,
          latencyMs: Date.now() - startedAt,
          checkedAt: new Date().toISOString(),
          error:
            'PostgreSQL health query returned an unexpected result.',
        };
      }

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
          : 'Unknown PostgreSQL connection error.',
    };
  }
}

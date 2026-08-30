/**
 * @file database/server.ts
 * @description Server-only PostgreSQL database access for GrowthAI.
 *
 * IMPORTANT:
 * - Supabase removed.
 * - No browser database access.
 * - Uses self-hosted PostgreSQL through DATABASE_URL.
 */

import 'server-only';

import { createDatabaseConnection } from './connection';
import type { DatabaseAdapter } from './types';

/**
 * Creates a server-side PostgreSQL database adapter.
 *
 * Use this from:
 * - Server Components
 * - Route Handlers
 * - Server Actions
 * - server-only services
 */
export function createServerDatabase(): DatabaseAdapter {
  return createDatabaseConnection();
}

/**
 * Compatibility alias for code that previously imported createClient()
 * from database/server.ts.
 */
export function createClient(): DatabaseAdapter {
  return createServerDatabase();
}

/**
 * Shared server database instance.
 *
 * The underlying PostgreSQL pool is reused by the connection layer.
 */
export const db = createServerDatabase();

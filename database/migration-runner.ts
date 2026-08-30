/**
 * @file database/migration-runner.ts
 * @description Server-only PostgreSQL migration runner for GrowthAI.
 *
 * IMPORTANT:
 * - PostgreSQL only.
 * - Uses the existing database/connection.ts adapter.
 * - Runs migrations inside a transaction.
 * - Records successfully applied migrations.
 * - Safe to run repeatedly; already-applied migrations are skipped.
 */

import 'server-only';

import { createDatabaseConnection } from './connection';
import type { DatabaseAdapter } from './types';

export interface Migration {
  readonly id: string;
  readonly sql: string;
}

export interface MigrationResult {
  readonly applied: readonly string[];
  readonly skipped: readonly string[];
}

const MIGRATION_TABLE = '__growthai_migrations';

function validateMigration(migration: Migration): void {
  if (
    !migration ||
    typeof migration.id !== 'string' ||
    !migration.id.trim()
  ) {
    throw new Error(
      'Invalid migration: migration id is required.',
    );
  }

  if (
    typeof migration.sql !== 'string' ||
    !migration.sql.trim()
  ) {
    throw new Error(
      `Invalid migration "${migration.id}": SQL is required.`,
    );
  }
}

function normalizeMigrations(
  migrations: readonly Migration[],
): Migration[] {
  if (!Array.isArray(migrations)) {
    throw new Error('Migrations must be an array.');
  }

  const normalized = migrations.map((migration) => {
    validateMigration(migration);

    return {
      id: migration.id.trim(),
      sql: migration.sql.trim(),
    };
  });

  const ids = new Set<string>();

  for (const migration of normalized) {
    if (ids.has(migration.id)) {
      throw new Error(
        `Duplicate migration id: ${migration.id}`,
      );
    }

    ids.add(migration.id);
  }

  return normalized;
}

async function ensureMigrationTable(
  db: DatabaseAdapter,
): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS ${MIGRATION_TABLE} (
      id VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function getAppliedMigrationIds(
  db: DatabaseAdapter,
): Promise<Set<string>> {
  const result = await db.query<{ id: string }>(`
    SELECT id
    FROM ${MIGRATION_TABLE}
    ORDER BY id ASC
  `);

  return new Set(result.rows.map((row) => row.id));
}

/**
 * Runs the supplied migrations in order.
 *
 * Every migration is applied inside the same PostgreSQL transaction.
 * If any migration fails, the transaction is rolled back.
 */
export async function runMigrations(
  migrations: readonly Migration[],
): Promise<MigrationResult> {
  const normalizedMigrations =
    normalizeMigrations(migrations);

  if (normalizedMigrations.length === 0) {
    return {
      applied: [],
      skipped: [],
    };
  }

  const db = createDatabaseConnection();

  return db.transaction(async (tx) => {
    await ensureMigrationTable(tx);

    const appliedIds =
      await getAppliedMigrationIds(tx);

    const applied: string[] = [];
    const skipped: string[] = [];

    for (const migration of normalizedMigrations) {
      if (appliedIds.has(migration.id)) {
        skipped.push(migration.id);
        continue;
      }

      await tx.execute(migration.sql);

      await tx.execute(
        `
          INSERT INTO ${MIGRATION_TABLE} (id)
          VALUES ($1)
        `,
        [migration.id],
      );

      applied.push(migration.id);
    }

    return {
      applied,
      skipped,
    };
  });
}

/**
 * Runs a single migration.
 */
export async function runMigration(
  migration: Migration,
): Promise<MigrationResult> {
  return runMigrations([migration]);
}

/**
 * Checks whether a migration has already been applied.
 */
export async function isMigrationApplied(
  migrationId: string,
): Promise<boolean> {
  if (
    typeof migrationId !== 'string' ||
    !migrationId.trim()
  ) {
    throw new Error(
      'Migration id is required.',
    );
  }

  const db = createDatabaseConnection();

  return db.transaction(async (tx) => {
    await ensureMigrationTable(tx);

    const result = await tx.query<{ id: string }>(
      `
        SELECT id
        FROM ${MIGRATION_TABLE}
        WHERE id = $1
        LIMIT 1
      `,
      [migrationId.trim()],
    );

    return result.rows.length > 0;
  });
}

/**
 * Returns all successfully applied migration IDs.
 */
export async function getAppliedMigrations(): Promise<
  readonly string[]
> {
  const db = createDatabaseConnection();

  return db.transaction(async (tx) => {
    await ensureMigrationTable(tx);

    const result = await tx.query<{ id: string }>(`
      SELECT id
      FROM ${MIGRATION_TABLE}
      ORDER BY id ASC
    `);

    return result.rows.map((row) => row.id);
  });
}

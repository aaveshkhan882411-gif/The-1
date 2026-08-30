/**
 * @file database/migration-runner.ts
 * @description Self-hosted PostgreSQL migration runner for GrowthAI.
 *
 * Runs SQL migration files in deterministic order and records
 * successfully applied migrations in the database.
 */

import 'server-only';

import { promises as fs } from 'node:fs';
import path from 'node:path';

import { createDatabaseConnection } from './connection';

const MIGRATIONS_DIRECTORY = path.join(
  process.cwd(),
  'database',
  'migrations',
);

const MIGRATION_FILE_PATTERN = /^\d+_[a-z0-9_-]+\.sql$/;

interface MigrationFile {
  readonly version: string;
  readonly filename: string;
  readonly sql: string;
}

/**
 * Loads migration files from database/migrations.
 */
async function loadMigrations(): Promise<MigrationFile[]> {
  const filenames = await fs.readdir(MIGRATIONS_DIRECTORY);

  const migrationFiles = filenames
    .filter((filename) => MIGRATION_FILE_PATTERN.test(filename))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const migrations: MigrationFile[] = [];

  for (const filename of migrationFiles) {
    const filePath = path.join(MIGRATIONS_DIRECTORY, filename);
    const sql = await fs.readFile(filePath, 'utf8');

    const version = filename.replace(/\.sql$/, '');

    migrations.push({
      version,
      filename,
      sql,
    });
  }

  return migrations;
}

/**
 * Ensures the migration tracking table exists.
 */
async function ensureMigrationTable(): Promise<void> {
  const db = createDatabaseConnection();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await db.close();
}

/**
 * Returns migration versions that have already been applied.
 */
async function getAppliedMigrations(): Promise<Set<string>> {
  const db = createDatabaseConnection();

  const result = await db.query<{ version: string }>(
    `
      SELECT version
      FROM schema_migrations
      ORDER BY version ASC
    `,
  );

  await db.close();

  return new Set(result.rows.map((row) => row.version));
}

/**
 * Executes all pending migrations in deterministic order.
 */
export async function runMigrations(): Promise<void> {
  const migrations = await loadMigrations();

  if (migrations.length === 0) {
    return;
  }

  await ensureMigrationTable();

  const appliedMigrations = await getAppliedMigrations();

  for (const migration of migrations) {
    if (appliedMigrations.has(migration.version)) {
      continue;
    }

    const db = createDatabaseConnection();

    try {
      await db.transaction(async (transaction) => {
        await transaction.execute(migration.sql);

        await transaction.execute(
          `
            INSERT INTO schema_migrations (version)
            VALUES ($1)
            ON CONFLICT (version) DO NOTHING
          `,
          [migration.version],
        );
      });
    } finally {
      await db.close();
    }
  }
}

/**
 * Returns the list of migration files available in the project.
 */
export async function listMigrations(): Promise<readonly string[]> {
  const migrations = await loadMigrations();

  return migrations.map((migration) => migration.filename);
}

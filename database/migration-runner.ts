/**
 * @file database/migration-runner.ts
 * @description Server-only PostgreSQL migration runner for GrowthAI.
 *
 * Responsibilities:
 * - Discovers numbered SQL migrations.
 * - Executes migrations in ascending version order.
 * - Supports migration files that manage their own BEGIN/COMMIT.
 * - Records successfully applied migrations.
 * - Prevents duplicate migration versions.
 *
 * PostgreSQL only.
 * Supabase is not required.
 */

import 'server-only';

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { createDatabaseConnection } from './connection';

const MIGRATIONS_DIRECTORY = path.join(
  process.cwd(),
  'database',
  'migrations',
);

const MIGRATION_FILE_REGEX = /^(\d+)_.*\.sql$/;

interface MigrationFile {
  readonly version: number;
  readonly filename: string;
  readonly filepath: string;
}

function parseMigrationVersion(
  filename: string,
): number | null {
  const match = filename.match(
    MIGRATION_FILE_REGEX,
  );

  if (!match) {
    return null;
  }

  const version = Number.parseInt(
    match[1],
    10,
  );

  if (
    !Number.isSafeInteger(version) ||
    version <= 0
  ) {
    return null;
  }

  return version;
}

async function getMigrationFiles(): Promise<
  MigrationFile[]
> {
  const filenames = await readdir(
    MIGRATIONS_DIRECTORY,
  );

  const migrations: MigrationFile[] = [];

  for (const filename of filenames) {
    const version =
      parseMigrationVersion(filename);

    if (version === null) {
      continue;
    }

    migrations.push({
      version,
      filename,
      filepath: path.join(
        MIGRATIONS_DIRECTORY,
        filename,
      ),
    });
  }

  migrations.sort(
    (a, b) => a.version - b.version,
  );

  for (
    let index = 1;
    index < migrations.length;
    index += 1
  ) {
    const previous =
      migrations[index - 1];

    const current =
      migrations[index];

    if (
      previous.version ===
      current.version
    ) {
      throw new Error(
        `Duplicate migration version detected: ${current.version}`,
      );
    }
  }

  return migrations;
}

async function ensureMigrationTable(): Promise<void> {
  const db = createDatabaseConnection();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function getAppliedVersions(): Promise<
  Set<number>
> {
  const db = createDatabaseConnection();

  const result = await db.query<{
    version: number | string;
  }>(`
    SELECT version
    FROM schema_migrations
    ORDER BY version ASC
  `);

  return new Set(
    result.rows.map((row) =>
      Number(row.version),
    ),
  );
}

/**
 * Executes all pending migrations.
 *
 * IMPORTANT:
 * The runner deliberately does NOT wrap the SQL
 * migration in another transaction.
 *
 * This allows each migration file to contain:
 *
 * BEGIN;
 * ...
 * COMMIT;
 *
 * without creating an invalid nested transaction.
 */
export async function runMigrations(): Promise<void> {
  const migrations =
    await getMigrationFiles();

  if (migrations.length === 0) {
    throw new Error(
      'No database migration files were found.',
    );
  }

  await ensureMigrationTable();

  const appliedVersions =
    await getAppliedVersions();

  const db = createDatabaseConnection();

  for (const migration of migrations) {
    if (
      appliedVersions.has(
        migration.version,
      )
    ) {
      continue;
    }

    const sql = await readFile(
      migration.filepath,
      'utf8',
    );

    const trimmedSql = sql.trim();

    if (!trimmedSql) {
      throw new Error(
        `Migration file is empty: ${migration.filename}`,
      );
    }

    /*
     * Execute the migration exactly as authored.
     *
     * If the SQL file contains BEGIN/COMMIT,
     * PostgreSQL handles its transaction.
     */
    await db.execute(trimmedSql);

    /*
     * Only record the migration after its SQL
     * has completed successfully.
     */
    await db.execute(
      `
        INSERT INTO schema_migrations (
          version,
          applied_at
        )
        VALUES ($1, NOW())
        ON CONFLICT (version) DO NOTHING
      `,
      [migration.version],
    );

    console.log(
      `[database] Applied migration ${migration.version}: ${migration.filename}`,
    );
  }
}

/**
 * Returns the latest successfully applied migration.
 */
export async function getCurrentMigrationVersion(): Promise<number> {
  await ensureMigrationTable();

  const db = createDatabaseConnection();

  const result = await db.query<{
    version: number | string;
  }>(`
    SELECT version
    FROM schema_migrations
    ORDER BY version DESC
    LIMIT 1
  `);

  if (result.rows.length === 0) {
    return 0;
  }

  return Number(
    result.rows[0].version,
  );
}

/**
 * Checks whether every available migration
 * has been applied.
 */
export async function isDatabaseUpToDate(): Promise<boolean> {
  await ensureMigrationTable();

  const migrations =
    await getMigrationFiles();

  const appliedVersions =
    await getAppliedVersions();

  return migrations.every(
    (migration) =>
      appliedVersions.has(
        migration.version,
      ),
  );
}

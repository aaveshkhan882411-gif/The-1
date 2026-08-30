/**
 * @file database/migration-runner.ts
 * @description Self-hosted PostgreSQL migration runner for GrowthAI.
 *
 * Runs numbered SQL migrations in deterministic order and records
 * successfully applied migrations.
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

const MIGRATION_FILE_PATTERN =
  /^\d+_[a-z0-9_-]+\.sql$/;

interface MigrationFile {
  readonly version: string;
  readonly filename: string;
  readonly sql: string;
}

async function loadMigrations(): Promise<
  readonly MigrationFile[]
> {
  const filenames = await fs.readdir(
    MIGRATIONS_DIRECTORY,
  );

  const migrationFiles = filenames
    .filter((filename) =>
      MIGRATION_FILE_PATTERN.test(filename),
    )
    .sort((a, b) =>
      a.localeCompare(b, undefined, {
        numeric: true,
      }),
    );

  const migrations: MigrationFile[] = [];

  for (const filename of migrationFiles) {
    const filePath = path.join(
      MIGRATIONS_DIRECTORY,
      filename,
    );

    const sql = await fs.readFile(
      filePath,
      'utf8',
    );

    migrations.push({
      filename,
      version: filename.replace(/\.sql$/, ''),
      sql,
    });
  }

  return migrations;
}

async function ensureMigrationTable(
  db: ReturnType<typeof createDatabaseConnection>,
): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function getAppliedMigrations(
  db: ReturnType<typeof createDatabaseConnection>,
): Promise<ReadonlySet<string>> {
  const result = await db.query<{ version: string }>(`
    SELECT version
    FROM schema_migrations
    ORDER BY version ASC
  `);

  return new Set(
    result.rows.map((row) => row.version),
  );
}

/**
 * Runs all pending migrations.
 */
export async function runMigrations(): Promise<void> {
  const migrations = await loadMigrations();

  if (migrations.length === 0) {
    return;
  }

  const db = createDatabaseConnection();

  try {
    await ensureMigrationTable(db);

    const appliedMigrations =
      await getAppliedMigrations(db);

    for (const migration of migrations) {
      if (
        appliedMigrations.has(
          migration.version,
        )
      ) {
        continue;
      }

      await db.transaction(async (tx) => {
        await tx.execute(migration.sql);

        await tx.execute(
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
      });
    }
  } finally {
    await db.close();
  }
}

/**
 * Returns all migration filenames in execution order.
 */
export async function listMigrations(): Promise<
  readonly string[]
> {
  const migrations = await loadMigrations();

  return migrations.map(
    (migration) => migration.filename,
  );
}

/**
 * Returns migrations that are present in the project
 * but have not yet been applied to PostgreSQL.
 */
export async function getPendingMigrations(): Promise<
  readonly string[]
> {
  const migrations = await loadMigrations();

  if (migrations.length === 0) {
    return [];
  }

  const db = createDatabaseConnection();

  try {
    await ensureMigrationTable(db);

    const applied =
      await getAppliedMigrations(db);

    return migrations
      .filter(
        (migration) =>
          !applied.has(migration.version),
      )
      .map(
        (migration) => migration.filename,
      );
  } finally {
    await db.close();
  }
}

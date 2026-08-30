/**
 * @file database/schema.ts
 * @description Centralized database schema metadata for GrowthAI.
 *
 * Database engine:
 * - PostgreSQL
 * - Self-hosted
 *
 * IMPORTANT:
 * - This file contains application-level schema metadata.
 * - The executable PostgreSQL schema is database/migrations/001_initial_schema.sql.
 * - Keep table/column names synchronized with that migration.
 */

import 'server-only';

export const DATABASE_SCHEMA_VERSION = 1 as const;

export const DATABASE_TABLES = {
  users: 'users',
  tenants: 'tenants',
  leads: 'leads',
  agents: 'agents',
  subscriptions: 'subscriptions',
  auditLogs: 'audit_logs',
} as const;

export type DatabaseTable =
  (typeof DATABASE_TABLES)[keyof typeof DATABASE_TABLES];

export const USERS_COLUMNS = {
  id: 'id',
  tenantId: 'tenant_id',
  email: 'email',
  name: 'name',
  role: 'role',
  emailVerified: 'email_verified',
  status: 'status',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
} as const;

export const TENANTS_COLUMNS = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  status: 'status',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
} as const;

export const LEADS_COLUMNS = {
  id: 'id',
  tenantId: 'tenant_id',
  name: 'name',
  email: 'email',
  phone: 'phone',
  company: 'company',
  source: 'source',
  status: 'status',
  notes: 'notes',
  assignedAgentId: 'assigned_agent_id',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
} as const;

export const AGENTS_COLUMNS = {
  id: 'id',
  tenantId: 'tenant_id',
  name: 'name',
  type: 'type',
  status: 'status',
  configuration: 'configuration',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
} as const;

export const SUBSCRIPTIONS_COLUMNS = {
  id: 'id',
  tenantId: 'tenant_id',
  plan: 'plan',
  status: 'status',
  provider: 'provider',
  externalId: 'external_id',
  currentPeriodStart: 'current_period_start',
  currentPeriodEnd: 'current_period_end',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
} as const;

export const AUDIT_LOG_COLUMNS = {
  id: 'id',
  tenantId: 'tenant_id',
  userId: 'user_id',
  event: 'event',
  requestId: 'request_id',
  ipAddress: 'ip_address',
  userAgent: 'user_agent',
  metadata: 'metadata',
  createdAt: 'created_at',
} as const;

export const DATABASE_SCHEMA = Object.freeze({
  version: DATABASE_SCHEMA_VERSION,

  tenants: {
    table: DATABASE_TABLES.tenants,
    columns: TENANTS_COLUMNS,
  },

  users: {
    table: DATABASE_TABLES.users,
    columns: USERS_COLUMNS,
  },

  leads: {
    table: DATABASE_TABLES.leads,
    columns: LEADS_COLUMNS,
  },

  agents: {
    table: DATABASE_TABLES.agents,
    columns: AGENTS_COLUMNS,
  },

  subscriptions: {
    table: DATABASE_TABLES.subscriptions,
    columns: SUBSCRIPTIONS_COLUMNS,
  },

  auditLogs: {
    table: DATABASE_TABLES.auditLogs,
    columns: AUDIT_LOG_COLUMNS,
  },
} as const);

export type DatabaseSchema = typeof DATABASE_SCHEMA;

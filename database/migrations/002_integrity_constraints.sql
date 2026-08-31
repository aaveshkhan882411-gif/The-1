-- GrowthAI
-- PostgreSQL integrity hardening migration
-- Migration: 002_integrity_constraints
--
-- Purpose:
-- 1. Enforce tenant-safe agent assignment for leads.
-- 2. Enforce tenant-safe user references in audit logs.
--
-- PostgreSQL-only.
-- Supabase is not required.
-- MySQL is not used.

BEGIN;

-- =========================================================
-- AGENTS
-- =========================================================

ALTER TABLE agents
    ADD CONSTRAINT agents_id_tenant_unique
    UNIQUE (id, tenant_id);

-- =========================================================
-- LEADS → AGENTS
-- =========================================================

ALTER TABLE leads
    DROP CONSTRAINT IF EXISTS leads_assigned_agent_id_fkey;

ALTER TABLE leads
    ADD CONSTRAINT leads_agent_same_tenant_fkey
    FOREIGN KEY (assigned_agent_id, tenant_id)
    REFERENCES agents (id, tenant_id)
    ON DELETE SET NULL;

-- =========================================================
-- USERS
-- =========================================================

ALTER TABLE users
    ADD CONSTRAINT users_id_tenant_unique
    UNIQUE (id, tenant_id);

-- =========================================================
-- AUDIT LOGS → USERS
-- =========================================================

ALTER TABLE audit_logs
    DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;

ALTER TABLE audit_logs
    ADD CONSTRAINT audit_logs_user_same_tenant_fkey
    FOREIGN KEY (user_id, tenant_id)
    REFERENCES users (id, tenant_id)
    ON DELETE SET NULL;

-- =========================================================
-- MIGRATION VERSION
-- =========================================================

INSERT INTO schema_migrations (version)
VALUES (2)
ON CONFLICT (version) DO NOTHING;

COMMIT;

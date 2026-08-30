-- GrowthAI
-- PostgreSQL integrity hardening migration
-- Migration: 002_integrity_constraints
--
-- Purpose:
-- 1. Enforce tenant-safe agent assignment for leads.
-- 2. Enforce tenant-safe user references in audit logs.
--
-- This migration is intentionally PostgreSQL-only.

BEGIN;

-- =========================================================
-- AGENTS
-- =========================================================
-- Allows a lead's assigned agent to be verified against
-- the same tenant as the lead.

ALTER TABLE agents
    ADD CONSTRAINT agents_id_tenant_unique
    UNIQUE (id, tenant_id);


-- =========================================================
-- LEADS → AGENTS
-- =========================================================
-- Remove the previous single-column relationship.

ALTER TABLE leads
    DROP CONSTRAINT IF EXISTS leads_assigned_agent_id_fkey;


-- Recreate the relationship using both agent ID and tenant ID.
--
-- This prevents a lead belonging to tenant A from referencing
-- an agent belonging to tenant B.

ALTER TABLE leads
    ADD CONSTRAINT leads_agent_same_tenant_fkey
    FOREIGN KEY (assigned_agent_id, tenant_id)
    REFERENCES agents (id, tenant_id)
    ON DELETE SET NULL;


-- =========================================================
-- USERS
-- =========================================================
-- Allows audit logs to verify that the referenced user belongs
-- to the same tenant recorded by the audit log.

ALTER TABLE users
    ADD CONSTRAINT users_id_tenant_unique
    UNIQUE (id, tenant_id);


-- =========================================================
-- AUDIT LOGS → USERS
-- =========================================================
-- Remove the previous single-column relationship.

ALTER TABLE audit_logs
    DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;


-- Recreate the relationship using both user ID and tenant ID.
--
-- This prevents an audit log for tenant A from referencing
-- a user belonging to tenant B.

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

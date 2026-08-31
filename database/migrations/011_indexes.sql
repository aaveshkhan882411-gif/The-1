-- GrowthAI
-- PostgreSQL performance indexes
-- Migration: 011_indexes
--
-- Purpose:
-- 1. Add composite indexes for common tenant-scoped queries.
-- 2. Improve dashboard and SaaS query performance.
-- 3. Keep tenant filtering efficient.
--
-- PostgreSQL only.
-- Supabase is not required.
-- MySQL is not used.

BEGIN;

-- =========================================================
-- USERS
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_users_tenant_status
    ON users(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_users_tenant_created_at
    ON users(tenant_id, created_at DESC);

-- =========================================================
-- AGENTS
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_agents_tenant_status
    ON agents(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_agents_tenant_type
    ON agents(tenant_id, type);

CREATE INDEX IF NOT EXISTS idx_agents_tenant_created_at
    ON agents(tenant_id, created_at DESC);

-- =========================================================
-- LEADS
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_leads_tenant_status
    ON leads(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_leads_tenant_agent
    ON leads(tenant_id, assigned_agent_id);

CREATE INDEX IF NOT EXISTS idx_leads_tenant_created_at
    ON leads(tenant_id, created_at DESC);

-- =========================================================
-- SUBSCRIPTIONS
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant_status
    ON subscriptions(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant_created_at
    ON subscriptions(tenant_id, created_at DESC);

-- =========================================================
-- AUDIT LOGS
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_created_at
    ON audit_logs(tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_event_created_at
    ON audit_logs(tenant_id, event, created_at DESC);

-- =========================================================
-- CONVERSATIONS
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_conversations_tenant_created_at
    ON conversations(tenant_id, created_at DESC);

-- =========================================================
-- APPOINTMENTS
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_appointments_tenant_created_at
    ON appointments(tenant_id, created_at DESC);

-- =========================================================
-- MESSAGES
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_messages_tenant_created_at
    ON messages(tenant_id, created_at DESC);

-- =========================================================
-- WORKFLOWS
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_workflows_tenant_created_at
    ON workflows(tenant_id, created_at DESC);

-- =========================================================
-- PAYMENTS
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_payments_tenant_created_at
    ON payments(tenant_id, created_at DESC);

-- =========================================================
-- NOTIFICATIONS
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_notifications_tenant_created_at
    ON notifications(tenant_id, created_at DESC);

-- =========================================================
-- USAGE
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_usage_records_tenant_created_at
    ON usage_records(tenant_id, created_at DESC);

-- =========================================================
-- SESSIONS
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_sessions_tenant_expires_at
    ON sessions(tenant_id, expires_at);

-- =========================================================
-- MIGRATION VERSION
-- =========================================================

INSERT INTO schema_migrations (version)
VALUES (11)
ON CONFLICT (version) DO NOTHING;

COMMIT;

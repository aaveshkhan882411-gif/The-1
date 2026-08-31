-- GrowthAI
-- PostgreSQL usage and credits schema
-- Migration: 009_usage
--
-- Purpose:
-- 1. Track tenant AI usage.
-- 2. Support plan-based credits.
-- 3. Track usage by agent and feature.
-- 4. Maintain a daily/monthly usage record.
--
-- PostgreSQL only.
-- Supabase is not required.
-- MySQL is not used.

BEGIN;

-- =========================================================
-- USAGE
-- =========================================================

CREATE TABLE IF NOT EXISTS usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID NOT NULL
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    agent_id UUID,

    usage_type VARCHAR(64) NOT NULL,

    units BIGINT NOT NULL DEFAULT 0
        CHECK (units >= 0),

    credits_used NUMERIC(14, 4) NOT NULL DEFAULT 0
        CHECK (credits_used >= 0),

    period_start TIMESTAMPTZ NOT NULL,

    period_end TIMESTAMPTZ NOT NULL,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT usage_period_valid
        CHECK (period_end > period_start),

    CONSTRAINT usage_agent_same_tenant_fkey
        FOREIGN KEY (agent_id, tenant_id)
        REFERENCES agents (id, tenant_id)
        ON DELETE SET NULL
);

-- =========================================================
-- TENANT CREDIT BALANCES
-- =========================================================

CREATE TABLE IF NOT EXISTS credit_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID NOT NULL
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    credits_allocated NUMERIC(14, 4) NOT NULL DEFAULT 0
        CHECK (credits_allocated >= 0),

    credits_used NUMERIC(14, 4) NOT NULL DEFAULT 0
        CHECK (credits_used >= 0),

    credits_remaining NUMERIC(14, 4) NOT NULL DEFAULT 0
        CHECK (credits_remaining >= 0),

    period_start TIMESTAMPTZ NOT NULL,

    period_end TIMESTAMPTZ NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT credit_period_valid
        CHECK (period_end > period_start),

    CONSTRAINT credit_balance_tenant_period_unique
        UNIQUE (tenant_id, period_start, period_end)
);

-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_usage_records_tenant_id
    ON usage_records(tenant_id);

CREATE INDEX IF NOT EXISTS idx_usage_records_agent_id
    ON usage_records(agent_id);

CREATE INDEX IF NOT EXISTS idx_usage_records_usage_type
    ON usage_records(usage_type);

CREATE INDEX IF NOT EXISTS idx_usage_records_period
    ON usage_records(period_start, period_end);

CREATE INDEX IF NOT EXISTS idx_usage_records_created_at
    ON usage_records(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_credit_balances_tenant_id
    ON credit_balances(tenant_id);

CREATE INDEX IF NOT EXISTS idx_credit_balances_period
    ON credit_balances(period_start, period_end);

-- =========================================================
-- UPDATED_AT TRIGGER
-- =========================================================

DROP TRIGGER IF EXISTS credit_balances_set_updated_at
ON credit_balances;

CREATE TRIGGER credit_balances_set_updated_at
BEFORE UPDATE ON credit_balances
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- MIGRATION VERSION
-- =========================================================

INSERT INTO schema_migrations (version)
VALUES (9)
ON CONFLICT (version) DO NOTHING;

COMMIT;

-- GrowthAI
-- PostgreSQL initial database schema
-- Migration: 001_initial_schema
--
-- PostgreSQL-only.
-- Supabase is not required.
-- MySQL is not used.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================================
-- TENANTS
-- =========================================================

CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(160) NOT NULL,
    slug VARCHAR(160) NOT NULL UNIQUE,

    status VARCHAR(32) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'suspended', 'deactivated')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenants_status
    ON tenants(status);

-- =========================================================
-- USERS
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID NOT NULL
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    email VARCHAR(254) NOT NULL,
    name VARCHAR(160),

    role VARCHAR(32) NOT NULL DEFAULT 'member'
        CHECK (
            role IN (
                'owner',
                'admin',
                'manager',
                'agent_manager',
                'sales',
                'support',
                'analyst',
                'member',
                'viewer'
            )
        ),

    email_verified BOOLEAN NOT NULL DEFAULT FALSE,

    status VARCHAR(32) NOT NULL DEFAULT 'active'
        CHECK (
            status IN ('active', 'suspended', 'deactivated')
        ),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT users_tenant_email_unique
        UNIQUE (tenant_id, email)
);

CREATE INDEX IF NOT EXISTS idx_users_tenant_id
    ON users(tenant_id);

CREATE INDEX IF NOT EXISTS idx_users_email
    ON users(email);

CREATE INDEX IF NOT EXISTS idx_users_status
    ON users(status);

-- =========================================================
-- AGENTS
-- =========================================================

CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID NOT NULL
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    name VARCHAR(160) NOT NULL,

    type VARCHAR(64) NOT NULL,

    status VARCHAR(32) NOT NULL DEFAULT 'active'
        CHECK (
            status IN ('active', 'inactive', 'paused', 'error')
        ),

    configuration JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agents_tenant_id
    ON agents(tenant_id);

CREATE INDEX IF NOT EXISTS idx_agents_status
    ON agents(status);

CREATE INDEX IF NOT EXISTS idx_agents_type
    ON agents(type);

-- =========================================================
-- LEADS
-- =========================================================

CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID NOT NULL
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    name VARCHAR(160) NOT NULL,

    email VARCHAR(254),
    phone VARCHAR(64),
    company VARCHAR(200),

    source VARCHAR(64),

    status VARCHAR(32) NOT NULL DEFAULT 'new'
        CHECK (
            status IN (
                'new',
                'contacted',
                'qualified',
                'appointment',
                'converted',
                'lost',
                'archived'
            )
        ),

    notes TEXT,

    assigned_agent_id UUID
        REFERENCES agents(id)
        ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_tenant_id
    ON leads(tenant_id);

CREATE INDEX IF NOT EXISTS idx_leads_status
    ON leads(status);

CREATE INDEX IF NOT EXISTS idx_leads_email
    ON leads(email);

CREATE INDEX IF NOT EXISTS idx_leads_phone
    ON leads(phone);

CREATE INDEX IF NOT EXISTS idx_leads_assigned_agent
    ON leads(assigned_agent_id);

CREATE INDEX IF NOT EXISTS idx_leads_created_at
    ON leads(created_at DESC);

-- =========================================================
-- SUBSCRIPTIONS
-- =========================================================

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID NOT NULL
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    plan VARCHAR(64) NOT NULL,

    status VARCHAR(32) NOT NULL DEFAULT 'active'
        CHECK (
            status IN (
                'trialing',
                'active',
                'past_due',
                'cancelled',
                'expired'
            )
        ),

    provider VARCHAR(32) NOT NULL,

    external_id VARCHAR(255),

    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT subscriptions_provider_external_unique
        UNIQUE (provider, external_id)
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant_id
    ON subscriptions(tenant_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_status
    ON subscriptions(status);

-- =========================================================
-- SECURITY AUDIT LOG
-- =========================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID
        REFERENCES tenants(id)
        ON DELETE SET NULL,

    user_id UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    event VARCHAR(64) NOT NULL,

    request_id VARCHAR(128),

    ip_address INET,

    user_agent TEXT,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id
    ON audit_logs(tenant_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id
    ON audit_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_event
    ON audit_logs(event);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
    ON audit_logs(created_at DESC);

-- =========================================================
-- UPDATED_AT TRIGGER
-- =========================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tenants_set_updated_at ON tenants;

CREATE TRIGGER tenants_set_updated_at
BEFORE UPDATE ON tenants
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS users_set_updated_at ON users;

CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS agents_set_updated_at ON agents;

CREATE TRIGGER agents_set_updated_at
BEFORE UPDATE ON agents
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS leads_set_updated_at ON leads;

CREATE TRIGGER leads_set_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS subscriptions_set_updated_at ON subscriptions;

CREATE TRIGGER subscriptions_set_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- SCHEMA VERSION
-- =========================================================

CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO schema_migrations (version)
VALUES (1)
ON CONFLICT (version) DO NOTHING;

COMMIT;

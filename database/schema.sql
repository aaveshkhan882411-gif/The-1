-- ============================================================
-- GrowthAI Self-Hosted PostgreSQL Database Schema
-- Path: database/schema.sql
-- Version: 1.0
-- ============================================================
--
-- IMPORTANT:
-- This schema is designed for GrowthAI's own PostgreSQL server.
-- It does NOT require Supabase.
--
-- UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- 1. Tenants / Organizations
-- ============================================================

CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'suspended', 'deleted')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenants_status
    ON tenants(status);

-- ============================================================
-- 2. Users
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'member'
        CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'invited', 'suspended', 'deleted')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_users_tenant_email
        UNIQUE (tenant_id, email)
);

CREATE INDEX IF NOT EXISTS idx_users_tenant_id
    ON users(tenant_id);

CREATE INDEX IF NOT EXISTS idx_users_email
    ON users(email);

-- ============================================================
-- 3. AI Agents
-- ============================================================

CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'draft', 'archived')),
    configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agents_tenant_id
    ON agents(tenant_id);

CREATE INDEX IF NOT EXISTS idx_agents_tenant_status
    ON agents(tenant_id, status);

-- ============================================================
-- 4. Leads
-- ============================================================

CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    source TEXT,
    status TEXT NOT NULL DEFAULT 'new'
        CHECK (status IN (
            'new',
            'contacted',
            'qualified',
            'unqualified',
            'converted',
            'lost'
        )),
    score INTEGER NOT NULL DEFAULT 0
        CHECK (score >= 0 AND score <= 100),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_tenant_id
    ON leads(tenant_id);

CREATE INDEX IF NOT EXISTS idx_leads_tenant_status
    ON leads(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_leads_tenant_created
    ON leads(tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_email
    ON leads(email);

-- ============================================================
-- 5. Conversations
-- ============================================================

CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    channel TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'closed', 'archived')),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_tenant_id
    ON conversations(tenant_id);

CREATE INDEX IF NOT EXISTS idx_conversations_lead_id
    ON conversations(lead_id);

CREATE INDEX IF NOT EXISTS idx_conversations_agent_id
    ON conversations(agent_id);

CREATE INDEX IF NOT EXISTS idx_conversations_tenant_status
    ON conversations(tenant_id, status);

-- ============================================================
-- 6. Appointments
-- ============================================================

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled'
        CHECK (status IN (
            'scheduled',
            'confirmed',
            'completed',
            'cancelled',
            'no_show'
        )),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT appointments_valid_time
        CHECK (ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS idx_appointments_tenant_id
    ON appointments(tenant_id);

CREATE INDEX IF NOT EXISTS idx_appointments_schedule
    ON appointments(tenant_id, starts_at);

-- ============================================================
-- 7. CRM Records
-- ============================================================

CREATE TABLE IF NOT EXISTS crm_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    owner_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    stage TEXT NOT NULL DEFAULT 'new',
    value NUMERIC(14, 2) NOT NULL DEFAULT 0
        CHECK (value >= 0),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_tenant_id
    ON crm_records(tenant_id);

CREATE INDEX IF NOT EXISTS idx_crm_lead_id
    ON crm_records(lead_id);

CREATE INDEX IF NOT EXISTS idx_crm_stage
    ON crm_records(tenant_id, stage);

-- ============================================================
-- 8. Integrations
-- ============================================================

CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'error')),
    configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_integrations_tenant_provider
        UNIQUE (tenant_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_integrations_tenant_id
    ON integrations(tenant_id);

-- ============================================================
-- 9. Notifications
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user
    ON notifications(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_tenant
    ON notifications(tenant_id, created_at DESC);

-- ============================================================
-- 10. Audit Logs
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_created
    ON audit_logs(tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_resource
    ON audit_logs(resource_type, resource_id);

-- ============================================================
-- 11. Updated-at Trigger
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Apply updated_at triggers safely.
DROP TRIGGER IF EXISTS tenants_set_updated_at ON tenants;
CREATE TRIGGER tenants_set_updated_at
BEFORE UPDATE ON tenants
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS users_set_updated_at ON users;
CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS agents_set_updated_at ON agents;
CREATE TRIGGER agents_set_updated_at
BEFORE UPDATE ON agents
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS leads_set_updated_at ON leads;
CREATE TRIGGER leads_set_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS conversations_set_updated_at ON conversations;
CREATE TRIGGER conversations_set_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS appointments_set_updated_at ON appointments;
CREATE TRIGGER appointments_set_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS crm_records_set_updated_at ON crm_records;
CREATE TRIGGER crm_records_set_updated_at
BEFORE UPDATE ON crm_records
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS integrations_set_updated_at ON integrations;
CREATE TRIGGER integrations_set_updated_at
BEFORE UPDATE ON integrations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS notifications_set_updated_at ON notifications;
CREATE TRIGGER notifications_set_updated_at
BEFORE UPDATE ON notifications
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

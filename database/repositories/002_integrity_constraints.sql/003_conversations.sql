-- GrowthAI
-- PostgreSQL conversations schema
-- Migration: 003_conversations
--
-- Purpose:
-- 1. Store tenant-isolated AI/customer conversations.
-- 2. Connect conversations to leads and agents.
-- 3. Support multiple communication channels.
-- 4. Provide production-ready indexes for dashboard/API queries.
--
-- PostgreSQL only.
-- Supabase is not required.
-- MySQL is not used.

BEGIN;

-- =========================================================
-- LEADS TENANT-SAFE UNIQUE KEY
-- =========================================================
-- Required so conversations can safely reference
-- a lead together with its tenant.

ALTER TABLE leads
    ADD CONSTRAINT leads_id_tenant_unique
    UNIQUE (id, tenant_id);


-- =========================================================
-- CONVERSATIONS
-- =========================================================

CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID NOT NULL
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    lead_id UUID,
    agent_id UUID,

    channel VARCHAR(32) NOT NULL DEFAULT 'web'
        CHECK (
            channel IN (
                'web',
                'email',
                'whatsapp',
                'sms',
                'voice',
                'phone',
                'facebook',
                'instagram',
                'linkedin',
                'other'
            )
        ),

    status VARCHAR(32) NOT NULL DEFAULT 'active'
        CHECK (
            status IN (
                'active',
                'waiting',
                'resolved',
                'closed',
                'archived'
            )
        ),

    subject VARCHAR(255),

    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    last_message_at TIMESTAMPTZ,

    ended_at TIMESTAMPTZ,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Lead must belong to the same tenant.
    CONSTRAINT conversations_lead_same_tenant_fkey
        FOREIGN KEY (lead_id, tenant_id)
        REFERENCES leads (id, tenant_id)
        ON DELETE RESTRICT,

    -- Agent already has tenant-safe composite identity
    -- from migration 002.
    CONSTRAINT conversations_agent_same_tenant_fkey
        FOREIGN KEY (agent_id, tenant_id)
        REFERENCES agents (id, tenant_id)
        ON DELETE RESTRICT,

    -- End time cannot be earlier than start time.
    CONSTRAINT conversations_valid_time_range
        CHECK (
            ended_at IS NULL
            OR ended_at >= started_at
        )
);


-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_conversations_tenant_id
    ON conversations(tenant_id);

CREATE INDEX IF NOT EXISTS idx_conversations_lead_id
    ON conversations(lead_id);

CREATE INDEX IF NOT EXISTS idx_conversations_agent_id
    ON conversations(agent_id);

CREATE INDEX IF NOT EXISTS idx_conversations_status
    ON conversations(status);

CREATE INDEX IF NOT EXISTS idx_conversations_channel
    ON conversations(channel);

CREATE INDEX IF NOT EXISTS idx_conversations_created_at
    ON conversations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at
    ON conversations(last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_tenant_status
    ON conversations(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_conversations_tenant_created_at
    ON conversations(tenant_id, created_at DESC);


-- =========================================================
-- UPDATED_AT TRIGGER
-- =========================================================

DROP TRIGGER IF EXISTS conversations_set_updated_at
    ON conversations;

CREATE TRIGGER conversations_set_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


-- =========================================================
-- MIGRATION VERSION
-- =========================================================

INSERT INTO schema_migrations (version)
VALUES (3)
ON CONFLICT (version) DO NOTHING;

COMMIT;

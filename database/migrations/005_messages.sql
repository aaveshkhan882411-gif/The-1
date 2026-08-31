-- GrowthAI
-- PostgreSQL messages schema
-- Migration: 005_messages
--
-- Purpose:
-- 1. Store every message belonging to a conversation.
-- 2. Keep messages tenant-isolated.
-- 3. Support customer, AI agent, and system messages.
-- 4. Support text, structured content, attachments and metadata.
--
-- PostgreSQL only.
-- Supabase is not required.
-- MySQL is not used.

BEGIN;

-- =========================================================
-- CONVERSATIONS TENANT-SAFE UNIQUE KEY
-- =========================================================
-- Required so messages can verify that their conversation
-- belongs to the same tenant.

ALTER TABLE conversations
    ADD CONSTRAINT conversations_id_tenant_unique
    UNIQUE (id, tenant_id);


-- =========================================================
-- MESSAGES
-- =========================================================

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID NOT NULL
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    conversation_id UUID NOT NULL,

    agent_id UUID,

    sender_type VARCHAR(32) NOT NULL
        CHECK (
            sender_type IN (
                'customer',
                'agent',
                'system'
            )
        ),

    message_type VARCHAR(32) NOT NULL DEFAULT 'text'
        CHECK (
            message_type IN (
                'text',
                'image',
                'audio',
                'video',
                'file',
                'event',
                'system'
            )
        ),

    content TEXT,

    content_json JSONB,

    external_id VARCHAR(255),

    is_internal BOOLEAN NOT NULL DEFAULT FALSE,

    delivered_at TIMESTAMPTZ,

    read_at TIMESTAMPTZ,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT messages_conversation_same_tenant_fkey
        FOREIGN KEY (conversation_id, tenant_id)
        REFERENCES conversations (id, tenant_id)
        ON DELETE CASCADE,

    CONSTRAINT messages_agent_same_tenant_fkey
        FOREIGN KEY (agent_id, tenant_id)
        REFERENCES agents (id, tenant_id)
        ON DELETE SET NULL,

    CONSTRAINT messages_content_present
        CHECK (
            content IS NOT NULL
            OR content_json IS NOT NULL
        ),

    CONSTRAINT messages_read_after_delivery
        CHECK (
            read_at IS NULL
            OR delivered_at IS NULL
            OR read_at >= delivered_at
        )
);


-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_messages_tenant_id
    ON messages(tenant_id);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id
    ON messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_messages_agent_id
    ON messages(agent_id);

CREATE INDEX IF NOT EXISTS idx_messages_sender_type
    ON messages(sender_type);

CREATE INDEX IF NOT EXISTS idx_messages_message_type
    ON messages(message_type);

CREATE INDEX IF NOT EXISTS idx_messages_created_at
    ON messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_created_at
    ON messages(conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_tenant_created_at
    ON messages(tenant_id, created_at DESC);


-- =========================================================
-- MIGRATION VERSION
-- =========================================================

INSERT INTO schema_migrations (version)
VALUES (5)
ON CONFLICT (version) DO NOTHING;

COMMIT;

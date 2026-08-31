-- GrowthAI
-- PostgreSQL notifications schema
-- Migration: 008_notifications
--
-- Purpose:
-- 1. Store tenant-isolated notifications.
-- 2. Support user-specific and tenant-wide notifications.
-- 3. Track read/unread state.
-- 4. Support notification types and structured metadata.
--
-- PostgreSQL only.
-- Supabase is not required.
-- MySQL is not used.

BEGIN;

-- =========================================================
-- USERS TENANT-SAFE UNIQUE KEY
-- =========================================================
-- Required so a notification can safely reference a user
-- together with the user's tenant.

ALTER TABLE users
    ADD CONSTRAINT users_id_tenant_unique_notifications
    UNIQUE (id, tenant_id);

-- =========================================================
-- NOTIFICATIONS
-- =========================================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID NOT NULL
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    user_id UUID,

    type VARCHAR(64) NOT NULL,

    title VARCHAR(255) NOT NULL,

    message TEXT NOT NULL,

    status VARCHAR(32) NOT NULL DEFAULT 'unread'
        CHECK (
            status IN (
                'unread',
                'read',
                'archived'
            )
        ),

    priority VARCHAR(16) NOT NULL DEFAULT 'normal'
        CHECK (
            priority IN (
                'low',
                'normal',
                'high',
                'critical'
            )
        ),

    action_url TEXT,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    read_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT notifications_user_same_tenant_fkey
        FOREIGN KEY (user_id, tenant_id)
        REFERENCES users (id, tenant_id)
        ON DELETE CASCADE,

    CONSTRAINT notifications_read_state_valid
        CHECK (
            (status = 'read' AND read_at IS NOT NULL)
            OR
            (status <> 'read')
        )
);

-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_notifications_tenant_id
    ON notifications(tenant_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id
    ON notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_status
    ON notifications(status);

CREATE INDEX IF NOT EXISTS idx_notifications_type
    ON notifications(type);

CREATE INDEX IF NOT EXISTS idx_notifications_priority
    ON notifications(priority);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at
    ON notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_tenant_status
    ON notifications(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_notifications_user_status
    ON notifications(user_id, status);

-- =========================================================
-- MIGRATION VERSION
-- =========================================================

INSERT INTO schema_migrations (version)
VALUES (8)
ON CONFLICT (version) DO NOTHING;

COMMIT;

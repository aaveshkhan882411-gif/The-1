-- GrowthAI
-- PostgreSQL authentication sessions schema
-- Migration: 010_sessions
--
-- Purpose:
-- 1. Store server-side authentication sessions.
-- 2. Keep sessions tenant-isolated.
-- 3. Store only a HASHED session token, never the raw token.
-- 4. Support session expiry and revocation.
-- 5. Allow logout from one device/session without affecting others.
--
-- PostgreSQL only.
-- Supabase is not required.
-- MySQL is not used.

BEGIN;

-- =========================================================
-- SESSIONS
-- =========================================================

CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID NOT NULL
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    user_id UUID NOT NULL,

    token_hash VARCHAR(128) NOT NULL,

    expires_at TIMESTAMPTZ NOT NULL,

    revoked_at TIMESTAMPTZ,

    ip_address INET,

    user_agent TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    last_used_at TIMESTAMPTZ,

    CONSTRAINT sessions_user_same_tenant_fkey
        FOREIGN KEY (user_id, tenant_id)
        REFERENCES users (id, tenant_id)
        ON DELETE CASCADE,

    CONSTRAINT sessions_token_hash_unique
        UNIQUE (token_hash),

    CONSTRAINT sessions_expiry_valid
        CHECK (expires_at > created_at)
);

-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_sessions_tenant_id
    ON sessions(tenant_id);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id
    ON sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_sessions_expires_at
    ON sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_sessions_revoked_at
    ON sessions(revoked_at);

CREATE INDEX IF NOT EXISTS idx_sessions_user_active
    ON sessions(user_id, expires_at)
    WHERE revoked_at IS NULL;

-- =========================================================
-- MIGRATION VERSION
-- =========================================================

INSERT INTO schema_migrations (version)
VALUES (10)
ON CONFLICT (version) DO NOTHING;

COMMIT;

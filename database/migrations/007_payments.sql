-- GrowthAI
-- PostgreSQL payments schema
-- Migration: 007_payments
--
-- Purpose:
-- 1. Store payment transactions for each tenant.
-- 2. Support PayPal and future payment providers.
-- 3. Link payments to subscriptions.
-- 4. Prevent cross-tenant subscription references.
-- 5. Preserve provider transaction/order identifiers.
--
-- PostgreSQL only.
-- Supabase is not required.
-- MySQL is not used.

BEGIN;

-- =========================================================
-- SUBSCRIPTIONS TENANT-SAFE UNIQUE KEY
-- =========================================================
-- Required so payments can safely reference a subscription
-- together with its tenant.

ALTER TABLE subscriptions
    ADD CONSTRAINT subscriptions_id_tenant_unique
    UNIQUE (id, tenant_id);

-- =========================================================
-- PAYMENTS
-- =========================================================

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID NOT NULL
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    subscription_id UUID,

    provider VARCHAR(32) NOT NULL,

    provider_payment_id VARCHAR(255),

    provider_order_id VARCHAR(255),

    provider_capture_id VARCHAR(255),

    amount NUMERIC(14, 2) NOT NULL
        CHECK (amount >= 0),

    currency VARCHAR(3) NOT NULL DEFAULT 'USD',

    status VARCHAR(32) NOT NULL DEFAULT 'pending'
        CHECK (
            status IN (
                'pending',
                'authorized',
                'captured',
                'completed',
                'failed',
                'cancelled',
                'refunded',
                'partially_refunded'
            )
        ),

    payment_method VARCHAR(64),

    description TEXT,

    failure_code VARCHAR(128),

    failure_message TEXT,

    paid_at TIMESTAMPTZ,

    refunded_at TIMESTAMPTZ,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT payments_subscription_same_tenant_fkey
        FOREIGN KEY (subscription_id, tenant_id)
        REFERENCES subscriptions (id, tenant_id)
        ON DELETE SET NULL,

    CONSTRAINT payments_provider_payment_unique
        UNIQUE (provider, provider_payment_id),

    CONSTRAINT payments_provider_order_unique
        UNIQUE (provider, provider_order_id)
);

-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_payments_tenant_id
    ON payments(tenant_id);

CREATE INDEX IF NOT EXISTS idx_payments_subscription_id
    ON payments(subscription_id);

CREATE INDEX IF NOT EXISTS idx_payments_provider
    ON payments(provider);

CREATE INDEX IF NOT EXISTS idx_payments_status
    ON payments(status);

CREATE INDEX IF NOT EXISTS idx_payments_created_at
    ON payments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payments_tenant_created_at
    ON payments(tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payments_tenant_status
    ON payments(tenant_id, status);

-- =========================================================
-- UPDATED_AT TRIGGER
-- =========================================================

DROP TRIGGER IF EXISTS payments_set_updated_at
ON payments;

CREATE TRIGGER payments_set_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- MIGRATION VERSION
-- =========================================================

INSERT INTO schema_migrations (version)
VALUES (7)
ON CONFLICT (version) DO NOTHING;

COMMIT;

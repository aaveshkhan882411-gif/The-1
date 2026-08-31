-- GrowthAI
-- PostgreSQL appointments schema
-- Migration: 004_appointments
--
-- Purpose:
-- 1. Store tenant-isolated appointments.
-- 2. Connect appointments with leads and AI agents.
-- 3. Support scheduling, status tracking and external calendars.
-- 4. Provide production-ready indexes for dashboard/API queries.
--
-- PostgreSQL only.
-- Supabase is not required.
-- MySQL is not used.

BEGIN;

-- =========================================================
-- APPOINTMENTS
-- =========================================================

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID NOT NULL
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    lead_id UUID,
    agent_id UUID,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    status VARCHAR(32) NOT NULL DEFAULT 'scheduled'
        CHECK (
            status IN (
                'scheduled',
                'confirmed',
                'rescheduled',
                'completed',
                'cancelled',
                'no_show'
            )
        ),

    appointment_type VARCHAR(64) NOT NULL DEFAULT 'general',

    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,

    timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',

    location TEXT,

    meeting_url TEXT,

    external_provider VARCHAR(64),

    external_id VARCHAR(255),

    reminder_sent BOOLEAN NOT NULL DEFAULT FALSE,

    notes TEXT,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT appointments_time_valid
        CHECK (end_at > start_at),

    CONSTRAINT appointments_external_unique
        UNIQUE (external_provider, external_id)
);

-- =========================================================
-- TENANT INDEX
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_appointments_tenant_id
    ON appointments(tenant_id);

-- =========================================================
-- LEAD INDEX
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_appointments_lead_id
    ON appointments(lead_id);

-- =========================================================
-- AGENT INDEX
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_appointments_agent_id
    ON appointments(agent_id);

-- =========================================================
-- STATUS INDEX
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_appointments_status
    ON appointments(status);

-- =========================================================
-- SCHEDULE INDEX
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_appointments_start_at
    ON appointments(start_at);

CREATE INDEX IF NOT EXISTS idx_appointments_tenant_start_at
    ON appointments(tenant_id, start_at);

-- =========================================================
-- LEAD RELATIONSHIP
-- =========================================================
-- An appointment belongs to the same tenant as its lead.
--
-- The lead is deleted together with its tenant, so the
-- appointment remains tenant-safe through tenant_id.

ALTER TABLE appointments
    ADD CONSTRAINT appointments_lead_same_tenant_fkey
    FOREIGN KEY (lead_id, tenant_id)
    REFERENCES leads (id, tenant_id)
    ON DELETE CASCADE;

-- =========================================================
-- AGENT RELATIONSHIP
-- =========================================================
-- Agents already have the tenant-safe unique key created
-- by migration 002.

ALTER TABLE appointments
    ADD CONSTRAINT appointments_agent_same_tenant_fkey
    FOREIGN KEY (agent_id, tenant_id)
    REFERENCES agents (id, tenant_id)
    ON DELETE RESTRICT;

-- =========================================================
-- UPDATED_AT TRIGGER
-- =========================================================

DROP TRIGGER IF EXISTS appointments_set_updated_at
ON appointments;

CREATE TRIGGER appointments_set_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- MIGRATION VERSION
-- =========================================================

INSERT INTO schema_migrations (version)
VALUES (4)
ON CONFLICT (version) DO NOTHING;

COMMIT;

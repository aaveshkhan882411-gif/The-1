-- GrowthAI
-- PostgreSQL workflow automation schema
-- Migration: 006_workflows
--
-- Purpose:
-- 1. Store tenant-isolated automation workflows.
-- 2. Support workflow triggers and activation states.
-- 3. Store ordered workflow actions.
-- 4. Support future AI, lead, appointment and messaging automation.
--
-- PostgreSQL only.
-- Supabase is not required.
-- MySQL is not used.

BEGIN;

-- =========================================================
-- WORKFLOWS
-- =========================================================

CREATE TABLE IF NOT EXISTS workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID NOT NULL
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    name VARCHAR(160) NOT NULL,

    description TEXT,

    status VARCHAR(32) NOT NULL DEFAULT 'draft'
        CHECK (
            status IN (
                'draft',
                'active',
                'paused',
                'archived',
                'error'
            )
        ),

    trigger_type VARCHAR(64) NOT NULL,

    trigger_config JSONB NOT NULL DEFAULT '{}'::jsonb,

    settings JSONB NOT NULL DEFAULT '{}'::jsonb,

    execution_count BIGINT NOT NULL DEFAULT 0
        CHECK (execution_count >= 0),

    last_executed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- WORKFLOW ACTIONS
-- =========================================================

CREATE TABLE IF NOT EXISTS workflow_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID NOT NULL
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    workflow_id UUID NOT NULL,

    action_order INTEGER NOT NULL
        CHECK (action_order >= 1),

    action_type VARCHAR(64) NOT NULL,

    action_config JSONB NOT NULL DEFAULT '{}'::jsonb,

    enabled BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT workflow_actions_workflow_unique
        UNIQUE (workflow_id, action_order),

    CONSTRAINT workflow_actions_workflow_same_tenant_fkey
        FOREIGN KEY (workflow_id, tenant_id)
        REFERENCES workflows (id, tenant_id)
        ON DELETE CASCADE
);

-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_workflows_tenant_id
    ON workflows(tenant_id);

CREATE INDEX IF NOT EXISTS idx_workflows_status
    ON workflows(status);

CREATE INDEX IF NOT EXISTS idx_workflows_trigger_type
    ON workflows(trigger_type);

CREATE INDEX IF NOT EXISTS idx_workflows_tenant_status
    ON workflows(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_workflows_created_at
    ON workflows(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_workflow_actions_tenant_id
    ON workflow_actions(tenant_id);

CREATE INDEX IF NOT EXISTS idx_workflow_actions_workflow_id
    ON workflow_actions(workflow_id);

CREATE INDEX IF NOT EXISTS idx_workflow_actions_order
    ON workflow_actions(workflow_id, action_order);

CREATE INDEX IF NOT EXISTS idx_workflow_actions_enabled
    ON workflow_actions(enabled);

-- =========================================================
-- UPDATED_AT TRIGGERS
-- =========================================================

DROP TRIGGER IF EXISTS workflows_set_updated_at
ON workflows;

CREATE TRIGGER workflows_set_updated_at
BEFORE UPDATE ON workflows
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS workflow_actions_set_updated_at
ON workflow_actions;

CREATE TRIGGER workflow_actions_set_updated_at
BEFORE UPDATE ON workflow_actions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- MIGRATION VERSION
-- =========================================================

INSERT INTO schema_migrations (version)
VALUES (6)
ON CONFLICT (version) DO NOTHING;

COMMIT;

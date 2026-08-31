import "server-only";

import type { DatabaseAdapter } from "./types";
import type { UUID } from "./types";

export interface DashboardStats {
  readonly activeAgents: number;
  readonly leadsCaptured: number;
}

export interface DashboardAgent {
  readonly id: UUID;
  readonly name: string;
  readonly type: string;
  readonly status: string;
}

export interface DashboardLead {
  readonly id: UUID;
  readonly name: string;
  readonly email: string | null;
  readonly company: string | null;
  readonly status: string;
  readonly createdAt: string;
}

export interface DashboardData {
  readonly stats: DashboardStats;
  readonly agents: DashboardAgent[];
  readonly recentLeads: DashboardLead[];
}

export class DashboardRepository {
  constructor(
    private readonly db: DatabaseAdapter,
  ) {}

  async getStats(
    tenantId: UUID,
  ): Promise<DashboardStats> {
    const result = await this.db.query<{
      active_agents: string;
      leads_captured: string;
    }>(
      `
        SELECT
          (
            SELECT COUNT(*)
            FROM agents
            WHERE tenant_id = $1
              AND status = 'active'
          ) AS active_agents,

          (
            SELECT COUNT(*)
            FROM leads
            WHERE tenant_id = $1
              AND created_at >= date_trunc('month', NOW())
          ) AS leads_captured
      `,
      [tenantId],
    );

    const row = result.rows[0];

    return {
      activeAgents: Number(row?.active_agents ?? 0),
      leadsCaptured: Number(row?.leads_captured ?? 0),
    };
  }

  async getAgents(
    tenantId: UUID,
  ): Promise<DashboardAgent[]> {
    const result = await this.db.query<{
      id: UUID;
      name: string;
      type: string;
      status: string;
    }>(
      `
        SELECT
          id,
          name,
          type,
          status
        FROM agents
        WHERE tenant_id = $1
        ORDER BY created_at DESC
        LIMIT 20
      `,
      [tenantId],
    );

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      status: row.status,
    }));
  }

  async getRecentLeads(
    tenantId: UUID,
  ): Promise<DashboardLead[]> {
    const result = await this.db.query<{
      id: UUID;
      name: string;
      email: string | null;
      company: string | null;
      status: string;
      created_at: string;
    }>(
      `
        SELECT
          id,
          name,
          email,
          company,
          status,
          created_at
        FROM leads
        WHERE tenant_id = $1
        ORDER BY created_at DESC
        LIMIT 20
      `,
      [tenantId],
    );

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      company: row.company,
      status: row.status,
      createdAt: row.created_at,
    }));
  }

  async getDashboardData(
    tenantId: UUID,
  ): Promise<DashboardData> {
    const [stats, agents, recentLeads] =
      await Promise.all([
        this.getStats(tenantId),
        this.getAgents(tenantId),
        this.getRecentLeads(tenantId),
      ]);

    return {
      stats,
      agents,
      recentLeads,
    };
  }
}

import { query } from "../client";

export interface AgentRecord {
  id: string;
  tenant_id: string;
  name: string;
  role: string;
  system_prompt: string;
  model: string;
  status: string;
  configuration: any;
  created_at: Date;
  updated_at: Date;
}

export const agentRepository = {
  async findByIdAndTenant(id: string, tenantId: string): Promise<AgentRecord | null> {
    const res = await query(
      "SELECT * FROM agents WHERE id = $1 AND tenant_id = $2 LIMIT 1",
      [id, tenantId]
    );
    return res.rows[0] || null;
  },

  async findByTenant(tenantId: string): Promise<AgentRecord[]> {
    const res = await query(
      "SELECT * FROM agents WHERE tenant_id = $1 ORDER BY created_at ASC",
      [tenantId]
    );
    return res.rows;
  },

  async create(agent: {
    tenant_id: string;
    name: string;
    role: string;
    system_prompt: string;
    model?: string;
    status?: string;
    configuration?: any;
  }): Promise<AgentRecord> {
    const res = await query(
      `INSERT INTO agents (tenant_id, name, role, system_prompt, model, status, configuration)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        agent.tenant_id,
        agent.name,
        agent.role,
        agent.system_prompt,
        agent.model || "local-default",
        agent.status || "active",
        JSON.stringify(agent.configuration || {})
      ]
    );
    return res.rows[0];
  },

  async updateStatus(id: string, tenantId: string, status: string): Promise<AgentRecord | null> {
    const res = await query(
      `UPDATE agents SET status = $1, updated_at = NOW()
       WHERE id = $2 AND tenant_id = $3
       RETURNING *`,
      [status, id, tenantId]
    );
    return res.rows[0] || null;
  }
};

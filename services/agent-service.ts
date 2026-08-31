import { AgentRepository } from "../database/repositories/agent-repository";
import { DatabaseRecord } from "../database/types";

export type AgentStatus = "active" | "inactive" | "paused" | "error";

export type AgentRoleType =
  | "ceo"
  | "sales"
  | "receptionist"
  | "voice"
  | "support"
  | "followup"
  | "appointment"
  | "crm"
  | "email"
  | "whatsapp"
  | "review_manager"
  | "analytics"
  | "workflow";

export interface CreateAgentInput {
  tenant_id: string;
  name: string;
  type: AgentRoleType;
  description?: string;
  system_prompt?: string;
  configuration?: Record<string, unknown>;
  allowed_tools?: string[];
  status?: AgentStatus;
}

export interface UpdateAgentInput {
  name?: string;
  description?: string;
  system_prompt?: string;
  configuration?: Record<string, unknown>;
  allowed_tools?: string[];
  status?: AgentStatus;
}

export class AgentService {
  private agentRepo: AgentRepository;

  constructor(agentRepo?: AgentRepository) {
    this.agentRepo = agentRepo || new AgentRepository();
  }

  async getAgentById(tenantId: string, agentId: string): Promise<DatabaseRecord | null> {
    if (!tenantId || !agentId) {
      throw new Error("Tenant ID and Agent ID are required.");
    }
    const agent = await this.agentRepo.findById(agentId);
    if (!agent || agent.tenant_id !== tenantId) {
      return null;
    }
    return agent;
  }

  async listAgents(tenantId: string, status?: AgentStatus): Promise<DatabaseRecord[]> {
    if (!tenantId) {
      throw new Error("Tenant ID is required.");
    }
    const criteria: Record<string, unknown> = { tenant_id: tenantId };
    if (status) {
      criteria.status = status;
    }
    return await this.agentRepo.findMany(criteria);
  }

  async createAgent(input: CreateAgentInput): Promise<DatabaseRecord> {
    if (!input.tenant_id || !input.name || !input.type) {
      throw new Error("Tenant ID, Agent Name, and Agent Type are required.");
    }

    return await this.agentRepo.create({
      tenant_id: input.tenant_id,
      name: input.name.trim(),
      type: input.type,
      description: input.description || "",
      system_prompt: input.system_prompt || "",
      configuration: JSON.stringify(input.configuration || {}),
      allowed_tools: JSON.stringify(input.allowed_tools || []),
      status: input.status || "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  async updateAgent(
    tenantId: string,
    agentId: string,
    input: UpdateAgentInput
  ): Promise<DatabaseRecord | null> {
    if (!tenantId || !agentId) {
      throw new Error("Tenant ID and Agent ID are required.");
    }

    const agent = await this.getAgentById(tenantId, agentId);
    if (!agent) {
      throw new Error("Agent not found or does not belong to this tenant.");
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };

    if (input.name !== undefined) updateData.name = input.name.trim();
    if (input.description !== undefined) updateData.description = input.description;
    if (input.system_prompt !== undefined) updateData.system_prompt = input.system_prompt;
    if (input.configuration !== undefined) updateData.configuration = JSON.stringify(input.configuration);
    if (input.allowed_tools !== undefined) updateData.allowed_tools = JSON.stringify(input.allowed_tools);
    if (input.status !== undefined) updateData.status = input.status;

    return await this.agentRepo.update(agentId, updateData);
  }

  async countActiveAgents(tenantId: string): Promise<number> {
    if (!tenantId) {
      throw new Error("Tenant ID is required.");
    }
    return await this.agentRepo.countActiveByTenant(tenantId);
  }
}


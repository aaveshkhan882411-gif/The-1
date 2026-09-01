import * as AgentRepoModule from "../database/repositories/agent-repository";
import { DatabaseRecord } from "../database/types";

// Get constructor or instance whether it is default or named export
const RepoClass: any =
  (AgentRepoModule as any).AgentRepository ||
  (AgentRepoModule as any).default ||
  AgentRepoModule;

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
  private agentRepo: any;

  constructor(agentRepo?: any) {
    if (agentRepo) {
      this.agentRepo = agentRepo;
    } else if (typeof RepoClass === "function") {
      this.agentRepo = new RepoClass();
    } else {
      this.agentRepo = RepoClass;
    }
  }

  async getAgentById(tenantId: string, agentId: string): Promise<DatabaseRecord | null> {
    if (!tenantId || !agentId) {
      throw new Error("Tenant ID and Agent ID are required.");
    }
    const agent = await this.agentRepo.findById(agentId);
    if (!agent || (agent as any).tenant_id !== tenantId) {
      return null;
    }
    return agent as DatabaseRecord;
  }

  async listAgents(tenantId: string, status?: AgentStatus): Promise<DatabaseRecord[]> {
    if (!tenantId) {
      throw new Error("Tenant ID is required.");
    }
    const criteria: Record<string, unknown> = { tenant_id: tenantId };
    if (status) {
      criteria.status = status;
    }
    const result = await this.agentRepo.findMany(criteria);
    return (result || []) as DatabaseRecord[];
  }

  async createAgent(input: CreateAgentInput): Promise<DatabaseRecord> {
    if (!input.tenant_id || !input.name || !input.type) {
      throw new Error("Tenant ID, Agent Name, and Agent Type are required.");
    }

    const created = await this.agentRepo.create({
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

    return created as DatabaseRecord;
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

    const updated = await this.agentRepo.update(agentId, updateData);
    return updated as DatabaseRecord;
  }

  async countActiveAgents(tenantId: string): Promise<number> {
    if (!tenantId) {
      throw new Error("Tenant ID is required.");
    }
    if (typeof this.agentRepo.countActiveByTenant === "function") {
      return await this.agentRepo.countActiveByTenant(tenantId);
    }
    const active = await this.listAgents(tenantId, "active");
    return active.length;
  }
}

export default AgentService;

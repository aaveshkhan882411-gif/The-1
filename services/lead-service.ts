import { LeadRepository } from "../database/repositories/lead-repository";
import { DatabaseRecord } from "../database/types";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "appointment"
  | "converted"
  | "lost"
  | "archived";

export interface CreateLeadInput {
  tenant_id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  notes?: string;
  assigned_agent_id?: string;
  score?: number;
  metadata?: Record<string, unknown>;
}

export interface UpdateLeadInput {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  status?: LeadStatus;
  notes?: string;
  assigned_agent_id?: string;
  score?: number;
  metadata?: Record<string, unknown>;
}

export class LeadService {
  private leadRepo: LeadRepository;

  constructor(leadRepo?: LeadRepository) {
    this.leadRepo = leadRepo || new LeadRepository();
  }

  async getLeadById(tenantId: string, leadId: string): Promise<DatabaseRecord | null> {
    if (!tenantId || !leadId) {
      throw new Error("Tenant ID and Lead ID are required.");
    }
    const lead = await this.leadRepo.findById(leadId);
    if (!lead || lead.tenant_id !== tenantId) {
      return null;
    }
    return lead;
  }

  async createLead(input: CreateLeadInput): Promise<DatabaseRecord> {
    if (!input.tenant_id || !input.name) {
      throw new Error("Tenant ID and Lead Name are required.");
    }

    return await this.leadRepo.create({
      tenant_id: input.tenant_id,
      name: input.name.trim(),
      email: input.email ? input.email.toLowerCase().trim() : null,
      phone: input.phone || null,
      company: input.company || null,
      source: input.source || "web",
      status: "new",
      notes: input.notes || null,
      assigned_agent_id: input.assigned_agent_id || null,
      metadata: JSON.stringify({
        score: input.score ?? 0,
        ...(input.metadata || {})
      }),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  async updateLead(
    tenantId: string,
    leadId: string,
    input: UpdateLeadInput
  ): Promise<DatabaseRecord | null> {
    if (!tenantId || !leadId) {
      throw new Error("Tenant ID and Lead ID are required.");
    }

    const lead = await this.getLeadById(tenantId, leadId);
    if (!lead) {
      throw new Error("Lead not found or does not belong to this tenant.");
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };

    if (input.name !== undefined) updateData.name = input.name.trim();
    if (input.email !== undefined) updateData.email = input.email ? input.email.toLowerCase().trim() : null;
    if (input.phone !== undefined) updateData.phone = input.phone;
    if (input.company !== undefined) updateData.company = input.company;
    if (input.source !== undefined) updateData.source = input.source;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.notes !== undefined) updateData.notes = input.notes;
    if (input.assigned_agent_id !== undefined) updateData.assigned_agent_id = input.assigned_agent_id;

    if (input.metadata !== undefined || input.score !== undefined) {
      let existingMetadata: Record<string, unknown> = {};
      try {
        if (typeof lead.metadata === "string") {
          existingMetadata = JSON.parse(lead.metadata);
        } else if (typeof lead.metadata === "object" && lead.metadata !== null) {
          existingMetadata = lead.metadata as Record<string, unknown>;
        }
      } catch {
        existingMetadata = {};
      }

      const mergedMetadata = {
        ...existingMetadata,
        ...(input.metadata || {})
      };

      if (input.score !== undefined) {
        mergedMetadata.score = input.score;
      }

      updateData.metadata = JSON.stringify(mergedMetadata);
    }

    return await this.leadRepo.update(leadId, updateData);
  }

  async listLeads(
    tenantId: string,
    filters?: { status?: LeadStatus; assigned_agent_id?: string },
    limit = 50,
    offset = 0
  ): Promise<DatabaseRecord[]> {
    if (!tenantId) {
      throw new Error("Tenant ID is required.");
    }

    const criteria: Record<string, unknown> = { tenant_id: tenantId };
    if (filters?.status) criteria.status = filters.status;
    if (filters?.assigned_agent_id) criteria.assigned_agent_id = filters.assigned_agent_id;

    return await this.leadRepo.findMany(criteria, { limit, offset });
  }

  async countLeads(tenantId: string): Promise<number> {
    if (!tenantId) {
      throw new Error("Tenant ID is required.");
    }
    return await this.leadRepo.countByTenant(tenantId);
  }
}


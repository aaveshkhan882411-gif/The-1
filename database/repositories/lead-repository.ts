/**
 * @file database/repositories/lead-repository.ts
 * @description Repository pattern implementation for Leads.
 */

export type UUID = string;

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost' | 'converted';

export interface LeadRecord {
  id: UUID;
  tenantId: UUID;
  name: string;
  email?: string;
  phone?: string;
  status: LeadStatus;
  score?: number;
  assignedAgentId?: UUID;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLeadInput {
  tenantId: UUID;
  name: string;
  email?: string;
  phone?: string;
  status?: LeadStatus;
  score?: number;
  assignedAgentId?: UUID;
  metadata?: Record<string, unknown>;
}

export interface UpdateLeadInput {
  name?: string;
  email?: string;
  phone?: string;
  status?: LeadStatus;
  score?: number;
  assignedAgentId?: UUID;
  metadata?: Record<string, unknown>;
}

export interface Repository<T, TCreateInput, TUpdateInput> {
  findById(id: string): Promise<T | null>;
  create(input: TCreateInput): Promise<T>;
  update?(id: string, input: TUpdateInput): Promise<T | null>;
  delete?(id: string): Promise<boolean>;
}

export class LeadRepository implements Repository<LeadRecord, CreateLeadInput, UpdateLeadInput> {
  private leads: LeadRecord[] = [];

  /**
   * Find lead by ID.
   * tenantId is optional to satisfy base Repository interface.
   */
  public async findById(
    id: UUID,
    tenantId?: UUID
  ): Promise<LeadRecord | null> {
    const record = this.leads.find((lead) => {
      if (tenantId) {
        return lead.id === id && lead.tenantId === tenantId;
      }
      return lead.id === id;
    });

    return record || null;
  }

  /**
   * Create a new lead.
   */
  public async create(input: CreateLeadInput): Promise<LeadRecord> {
    const record: LeadRecord = {
      id: crypto.randomUUID(),
      tenantId: input.tenantId,
      name: input.name,
      email: input.email,
      phone: input.phone,
      status: input.status || 'new',
      score: input.score ?? 0,
      assignedAgentId: input.assignedAgentId,
      metadata: input.metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.leads.push(record);
    return record;
  }

  /**
   * Update an existing lead.
   */
  public async update(
    id: UUID,
    input: UpdateLeadInput
  ): Promise<LeadRecord | null> {
    const index = this.leads.findIndex((lead) => lead.id === id);
    if (index === -1) return null;

    const existing = this.leads[index];
    const updated: LeadRecord = {
      ...existing,
      ...input,
      updatedAt: new Date(),
    };

    this.leads[index] = updated;
    return updated;
  }

  /**
   * List all leads for a tenant.
   */
  public async findByTenantId(tenantId: UUID): Promise<LeadRecord[]> {
    return this.leads.filter((lead) => lead.tenantId === tenantId);
  }

  /**
   * Delete lead by ID.
   */
  public async delete(id: UUID): Promise<boolean> {
    const initialLength = this.leads.length;
    this.leads = this.leads.filter((lead) => lead.id !== id);
    return this.leads.length < initialLength;
  }
}

export const leadRepository = new LeadRepository();
export default leadRepository;

/**
 * @file types/lead.ts
 * @description Production-grade TypeScript type definitions for GrowthAI leads,
 * qualification, scoring, assignment, and lifecycle management.
 */

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'unqualified'
  | 'converted'
  | 'lost'
  | 'archived';

export type LeadSource =
  | 'website'
  | 'landing_page'
  | 'whatsapp'
  | 'email'
  | 'phone'
  | 'social_media'
  | 'advertisement'
  | 'referral'
  | 'api'
  | 'manual'
  | 'other';

export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';

export type LeadTemperature = 'cold' | 'warm' | 'hot';

export type LeadQualification =
  | 'pending'
  | 'qualified'
  | 'partially_qualified'
  | 'unqualified';

export interface LeadContactInfo {
  email?: string;
  phone?: string;
  alternatePhone?: string;
  preferredContactMethod?: 'email' | 'phone' | 'whatsapp' | 'sms';
}

export interface LeadCompanyInfo {
  companyName?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  jobTitle?: string;
}

export interface LeadAddress {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface LeadQualificationData {
  qualification: LeadQualification;
  score: number;
  temperature: LeadTemperature;
  budget?: number;
  currency?: string;
  timeline?: string;
  requirements?: string[];
  qualificationNotes?: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type:
    | 'created'
    | 'updated'
    | 'message'
    | 'call'
    | 'email'
    | 'whatsapp'
    | 'appointment'
    | 'status_change'
    | 'note'
    | 'assignment';
  description: string;
  performedBy?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Lead {
  id: string;
  tenantId: string;

  firstName: string;
  lastName?: string;

  contact: LeadContactInfo;
  company?: LeadCompanyInfo;
  address?: LeadAddress;

  status: LeadStatus;
  source: LeadSource;
  priority: LeadPriority;

  qualification: LeadQualificationData;

  assignedAgentId?: string;
  assignedUserId?: string;

  tags: string[];
  notes?: string;

  lastContactedAt?: string;
  nextFollowUpAt?: string;
  convertedAt?: string;

  activities: LeadActivity[];

  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadInput {
  tenantId: string;

  firstName: string;
  lastName?: string;

  contact: LeadContactInfo;
  company?: LeadCompanyInfo;
  address?: LeadAddress;

  source: LeadSource;
  priority?: LeadPriority;

  qualification?: Partial<LeadQualificationData>;

  assignedAgentId?: string;
  assignedUserId?: string;

  tags?: string[];
  notes?: string;

  nextFollowUpAt?: string;
}

export interface UpdateLeadInput {
  firstName?: string;
  lastName?: string;

  contact?: Partial<LeadContactInfo>;
  company?: Partial<LeadCompanyInfo>;
  address?: Partial<LeadAddress>;

  status?: LeadStatus;
  source?: LeadSource;
  priority?: LeadPriority;

  qualification?: Partial<LeadQualificationData>;

  assignedAgentId?: string;
  assignedUserId?: string;

  tags?: string[];
  notes?: string;

  nextFollowUpAt?: string;
}

export interface LeadSummary {
  id: string;
  tenantId: string;
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  status: LeadStatus;
  source: LeadSource;
  priority: LeadPriority;
  score: number;
  temperature: LeadTemperature;
  assignedAgentId?: string;
  lastContactedAt?: string;
  nextFollowUpAt?: string;
  createdAt: string;
}

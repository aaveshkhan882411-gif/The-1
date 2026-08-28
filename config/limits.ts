/**
 * @file config/limits.ts
 * @description Production-ready limits and quotas for GrowthAI SaaS subscription tiers.
 */

import type { SubscriptionPlan } from '../types/user';

export interface SubscriptionLimits {
  tier: SubscriptionPlan;
  maxAiAgents: number;
  maxMonthlyAiInteractions: number;
  maxApiRequestsPerMinute: number;
  maxLeads: number;
  maxAppointmentsPerMonth: number;
  maxTeamMembers: number;
  maxStorageBytes: number;
  maxActiveWorkflows: number;
}

export const LIMITS_CONFIG: Record<SubscriptionPlan, SubscriptionLimits> = {
  starter: {
    tier: 'starter',
    maxAiAgents: 2,
    maxMonthlyAiInteractions: 1000,
    maxApiRequestsPerMinute: 30,
    maxLeads: 500,
    maxAppointmentsPerMonth: 50,
    maxTeamMembers: 2,
    maxStorageBytes: 1_073_741_824,
    maxActiveWorkflows: 3,
  },

  professional: {
    tier: 'professional',
    maxAiAgents: 5,
    maxMonthlyAiInteractions: 10_000,
    maxApiRequestsPerMinute: 60,
    maxLeads: 5_000,
    maxAppointmentsPerMonth: 250,
    maxTeamMembers: 5,
    maxStorageBytes: 10_737_418_240,
    maxActiveWorkflows: 15,
  },

  growth: {
    tier: 'growth',
    maxAiAgents: 13,
    maxMonthlyAiInteractions: 50_000,
    maxApiRequestsPerMinute: 120,
    maxLeads: 25_000,
    maxAppointmentsPerMonth: 1_000,
    maxTeamMembers: 15,
    maxStorageBytes: 53_687_091_200,
    maxActiveWorkflows: 50,
  },

  enterprise: {
    tier: 'enterprise',
    maxAiAgents: 50,
    maxMonthlyAiInteractions: 500_000,
    maxApiRequestsPerMinute: 500,
    maxLeads: 250_000,
    maxAppointmentsPerMonth: 10_000,
    maxTeamMembers: 100,
    maxStorageBytes: 536_870_912_000,
    maxActiveWorkflows: 250,
  },
};

export function getLimitsByPlan(
  plan: string | null | undefined
): SubscriptionLimits {
  if (
    plan &&
    Object.prototype.hasOwnProperty.call(LIMITS_CONFIG, plan)
  ) {
    return LIMITS_CONFIG[plan as SubscriptionPlan];
  }

  return LIMITS_CONFIG.starter;
}

export default LIMITS_CONFIG;

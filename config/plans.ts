export interface PlanDefinition {
  id: string;
  name: string;
  price: number; // in USD
  currency: string;
  billingPeriod: "monthly" | "annual" | "trial_5_days" | "trial_7_days" | "membership_fixed";
  agentsAllowed: number;
  isCustomQuote: boolean;
  features: string[];
}

export const GROWTHAI_PLANS: Record<string, PlanDefinition> = {
  "standard-monthly": {
    id: "standard-monthly",
    name: "Standard AI Workforce",
    price: 1999,
    currency: "USD",
    billingPeriod: "monthly",
    agentsAllowed: 4,
    isCustomQuote: false,
    features: ["4 AI Workforce Agents", "Lead Qualification", "Email & CRM Sync", "Standard Support"]
  },
  "premium-monthly": {
    id: "premium-monthly",
    name: "Premium AI Workforce",
    price: 2999,
    currency: "USD",
    billingPeriod: "monthly",
    agentsAllowed: 7,
    isCustomQuote: false,
    features: ["7 AI Workforce Agents", "Voice & WhatsApp Integration", "Automated Booking", "Priority Inference"]
  },
  "enterprise-monthly": {
    id: "enterprise-monthly",
    name: "Enterprise Complete Workforce",
    price: 3999,
    currency: "USD",
    billingPeriod: "monthly",
    agentsAllowed: 13,
    isCustomQuote: false,
    features: ["All 13 AI Employees", "Full Self-Hosted Dedicated Inference", "Custom Workflows", "Dedicated Support"]
  },
  "enterprise-custom": {
    id: "enterprise-custom",
    name: "Enterprise Architecture Consultation",
    price: 25000,
    currency: "USD",
    billingPeriod: "monthly",
    agentsAllowed: 13,
    isCustomQuote: true,
    features: ["Custom Model Training", "On-Premises Infrastructure Setup", "SLA Guarantee", "Dedicated Solutions Architect"]
  },
  "trial-5-day": {
    id: "trial-5-day",
    name: "5-Day Full Workforce Trial",
    price: 350,
    currency: "USD",
    billingPeriod: "trial_5_days",
    agentsAllowed: 13,
    isCustomQuote: false,
    features: ["5-day unrestricted access to AI employees", "Self-hosted inference pipeline testing"]
  },
  "trial-7-day": {
    id: "trial-7-day",
    name: "7-Day Full Workforce Trial",
    price: 500,
    currency: "USD",
    billingPeriod: "trial_7_days",
    agentsAllowed: 13,
    isCustomQuote: false,
    features: ["7-day complete access to AI workforce", "Full workflow & lead automation testing"]
  },
  "membership-1m": {
    id: "membership-1m",
    name: "1-Month Platform Membership",
    price: 150,
    currency: "USD",
    billingPeriod: "membership_fixed",
    agentsAllowed: 0,
    isCustomQuote: false,
    features: ["Platform access pass", "Discounted rate on all agent upgrades"]
  },
  "membership-6m": {
    id: "membership-6m",
    name: "6-Month Platform Membership",
    price: 700,
    currency: "USD",
    billingPeriod: "membership_fixed",
    agentsAllowed: 0,
    isCustomQuote: false,
    features: ["6-month platform access", "Preferential agent pricing"]
  },
  "membership-1y": {
    id: "membership-1y",
    name: "1-Year Platform Membership",
    price: 1000,
    currency: "USD",
    billingPeriod: "membership_fixed",
    agentsAllowed: 0,
    isCustomQuote: false,
    features: ["Annual platform membership pass", "Maximum discount tier"]
  },
  "annual-business": {
    id: "annual-business",
    name: "Business Annual Workforce",
    price: 35000,
    currency: "USD",
    billingPeriod: "annual",
    agentsAllowed: 7,
    isCustomQuote: false,
    features: ["Yearly upfront discount", "7 AI Agents included all year"]
  },
  "annual-enterprise": {
    id: "annual-enterprise",
    name: "Enterprise Annual Workforce",
    price: 45000,
    currency: "USD",
    billingPeriod: "annual",
    agentsAllowed: 13,
    isCustomQuote: false,
    features: ["All 13 AI Agents included all year", "VIP compute allocation"]
  }
};

export function getPlan(planId: string): PlanDefinition | undefined {
  return GROWTHAI_PLANS[planId];
}

export function isValidPurchasablePlan(planId: string): boolean {
  const plan = GROWTHAI_PLANS[planId];
  return !!plan && !plan.isCustomQuote;
}


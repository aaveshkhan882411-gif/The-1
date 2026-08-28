/**
 * @file config/agents.ts
 * @description Centralized default agent configurations for all 13 GrowthAI AI workforce roles.
 */

import { AgentRole, AgentType, AgentPermission, AgentCapability } from '../types/agent';

export interface DefaultAgentConfigTemplate {
  id: string;
  name: string;
  role: AgentRole;
  type: AgentType;
  description: string;
  enabled: boolean;
  avatarUrl: string;
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  primaryLanguage: string;
  supportedLanguages: string[];
  systemPrompt: string;
  fallbackBehavior: 'escalate_to_human' | 'retry' | 'graceful_exit';
  autoReplyEnabled: boolean;
  responseTimeLimitSeconds: number;
  permissions: {
    canAccessCrm: boolean;
    canSendEmails: boolean;
    canSendWhatsapp: boolean;
    canBookCalendar: boolean;
    allowedActions: AgentPermission[];
  };
  capabilities: AgentCapability[];
}

const COMMON_LANGUAGES = ['en', 'hi', 'es', 'fr', 'de'];

const ALL_PERMISSIONS: AgentPermission[] = [
  'read_leads',
  'write_leads',
  'send_messages',
  'book_appointments',
  'manage_billing',
  'execute_workflows',
  'view_analytics',
];

export const DEFAULT_AGENT_CONFIGS: Record<AgentRole, DefaultAgentConfigTemplate> = {
  ceo: {
    id: 'agent-default-ceo',
    name: 'AI CEO Orchestrator',
    role: 'ceo',
    type: 'autonomous',
    description: 'Strategic leadership, multi-agent coordination, and high-level enterprise analytics.',
    enabled: true,
    avatarUrl: '/assets/assistant.svg',
    defaultModel: 'gpt-4o',
    temperature: 0.3,
    maxTokens: 2048,
    primaryLanguage: 'en',
    supportedLanguages: COMMON_LANGUAGES,
    systemPrompt: 'You are the AI CEO of GrowthAI. Your mission is to oversee all autonomous agents, optimize enterprise efficiency, and ensure no lead is ever missed.',
    fallbackBehavior: 'escalate_to_human',
    autoReplyEnabled: true,
    responseTimeLimitSeconds: 15,
    permissions: {
      canAccessCrm: true,
      canSendEmails: true,
      canSendWhatsapp: true,
      canBookCalendar: true,
      allowedActions: ALL_PERMISSIONS,
    },
    capabilities: [
      { id: 'cap-ceo-1', name: 'Strategic Oversight', enabled: true },
      { id: 'cap-ceo-2', name: 'Agent Orchestration', enabled: true },
    ],
  },
  sales: {
    id: 'agent-default-sales',
    name: 'AI Sales Closer',
    role: 'sales',
    type: 'autonomous',
    description: 'Inbound lead qualification, objection handling, and pipeline conversion.',
    enabled: true,
    avatarUrl: '/assets/assistant.svg',
    defaultModel: 'gpt-4o',
    temperature: 0.4,
    maxTokens: 1500,
    primaryLanguage: 'en',
    supportedLanguages: COMMON_LANGUAGES,
    systemPrompt: 'You are the GrowthAI Sales Agent. Engage inbound prospects immediately, uncover pain points, handle objections professionally, and guide them to conversion.',
    fallbackBehavior: 'escalate_to_human',
    autoReplyEnabled: true,
    responseTimeLimitSeconds: 5,
    permissions: {
      canAccessCrm: true,
      canSendEmails: true,
      canSendWhatsapp: true,
      canBookCalendar: true,
      allowedActions: ['read_leads', 'write_leads', 'send_messages', 'book_appointments'],
    },
    capabilities: [
      { id: 'cap-sales-1', name: 'Instant Lead Qualification', enabled: true },
      { id: 'cap-sales-2', name: 'Automated Closing Sequences', enabled: true },
    ],
  },
  receptionist: {
    id: 'agent-default-receptionist',
    name: 'AI Front Desk Receptionist',
    role: 'receptionist',
    type: 'autonomous',
    description: '24/7 polite greeting, inquiry filtering, and initial routing.',
    enabled: true,
    avatarUrl: '/assets/assistant.svg',
    defaultModel: 'gpt-4o-mini',
    temperature: 0.5,
    maxTokens: 1000,
    primaryLanguage: 'en',
    supportedLanguages: COMMON_LANGUAGES,
    systemPrompt: 'You are the 24/7 GrowthAI Receptionist. Greet visitors warmly, capture contact information, and route their request to the appropriate specialist agent.',
    fallbackBehavior: 'graceful_exit',
    autoReplyEnabled: true,
    responseTimeLimitSeconds: 3,
    permissions: {
      canAccessCrm: true,
      canSendEmails: false,
      canSendWhatsapp: true,
      canBookCalendar: false,
      allowedActions: ['read_leads', 'write_leads', 'send_messages'],
    },
    capabilities: [
      { id: 'cap-rec-1', name: '24/7 Instant Greeting', enabled: true },
      { id: 'cap-rec-2', name: 'Smart Inquiry Routing', enabled: true },
    ],
  },
  voice: {
    id: 'agent-default-voice',
    name: 'AI Voice Specialist',
    role: 'voice',
    type: 'autonomous',
    description: 'Real-time conversational voice calls and phone interactions.',
    enabled: true,
    avatarUrl: '/assets/assistant.svg',
    defaultModel: 'gpt-4o-realtime',
    temperature: 0.4,
    maxTokens: 1000,
    primaryLanguage: 'en',
    supportedLanguages: COMMON_LANGUAGES,
    systemPrompt: 'You are the GrowthAI Voice Agent. Handle phone calls naturally, speak concisely, listen attentively, and assist callers with appointments and inquiries.',
    fallbackBehavior: 'escalate_to_human',
    autoReplyEnabled: true,
    responseTimeLimitSeconds: 2,
    permissions: {
      canAccessCrm: true,
      canSendEmails: false,
      canSendWhatsapp: false,
      canBookCalendar: true,
      allowedActions: ['read_leads', 'write_leads', 'book_appointments'],
    },
    capabilities: [
      { id: 'cap-voice-1', name: 'Low-Latency Voice Synthesis', enabled: true },
      { id: 'cap-voice-2', name: 'Live Call Transcription', enabled: true },
    ],
  },
  support: {
    id: 'agent-default-support',
    name: 'AI Customer Support',
    role: 'support',
    type: 'autonomous',
    description: 'Immediate ticket resolution, troubleshooting, and customer care.',
    enabled: true,
    avatarUrl: '/assets/assistant.svg',
    defaultModel: 'gpt-4o-mini',
    temperature: 0.3,
    maxTokens: 1500,
    primaryLanguage: 'en',
    supportedLanguages: COMMON_LANGUAGES,
    systemPrompt: 'You are the GrowthAI Customer Support Agent. Resolve customer issues accurately and empathetically, referencing documentation and past interaction history.',
    fallbackBehavior: 'escalate_to_human',
    autoReplyEnabled: true,
    responseTimeLimitSeconds: 10,
    permissions: {
      canAccessCrm: true,
      canSendEmails: true,
      canSendWhatsapp: true,
      canBookCalendar: false,
      allowedActions: ['read_leads', 'write_leads', 'send_messages'],
    },
    capabilities: [
      { id: 'cap-supp-1', name: 'Instant Ticket Resolution', enabled: true },
      { id: 'cap-supp-2', name: 'Knowledge Base Grounding', enabled: true },
    ],
  },
  follow_up: {
    id: 'agent-default-follow-up',
    name: 'AI Follow-Up Engine',
    role: 'follow_up',
    type: 'trigger_based',
    description: 'Autonomous multi-touch sequence execution to re-engage cold leads.',
    enabled: true,
    avatarUrl: '/assets/assistant.svg',
    defaultModel: 'gpt-4o-mini',
    temperature: 0.4,
    maxTokens: 1200,
    primaryLanguage: 'en',
    supportedLanguages: COMMON_LANGUAGES,
    systemPrompt: 'You are the GrowthAI Follow-Up Agent. Never let a prospect slip away. Execute personalized multi-channel re-engagement sequences at optimal intervals.',
    fallbackBehavior: 'retry',
    autoReplyEnabled: true,
    responseTimeLimitSeconds: 30,
    permissions: {
      canAccessCrm: true,
      canSendEmails: true,
      canSendWhatsapp: true,
      canBookCalendar: false,
      allowedActions: ['read_leads', 'write_leads', 'send_messages', 'execute_workflows'],
    },
    capabilities: [
      { id: 'cap-fu-1', name: 'Multi-Touch Sequencing', enabled: true },
      { id: 'cap-fu-2', name: 'Cold Lead Re-activation', enabled: true },
    ],
  },
  appointment: {
    id: 'agent-default-appointment',
    name: 'AI Calendar & Booking Agent',
    role: 'appointment',
    type: 'autonomous',
    description: 'Frictionless scheduling, calendar synchronization, and meeting reminders.',
    enabled: true,
    avatarUrl: '/assets/assistant.svg',
    defaultModel: 'gpt-4o-mini',
    temperature: 0.2,
    maxTokens: 800,
    primaryLanguage: 'en',
    supportedLanguages: COMMON_LANGUAGES,
    systemPrompt: 'You are the GrowthAI Appointment Agent. Seamlessly coordinate schedules, book meetings without friction, and send intelligent reminders to minimize no-shows.',
    fallbackBehavior: 'graceful_exit',
    autoReplyEnabled: true,
    responseTimeLimitSeconds: 5,
    permissions: {
      canAccessCrm: true,
      canSendEmails: true,
      canSendWhatsapp: true,
      canBookCalendar: true,
      allowedActions: ['read_leads', 'write_leads', 'book_appointments', 'send_messages'],
    },
    capabilities: [
      { id: 'cap-appt-1', name: 'Calendar Sync & Booking', enabled: true },
      { id: 'cap-appt-2', name: 'Automated Reminders', enabled: true },
    ],
  },
  crm: {
    id: 'agent-default-crm',
    name: 'AI CRM Data Steward',
    role: 'crm',
    type: 'supervised',
    description: 'Autonomous contact enrichment, deduplication, and pipeline updating.',
    enabled: true,
    avatarUrl: '/assets/assistant.svg',
    defaultModel: 'gpt-4o-mini',
    temperature: 0.1,
    maxTokens: 1000,
    primaryLanguage: 'en',
    supportedLanguages: COMMON_LANGUAGES,
    systemPrompt: 'You are the GrowthAI CRM Steward. Clean, enrich, and structure customer data automatically from every interaction, ensuring zero manual data entry errors.',
    fallbackBehavior: 'retry',
    autoReplyEnabled: false,
    responseTimeLimitSeconds: 60,
    permissions: {
      canAccessCrm: true,
      canSendEmails: false,
      canSendWhatsapp: false,
      canBookCalendar: false,
      allowedActions: ['read_leads', 'write_leads'],
    },
    capabilities: [
      { id: 'cap-crm-1', name: 'Auto Contact Enrichment', enabled: true },
      { id: 'cap-crm-2', name: 'Deduplication & Hygiene', enabled: true },
    ],
  },
  email: {
    id: 'agent-default-email',
    name: 'AI Email Outreach Specialist',
    role: 'email',
    type: 'autonomous',
    description: 'Hyper-personalized cold outreach, campaign sequencing, and inbox triage.',
    enabled: true,
    avatarUrl: '/assets/assistant.svg',
    defaultModel: 'gpt-4o',
    temperature: 0.5,
    maxTokens: 1500,
    primaryLanguage: 'en',
    supportedLanguages: COMMON_LANGUAGES,
    systemPrompt: 'You are the GrowthAI Email Agent. Craft high-converting, personalized email sequences and manage intelligent inbox triage for all incoming replies.',
    fallbackBehavior: 'retry',
    autoReplyEnabled: true,
    responseTimeLimitSeconds: 20,
    permissions: {
      canAccessCrm: true,
      canSendEmails: true,
      canSendWhatsapp: false,
      canBookCalendar: false,
      allowedActions: ['read_leads', 'write_leads', 'send_messages'],
    },
    capabilities: [
      { id: 'cap-email-1', name: 'Personalized Outreach', enabled: true },
      { id: 'cap-email-2', name: 'Smart Inbox Triage', enabled: true },
    ],
  },
  whatsapp: {
    id: 'agent-default-whatsapp',
    name: 'AI WhatsApp Engagement Agent',
    role: 'whatsapp',
    type: 'autonomous',
    description: 'Instant WhatsApp chat engagement, media sharing, and instant closing.',
    enabled: true,
    avatarUrl: '/assets/assistant.svg',
    defaultModel: 'gpt-4o',
    temperature: 0.5,
    maxTokens: 1200,
    primaryLanguage: 'en',
    supportedLanguages: COMMON_LANGUAGES,
    systemPrompt: 'You are the GrowthAI WhatsApp Agent. Deliver lightning-fast, conversational, and engaging messaging responses over WhatsApp API.',
    fallbackBehavior: 'escalate_to_human',
    autoReplyEnabled: true,
    responseTimeLimitSeconds: 3,
    permissions: {
      canAccessCrm: true,
      canSendEmails: false,
      canSendWhatsapp: true,
      canBookCalendar: true,
      allowedActions: ['read_leads', 'write_leads', 'send_messages', 'book_appointments'],
    },
    capabilities: [
      { id: 'cap-wa-1', name: 'Instant Chat Messaging', enabled: true },
      { id: 'cap-wa-2', name: 'Media & Link Sharing', enabled: true },
    ],
  },
  review_manager: {
    id: 'agent-default-review-manager',
    name: 'AI Review & Reputation Manager',
    role: 'review_manager',
    type: 'autonomous',
    description: 'Google Business Profile review monitoring, sentiment analysis, and auto-reply.',
    enabled: true,
    avatarUrl: '/assets/assistant.svg',
    defaultModel: 'gpt-4o-mini',
    temperature: 0.3,
    maxTokens: 1000,
    primaryLanguage: 'en',
    supportedLanguages: COMMON_LANGUAGES,
    systemPrompt: 'You are the GrowthAI Review Manager. Monitor customer reviews across Google Business Profile, craft grateful appreciation replies, and flag negative feedback.',
    fallbackBehavior: 'escalate_to_human',
    autoReplyEnabled: true,
    responseTimeLimitSeconds: 60,
    permissions: {
      canAccessCrm: true,
      canSendEmails: false,
      canSendWhatsapp: false,
      canBookCalendar: false,
      allowedActions: ['read_leads', 'write_leads', 'send_messages'],
    },
    capabilities: [
      { id: 'cap-rev-1', name: 'GBP Review Monitoring', enabled: true },
      { id: 'cap-rev-2', name: 'Sentiment-Driven Auto-Reply', enabled: true },
    ],
  },
  analytics: {
    id: 'agent-default-analytics',
    name: 'AI Analytics & Insights Agent',
    role: 'analytics',
    type: 'system',
    description: 'Predictive revenue forecasting, conversion bottleneck detection, and reporting.',
    enabled: true,
    avatarUrl: '/assets/assistant.svg',
    defaultModel: 'gpt-4o',
    temperature: 0.2,
    maxTokens: 2048,
    primaryLanguage: 'en',
    supportedLanguages: COMMON_LANGUAGES,
    systemPrompt: 'You are the GrowthAI Analytics Agent. Analyze workforce metrics, spot pipeline bottlenecks, forecast revenue trends, and present actionable executive insights.',
    fallbackBehavior: 'graceful_exit',
    autoReplyEnabled: false,
    responseTimeLimitSeconds: 10,
    permissions: {
      canAccessCrm: true,
      canSendEmails: false,
      canSendWhatsapp: false,
      canBookCalendar: false,
      allowedActions: ['view_analytics', 'read_leads'],
    },
    capabilities: [
      { id: 'cap-an-1', name: 'Predictive Revenue Forecasting', enabled: true },
      { id: 'cap-an-2', name: 'Bottleneck Detection', enabled: true },
    ],
  },
  workflow: {
    id: 'agent-default-workflow',
    name: 'AI Workflow Automation Engine',
    role: 'workflow',
    type: 'trigger_based',
    description: 'Cross-platform task automation, webhook orchestration, and logic routing.',
    enabled: true,
    avatarUrl: '/assets/assistant.svg',
    defaultModel: 'gpt-4o-mini',
    temperature: 0.1,
    maxTokens: 1000,
    primaryLanguage: 'en',
    supportedLanguages: COMMON_LANGUAGES,
    systemPrompt: 'You are the GrowthAI Workflow Automation Agent. Execute multi-step business logic triggers reliably across internal databases and external webhooks.',
    fallbackBehavior: 'retry',
    autoReplyEnabled: false,
    responseTimeLimitSeconds: 5,
    permissions: {
      canAccessCrm: true,
      canSendEmails: true,
      canSendWhatsapp: true,
      canBookCalendar: true,
      allowedActions: ['read_leads', 'write_leads', 'send_messages', 'execute_workflows', 'book_appointments'],
    },
    capabilities: [
      { id: 'cap-wf-1', name: 'Multi-Step Logic Routing', enabled: true },
      { id: 'cap-wf-2', name: 'Webhook & API Orchestration', enabled: true },
    ],
  },
};

/**
 * Helper function to retrieve a default agent configuration template by its AgentRole.
 */
export function getAgentConfigByRole(role: AgentRole): DefaultAgentConfigTemplate {
  const config = DEFAULT_AGENT_CONFIGS[role];
  if (!config) {
    throw new Error(`Invalid agent role specified: ${role}`);
  }
  return config;
}


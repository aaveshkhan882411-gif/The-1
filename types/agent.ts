/**
 * @file types/agent.ts
 * @description Production-grade TypeScript type definitions for GrowthAI autonomous AI agents, workforce orchestration, and metrics.
 */

/**
 * Specialized roles/identities for GrowthAI agents supporting the multi-agent SaaS architecture.
 */
export type AgentRole =
  | 'ceo'
  | 'sales'
  | 'receptionist'
  | 'voice'
  | 'support'
  | 'follow_up'
  | 'appointment'
  | 'crm'
  | 'email'
  | 'whatsapp'
  | 'review_manager'
  | 'analytics'
  | 'workflow';

/**
 * Underlying classification or capability tier of the agent.
 */
export type AgentType = 'autonomous' | 'supervised' | 'trigger_based' | 'system';

/**
 * Current operational status of an agent instance.
 */
export type AgentStatus = 'active' | 'paused' | 'training' | 'error' | 'deprecated';

/**
 * Individual permissions granted to an agent for executing tasks across integrations.
 */
export type AgentPermission = 'read_leads' | 'write_leads' | 'send_messages' | 'book_appointments' | 'manage_billing' | 'execute_workflows' | 'view_analytics';

/**
 * Specific functional capabilities enabled for an agent.
 */
export interface AgentCapability {
  id: string;
  name: string;
  enabled: boolean;
  description?: string;
}

/**
 * Configuration settings dictating agent behavior, AI model selection, language, and operational parameters.
 */
export interface AgentConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  primaryLanguage: string;
  supportedLanguages: string[];
  systemPrompt: string;
  customGreeting?: string;
  fallbackBehavior: 'escalate_to_human' | 'retry' | 'graceful_exit';
  autoReplyEnabled: boolean;
  responseTimeLimitSeconds: number;
}

/**
 * Access control and security permissions assigned to an agent.
 */
export interface AgentPermissions {
  canAccessCrm: boolean;
  canSendEmails: boolean;
  canSendWhatsapp: boolean;
  canBookCalendar: boolean;
  allowedActions: AgentPermission[];
}

/**
 * Operational metrics and KPI tracking for dashboards and analytics.
 */
export interface AgentMetrics {
  totalInteractions: number;
  successfulResolutions: number;
  leadsCaptured: number;
  appointmentsBooked: number;
  averageResponseTimeMs: number;
  satisfactionScore: number; // 0 to 5
  lastActiveAt: string;
}

/**
 * Complete Agent entity definition supporting multi-tenant architecture.
 */
export interface Agent {
  id: string;
  tenantId: string;
  name: string;
  role: AgentRole;
  type: AgentType;
  status: AgentStatus;
  description: string;
  avatarUrl?: string;
  config: AgentConfig;
  permissions: AgentPermissions;
  capabilities: AgentCapability[];
  metrics: AgentMetrics;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input payload required to create a new AI agent.
 */
export interface CreateAgentInput {
  tenantId: string;
  name: string;
  role: AgentRole;
  type: AgentType;
  description?: string;
  avatarUrl?: string;
  config?: Partial<AgentConfig>;
  permissions?: Partial<AgentPermissions>;
  capabilities?: AgentCapability[];
}

/**
 * Input payload for updating an existing AI agent.
 */
export interface UpdateAgentInput {
  name?: string;
  status?: AgentStatus;
  description?: string;
  avatarUrl?: string;
  config?: Partial<AgentConfig>;
  permissions?: Partial<AgentPermissions>;
  capabilities?: AgentCapability[];
}

/**
 * Lightweight agent summary optimized for tables, overview cards, and admin dashboards.
 */
export interface AgentSummary {
  id: string;
  tenantId: string;
  name: string;
  role: AgentRole;
  status: AgentStatus;
  avatarUrl?: string;
  totalInteractions: number;
  leadsCaptured: number;
  lastActiveAt?: string;
}

/**
 * @file config/permissions.ts
 * @description Secure, strongly typed, production-ready authorization and
 * permission configuration for GrowthAI SaaS multi-tenant platform.
 *
 * SECURITY NOTICE:
 * - Permissions are tenant-scoped logically.
 * - All server actions/API endpoints MUST verify permissions server-side.
 * - Never trust client-side role claims.
 */

// ==============================================================================
// 1. Permission Types & Categories
// ==============================================================================

export type LeadPermission =
  | 'read_leads'
  | 'create_leads'
  | 'update_leads'
  | 'delete_leads'
  | 'export_leads';

export type MessagingPermission =
  | 'send_messages'
  | 'send_emails'
  | 'send_whatsapp'
  | 'send_sms';

export type AppointmentPermission =
  | 'view_appointments'
  | 'create_appointments'
  | 'update_appointments'
  | 'cancel_appointments'
  | 'book_appointments';

export type CrmPermission =
  | 'read_crm'
  | 'write_crm'
  | 'manage_crm';

export type WorkflowPermission =
  | 'view_workflows'
  | 'create_workflows'
  | 'update_workflows'
  | 'delete_workflows'
  | 'execute_workflows';

export type AgentPermission =
  | 'view_agents'
  | 'create_agents'
  | 'update_agents'
  | 'delete_agents'
  | 'configure_agents'
  | 'activate_agents'
  | 'pause_agents';

export type AnalyticsPermission =
  | 'view_analytics'
  | 'export_analytics';

export type TeamPermission =
  | 'view_team'
  | 'invite_team'
  | 'update_team'
  | 'remove_team';

export type BillingPermission =
  | 'view_billing'
  | 'manage_billing';

export type SettingsPermission =
  | 'view_settings'
  | 'update_settings';

export type AdminPermission =
  | 'manage_permissions'
  | 'manage_tenant'
  | 'manage_security';

export type Permission =
  | LeadPermission
  | MessagingPermission
  | AppointmentPermission
  | CrmPermission
  | WorkflowPermission
  | AgentPermission
  | AnalyticsPermission
  | TeamPermission
  | BillingPermission
  | SettingsPermission
  | AdminPermission;

export type PermissionGroup =
  | 'leads'
  | 'messaging'
  | 'appointments'
  | 'crm'
  | 'workflows'
  | 'agents'
  | 'analytics'
  | 'team'
  | 'billing'
  | 'settings'
  | 'administration';

// ==============================================================================
// 2. User Roles
// ==============================================================================

export type UserRole =
  | 'owner'
  | 'admin'
  | 'manager'
  | 'agent_manager'
  | 'sales'
  | 'support'
  | 'analyst'
  | 'member'
  | 'viewer';

export interface RolePermissionsConfig {
  role: UserRole;
  permissions: readonly Permission[];
}

// ==============================================================================
// 3. Permission Implications
// ==============================================================================

const PERMISSION_IMPLICATIONS: Record<
  Permission,
  readonly Permission[]
> = {
  manage_crm: ['read_crm', 'write_crm', 'manage_crm'],

  manage_tenant: [
    'manage_tenant',
    'view_settings',
    'update_settings',
  ],

  manage_permissions: [
    'manage_permissions',
    'view_team',
  ],

  manage_security: [
    'manage_security',
    'view_settings',
    'update_settings',
  ],

  manage_billing: [
    'manage_billing',
    'view_billing',
  ],

  read_leads: ['read_leads'],
  create_leads: ['create_leads'],
  update_leads: ['update_leads'],
  delete_leads: ['delete_leads'],
  export_leads: ['export_leads'],

  send_messages: ['send_messages'],
  send_emails: ['send_emails'],
  send_whatsapp: ['send_whatsapp'],
  send_sms: ['send_sms'],

  view_appointments: ['view_appointments'],
  create_appointments: ['create_appointments'],
  update_appointments: ['update_appointments'],
  cancel_appointments: ['cancel_appointments'],
  book_appointments: ['book_appointments'],

  read_crm: ['read_crm'],
  write_crm: ['write_crm'],

  view_workflows: ['view_workflows'],
  create_workflows: ['create_workflows'],
  update_workflows: ['update_workflows'],
  delete_workflows: ['delete_workflows'],
  execute_workflows: ['execute_workflows'],

  view_agents: ['view_agents'],
  create_agents: ['create_agents'],
  update_agents: ['update_agents'],
  delete_agents: ['delete_agents'],
  configure_agents: ['configure_agents'],
  activate_agents: ['activate_agents'],
  pause_agents: ['pause_agents'],

  view_analytics: ['view_analytics'],
  export_analytics: ['export_analytics'],

  view_team: ['view_team'],
  invite_team: ['invite_team'],
  update_team: ['update_team'],
  remove_team: ['remove_team'],

  view_billing: ['view_billing'],

  view_settings: ['view_settings'],
  update_settings: ['update_settings'],
};

// ==============================================================================
// 4. Role Permission Sets
// ==============================================================================

const OWNER_PERMISSIONS: readonly Permission[] = [
  'read_leads',
  'create_leads',
  'update_leads',
  'delete_leads',
  'export_leads',

  'send_messages',
  'send_emails',
  'send_whatsapp',
  'send_sms',

  'view_appointments',
  'create_appointments',
  'update_appointments',
  'cancel_appointments',
  'book_appointments',

  'read_crm',
  'write_crm',
  'manage_crm',

  'view_workflows',
  'create_workflows',
  'update_workflows',
  'delete_workflows',
  'execute_workflows',

  'view_agents',
  'create_agents',
  'update_agents',
  'delete_agents',
  'configure_agents',
  'activate_agents',
  'pause_agents',

  'view_analytics',
  'export_analytics',

  'view_team',
  'invite_team',
  'update_team',
  'remove_team',

  'view_billing',
  'manage_billing',

  'view_settings',
  'update_settings',

  'manage_permissions',
  'manage_tenant',
  'manage_security',
];

const ADMIN_PERMISSIONS: readonly Permission[] = [
  'read_leads',
  'create_leads',
  'update_leads',
  'delete_leads',
  'export_leads',

  'send_messages',
  'send_emails',
  'send_whatsapp',
  'send_sms',

  'view_appointments',
  'create_appointments',
  'update_appointments',
  'cancel_appointments',
  'book_appointments',

  'read_crm',
  'write_crm',
  'manage_crm',

  'view_workflows',
  'create_workflows',
  'update_workflows',
  'delete_workflows',
  'execute_workflows',

  'view_agents',
  'create_agents',
  'update_agents',
  'delete_agents',
  'configure_agents',
  'activate_agents',
  'pause_agents',

  'view_analytics',
  'export_analytics',

  'view_team',
  'invite_team',
  'update_team',
  'remove_team',

  'view_billing',

  'view_settings',
  'update_settings',

  'manage_tenant',
];

const MANAGER_PERMISSIONS: readonly Permission[] = [
  'read_leads',
  'create_leads',
  'update_leads',
  'export_leads',

  'send_messages',
  'send_emails',
  'send_whatsapp',
  'send_sms',

  'view_appointments',
  'create_appointments',
  'update_appointments',
  'cancel_appointments',
  'book_appointments',

  'read_crm',
  'write_crm',
  'manage_crm',

  'view_workflows',
  'create_workflows',
  'update_workflows',
  'execute_workflows',

  'view_agents',
  'configure_agents',
  'activate_agents',
  'pause_agents',

  'view_analytics',
  'export_analytics',

  'view_team',
  'invite_team',

  'view_settings',
];

const AGENT_MANAGER_PERMISSIONS: readonly Permission[] = [
  'view_agents',
  'create_agents',
  'update_agents',
  'delete_agents',
  'configure_agents',
  'activate_agents',
  'pause_agents',

  'view_workflows',
  'create_workflows',
  'update_workflows',
  'execute_workflows',

  'view_analytics',

  'read_leads',
];

const SALES_PERMISSIONS: readonly Permission[] = [
  'read_leads',
  'create_leads',
  'update_leads',
  'export_leads',

  'send_messages',
  'send_emails',
  'send_whatsapp',
  'send_sms',

  'view_appointments',
  'create_appointments',
  'update_appointments',
  'book_appointments',

  'read_crm',
  'write_crm',

  'view_analytics',
];

const SUPPORT_PERMISSIONS: readonly Permission[] = [
  'read_leads',
  'update_leads',

  'send_messages',
  'send_emails',
  'send_whatsapp',

  'view_appointments',
  'create_appointments',
  'cancel_appointments',

  'read_crm',

  'view_analytics',
];

const ANALYST_PERMISSIONS: readonly Permission[] = [
  'read_leads',
  'export_leads',

  'read_crm',

  'view_analytics',
  'export_analytics',

  'view_agents',
  'view_workflows',
];

const MEMBER_PERMISSIONS: readonly Permission[] = [
  'read_leads',
  'create_leads',
  'update_leads',

  'send_messages',

  'view_appointments',
  'create_appointments',

  'read_crm',

  'view_workflows',
];

const VIEWER_PERMISSIONS: readonly Permission[] = [
  'read_leads',
  'view_appointments',
  'read_crm',
  'view_workflows',
  'view_agents',
  'view_analytics',
  'view_team',
  'view_settings',
];

// ==============================================================================
// 5. Master Role → Permission Mapping
// ==============================================================================

export const ROLE_PERMISSIONS: Record<
  UserRole,
  readonly Permission[]
> = {
  owner: OWNER_PERMISSIONS,
  admin: ADMIN_PERMISSIONS,
  manager: MANAGER_PERMISSIONS,
  agent_manager: AGENT_MANAGER_PERMISSIONS,
  sales: SALES_PERMISSIONS,
  support: SUPPORT_PERMISSIONS,
  analyst: ANALYST_PERMISSIONS,
  member: MEMBER_PERMISSIONS,
  viewer: VIEWER_PERMISSIONS,
} as const;

// ==============================================================================
// 6. Role Authorization Helpers
// ==============================================================================

export function isRole(role: unknown): role is UserRole {
  return (
    typeof role === 'string' &&
    Object.prototype.hasOwnProperty.call(ROLE_PERMISSIONS, role)
  );
}

export function getPermissionsForRole(
  role: unknown
): readonly Permission[] {
  if (!isRole(role)) {
    return [];
  }

  return ROLE_PERMISSIONS[role];
}

export function hasPermission(
  role: unknown,
  permission: unknown
): boolean {
  if (!isRole(role) || typeof permission !== 'string') {
    return false;
  }

  const rolePermissions = ROLE_PERMISSIONS[role];

  if (rolePermissions.includes(permission as Permission)) {
    return true;
  }

  for (const assignedPermission of rolePermissions) {
    const implied =
      PERMISSION_IMPLICATIONS[assignedPermission];

    if (
      implied.includes(permission as Permission)
    ) {
      return true;
    }
  }

  return false;
}

export function canPerformAction(
  role: unknown,
  permission: unknown
): boolean {
  return hasPermission(role, permission);
}

export function hasAnyPermission(
  role: unknown,
  permissions: readonly unknown[]
): boolean {
  if (!isRole(role) || !Array.isArray(permissions)) {
    return false;
  }

  return permissions.some((permission) =>
    hasPermission(role, permission)
  );
}

export function hasAllPermissions(
  role: unknown,
  permissions: readonly unknown[]
): boolean {
  if (
    !isRole(role) ||
    !Array.isArray(permissions) ||
    permissions.length === 0
  ) {
    return false;
  }

  return permissions.every((permission) =>
    hasPermission(role, permission)
  );
}

// ==============================================================================
// 7. Agent Permission Integration
// ==============================================================================

export interface AgentPermissionCheckModel {
  canAccessCrm?: boolean;
  canSendEmails?: boolean;
  canSendWhatsapp?: boolean;
  canBookCalendar?: boolean;
  allowedActions?: readonly string[];
}

export type AgentAction =
  | 'access_crm'
  | 'read_leads'
  | 'modify_leads'
  | 'send_messages'
  | 'send_email'
  | 'send_whatsapp'
  | 'book_appointments'
  | 'execute_workflows'
  | 'view_analytics';

/**
 * Checks whether an AI agent is allowed to perform an action.
 *
 * IMPORTANT:
 * - CRM access does NOT automatically grant lead permissions.
 * - Email permission does NOT automatically grant WhatsApp permission.
 * - WhatsApp permission does NOT automatically grant email permission.
 * - Explicit allowedActions are preferred for granular operations.
 */
export function canAgentPerform(
  agentPermissions:
    | AgentPermissionCheckModel
    | null
    | undefined,
  action: AgentAction
): boolean {
  if (!agentPermissions) {
    return false;
  }

  const allowedActions =
    agentPermissions.allowedActions ?? [];

  switch (action) {
    case 'access_crm':
      return Boolean(
        agentPermissions.canAccessCrm
      );

    case 'read_leads':
      return allowedActions.includes(
        'read_leads'
      );

    case 'modify_leads':
      return allowedActions.includes(
        'write_leads'
      );

    case 'send_messages':
      return allowedActions.includes(
        'send_messages'
      );

    case 'send_email':
      return Boolean(
        agentPermissions.canSendEmails ||
        allowedActions.includes('send_emails')
      );

    case 'send_whatsapp':
      return Boolean(
        agentPermissions.canSendWhatsapp ||
        allowedActions.includes('send_whatsapp')
      );

    case 'book_appointments':
      return Boolean(
        agentPermissions.canBookCalendar ||
        allowedActions.includes(
          'book_appointments'
        )
      );

    case 'execute_workflows':
      return allowedActions.includes(
        'execute_workflows'
      );

    case 'view_analytics':
      return allowedActions.includes(
        'view_analytics'
      );

    default:
      return false;
  }
}

// ==============================================================================
// 8. Default Export
// ==============================================================================

const PERMISSIONS_CONFIG = {
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getPermissionsForRole,
  isRole,
  canPerformAction,
  canAgentPerform,
} as const;

export default PERMISSIONS_CONFIG;

/**
 * @file config/permissions.ts
 * @description Centralized role-based permissions configuration for GrowthAI SaaS.
 */

import { UserRole } from '../types/auth';

export type PermissionAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'manage';

export interface ResourcePermission {
  resource: string;
  actions: PermissionAction[];
}

export const ROLE_PERMISSIONS: Record<UserRole, ResourcePermission[]> = {
  platform_owner: [
    {
      resource: '*',
      actions: ['create', 'read', 'update', 'delete', 'manage'],
    },
  ],

  tenant_admin: [
    {
      resource: 'tenant',
      actions: ['read', 'update', 'manage'],
    },
    {
      resource: 'users',
      actions: ['create', 'read', 'update', 'delete', 'manage'],
    },
    {
      resource: 'agents',
      actions: ['create', 'read', 'update', 'delete', 'manage'],
    },
    {
      resource: 'leads',
      actions: ['create', 'read', 'update', 'delete', 'manage'],
    },
    {
      resource: 'appointments',
      actions: ['create', 'read', 'update', 'delete', 'manage'],
    },
    {
      resource: 'workflows',
      actions: ['create', 'read', 'update', 'delete', 'manage'],
    },
    {
      resource: 'analytics',
      actions: ['read', 'manage'],
    },
    {
      resource: 'integrations',
      actions: ['create', 'read', 'update', 'delete', 'manage'],
    },
    {
      resource: 'billing',
      actions: ['read', 'update', 'manage'],
    },
  ],

  staff: [
    {
      resource: 'users',
      actions: ['read'],
    },
    {
      resource: 'agents',
      actions: ['read', 'update'],
    },
    {
      resource: 'leads',
      actions: ['create', 'read', 'update'],
    },
    {
      resource: 'appointments',
      actions: ['create', 'read', 'update'],
    },
    {
      resource: 'workflows',
      actions: ['read'],
    },
    {
      resource: 'analytics',
      actions: ['read'],
    },
  ],

  customer: [
    {
      resource: 'agents',
      actions: ['read'],
    },
    {
      resource: 'leads',
      actions: ['create', 'read', 'update'],
    },
    {
      resource: 'appointments',
      actions: ['create', 'read', 'update'],
    },
  ],
};

/**
 * Checks whether a role has permission to perform an action on a resource.
 */
export function hasPermission(
  role: UserRole,
  resource: string,
  action: PermissionAction
): boolean {
  const permissions = ROLE_PERMISSIONS[role];

  if (!permissions) {
    return false;
  }

  const wildcardPermission = permissions.find(
    (permission) => permission.resource === '*'
  );

  if (wildcardPermission?.actions.includes(action)) {
    return true;
  }

  const resourcePermission = permissions.find(
    (permission) => permission.resource === resource
  );

  return resourcePermission?.actions.includes(action) ?? false;
}

/**
 * Returns all permissions assigned to a specific role.
 */
export function getPermissionsByRole(
  role: UserRole
): ResourcePermission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export default ROLE_PERMISSIONS;

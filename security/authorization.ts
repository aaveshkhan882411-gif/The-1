/**
 * @file security/authorization.ts
 * @description Server-only authorization and access-control utilities.
 */

import 'server-only';

import type { AuthenticatedUser } from './auth';

import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  type Permission,
} from '../config/permissions';

export type AuthorizationResult =
  | {
      readonly authorized: true;
    }
  | {
      readonly authorized: false;
      readonly reason: string;
    };

function hasValidUserContext(
  user: AuthenticatedUser | null | undefined,
): user is AuthenticatedUser {
  if (!user) {
    return false;
  }

  return (
    typeof user.id === 'string' &&
    user.id.trim().length > 0 &&
    typeof user.tenantId === 'string' &&
    user.tenantId.trim().length > 0 &&
    typeof user.role === 'string' &&
    user.role.trim().length > 0
  );
}

function isValidPermission(
  permission: unknown,
): permission is Permission {
  return (
    typeof permission === 'string' &&
    permission.trim().length > 0
  );
}

export function authorizePermission(
  user: AuthenticatedUser | null | undefined,
  permission: Permission,
): AuthorizationResult {
  if (!hasValidUserContext(user)) {
    return {
      authorized: false,
      reason: 'Access denied: Unauthenticated or invalid user context.',
    };
  }

  if (!isValidPermission(permission)) {
    return {
      authorized: false,
      reason: 'Access denied: Invalid permission.',
    };
  }

  if (!hasPermission(user.role, permission)) {
    return {
      authorized: false,
      reason: `Access denied: Missing required permission '${permission}'.`,
    };
  }

  return {
    authorized: true,
  };
}

export function authorizeAnyPermission(
  user: AuthenticatedUser | null | undefined,
  permissions: readonly Permission[],
): AuthorizationResult {
  if (!hasValidUserContext(user)) {
    return {
      authorized: false,
      reason: 'Access denied: Unauthenticated or invalid user context.',
    };
  }

  if (
    !Array.isArray(permissions) ||
    permissions.length === 0
  ) {
    return {
      authorized: false,
      reason: 'Access denied: No permissions specified.',
    };
  }

  const validPermissions =
    permissions.filter(isValidPermission);

  if (validPermissions.length === 0) {
    return {
      authorized: false,
      reason: 'Access denied: Invalid permissions.',
    };
  }

  if (
    !hasAnyPermission(
      user.role,
      [...validPermissions],
    )
  ) {
    return {
      authorized: false,
      reason: 'Access denied: Insufficient permissions.',
    };
  }

  return {
    authorized: true,
  };
}

export function authorizeAllPermissions(
  user: AuthenticatedUser | null | undefined,
  permissions: readonly Permission[],
): AuthorizationResult {
  if (!hasValidUserContext(user)) {
    return {
      authorized: false,
      reason: 'Access denied: Unauthenticated or invalid user context.',
    };
  }

  if (
    !Array.isArray(permissions) ||
    permissions.length === 0
  ) {
    return {
      authorized: false,
      reason: 'Access denied: No permissions specified.',
    };
  }

  const validPermissions =
    permissions.filter(isValidPermission);

  if (
    validPermissions.length !== permissions.length
  ) {
    return {
      authorized: false,
      reason: 'Access denied: Invalid permissions.',
    };
  }

  if (
    !hasAllPermissions(
      user.role,
      [...validPermissions],
    )
  ) {
    return {
      authorized: false,
      reason: 'Access denied: Missing one or more required permissions.',
    };
  }

  return {
    authorized: true,
  };
}

export function authorizeTenantAccess(
  user: AuthenticatedUser | null | undefined,
  targetTenantId: string | null | undefined,
): AuthorizationResult {
  if (!hasValidUserContext(user)) {
    return {
      authorized: false,
      reason: 'Access denied: Unauthenticated user context.',
    };
  }

  if (typeof targetTenantId !== 'string') {
    return {
      authorized: false,
      reason: 'Access denied: Invalid tenant identifier.',
    };
  }

  const requestedTenantId =
    targetTenantId.trim();

  if (!requestedTenantId) {
    return {
      authorized: false,
      reason: 'Access denied: Empty tenant identifier.',
    };
  }

  if (user.tenantId !== requestedTenantId) {
    return {
      authorized: false,
      reason: 'Access denied: Cross-tenant data access violation.',
    };
  }

  return {
    authorized: true,
  };
}

export function authorizeAdminOrOwner(
  user: AuthenticatedUser | null | undefined,
): AuthorizationResult {
  if (!hasValidUserContext(user)) {
    return {
      authorized: false,
      reason: 'Access denied: Unauthenticated user context.',
    };
  }

  if (
    user.role !== 'owner' &&
    user.role !== 'admin'
  ) {
    return {
      authorized: false,
      reason:
        'Access denied: Requires Tenant Administrator or Owner privileges.',
    };
  }

  return {
    authorized: true,
  };
}

export function requirePermission(
  user: AuthenticatedUser | null | undefined,
  permission: Permission,
): void {
  const result =
    authorizePermission(user, permission);

  if (!result.authorized) {
    throw new Error(result.reason);
  }
}

export function requireAnyPermission(
  user: AuthenticatedUser | null | undefined,
  permissions: readonly Permission[],
): void {
  const result =
    authorizeAnyPermission(
      user,
      permissions,
    );

  if (!result.authorized) {
    throw new Error(result.reason);
  }
}

export function requireAllPermissions(
  user: AuthenticatedUser | null | undefined,
  permissions: readonly Permission[],
): void {
  const result =
    authorizeAllPermissions(
      user,
      permissions,
    );

  if (!result.authorized) {
    throw new Error(result.reason);
  }
}

export function requireTenantAccess(
  user: AuthenticatedUser | null | undefined,
  targetTenantId: string | null | undefined,
): void {
  const result =
    authorizeTenantAccess(
      user,
      targetTenantId,
    );

  if (!result.authorized) {
    throw new Error(result.reason);
  }
}

export function requireAdminOrOwner(
  user: AuthenticatedUser | null | undefined,
): void {
  const result =
    authorizeAdminOrOwner(user);

  if (!result.authorized) {
    throw new Error(result.reason);
  }
}

/**
 * @file security/authorization.ts
 * @description Production-ready, server-only authorization and access-control module
 * for the GrowthAI SaaS platform.
 *
 * SECURITY NOTICE:
 * - This module is SERVER-ONLY.
 * - Authorization decisions rely only on verified AuthenticatedUser contexts.
 * - Permission definitions remain centralized in config/permissions.ts.
 * - Tenant isolation must be enforced before tenant-scoped operations.
 */

import 'server-only';

import type { AuthenticatedUser } from '../security/auth';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  type Permission,
} from '../config/permissions';

/**
 * Standard authorization check result.
 */
export type AuthorizationResult =
  | { readonly authorized: true }
  | { readonly authorized: false; readonly reason: string };

function hasValidUserContext(
  user: AuthenticatedUser | null | undefined
): user is AuthenticatedUser {
  return Boolean(
    user &&
      typeof user.id === 'string' &&
      user.id.trim() &&
      typeof user.tenantId === 'string' &&
      user.tenantId.trim() &&
      user.role
  );
}

/**
 * Checks whether a verified authenticated user has a specific permission.
 */
export function authorizePermission(
  user: AuthenticatedUser | null | undefined,
  permission: Permission
): AuthorizationResult {
  if (!hasValidUserContext(user)) {
    return {
      authorized: false,
      reason: 'Access denied: Unauthenticated or invalid user context.',
    };
  }

  if (typeof permission !== 'string' || permission.length === 0) {
    return {
      authorized: false,
      reason: 'Access denied: Invalid permission queried.',
    };
  }

  if (!hasPermission(user.role, permission)) {
    return {
      authorized: false,
      reason: `Access denied: Missing required permission '${permission}'.`,
    };
  }

  return { authorized: true };
}

/**
 * Checks whether a verified authenticated user has at least one
 * of the requested permissions.
 */
export function authorizeAnyPermission(
  user: AuthenticatedUser | null | undefined,
  permissions: readonly Permission[]
): AuthorizationResult {
  if (!hasValidUserContext(user)) {
    return {
      authorized: false,
      reason: 'Access denied: Unauthenticated or invalid user context.',
    };
  }

  if (!Array.isArray(permissions) || permissions.length === 0) {
    return {
      authorized: false,
      reason: 'Access denied: No permissions specified for check.',
    };
  }

  if (!hasAnyPermission(user.role, [...permissions])) {
    return {
      authorized: false,
      reason: 'Access denied: Insufficient permissions.',
    };
  }

  return { authorized: true };
}

/**
 * Checks whether a verified authenticated user has all
 * of the requested permissions.
 */
export function authorizeAllPermissions(
  user: AuthenticatedUser | null | undefined,
  permissions: readonly Permission[]
): AuthorizationResult {
  if (!hasValidUserContext(user)) {
    return {
      authorized: false,
      reason: 'Access denied: Unauthenticated or invalid user context.',
    };
  }

  if (!Array.isArray(permissions) || permissions.length === 0) {
    return {
      authorized: false,
      reason: 'Access denied: No permissions specified for check.',
    };
  }

  if (!hasAllPermissions(user.role, [...permissions])) {
    return {
      authorized: false,
      reason: 'Access denied: Missing one or more required permissions.',
    };
  }

  return { authorized: true };
}

/**
 * Verifies tenant isolation.
 *
 * The requested tenant must exactly match the tenant attached to
 * the already-verified authenticated user.
 */
export function authorizeTenantAccess(
  user: AuthenticatedUser | null | undefined,
  targetTenantId: string | null | undefined
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
      reason: 'Access denied: Invalid target tenant identifier.',
    };
  }

  const normalizedTargetTenantId = targetTenantId.trim();

  if (
    !normalizedTargetTenantId ||
    user.tenantId !== normalizedTargetTenantId
  ) {
    return {
      authorized: false,
      reason: 'Access denied: Cross-tenant data access violation.',
    };
  }

  return { authorized: true };
}

/**
 * Checks whether the verified user is an owner or tenant administrator.
 */
export function authorizeAdminOrOwner(
  user: AuthenticatedUser | null | undefined
): AuthorizationResult {
  if (!hasValidUserContext(user)) {
    return {
      authorized: false,
      reason: 'Access denied: Unauthenticated user context.',
    };
  }

  if (user.role !== 'owner' && user.role !== 'admin') {
    return {
      authorized: false,
      reason:
        'Access denied: Requires Tenant Administrator or Owner privileges.',
    };
  }

  return { authorized: true };
}

/**
 * Enforces a single permission check.
 * Throws when authorization fails.
 */
export function requirePermission(
  user: AuthenticatedUser | null | undefined,
  permission: Permission
): void {
  const result = authorizePermission(user, permission);

  if (!result.authorized) {
    throw new Error(result.reason);
  }
}

/**
 * Enforces an ANY-permission check.
 */
export function requireAnyPermission(
  user: AuthenticatedUser | null | undefined,
  permissions: readonly Permission[]
): void {
  const result = authorizeAnyPermission(user, permissions);

  if (!result.authorized) {
    throw new Error(result.reason);
  }
}

/**
 * Enforces an ALL-permissions check.
 */
export function requireAllPermissions(
  user: AuthenticatedUser | null | undefined,
  permissions: readonly Permission[]
): void {
  const result = authorizeAllPermissions(user, permissions);

  if (!result.authorized) {
    throw new Error(result.reason);
  }
}

/**
 * Enforces tenant isolation.
 */
export function requireTenantAccess(
  user: AuthenticatedUser | null | undefined,
  targetTenantId: string | null | undefined
): void {
  const result = authorizeTenantAccess(user, targetTenantId);

  if (!result.authorized) {
    throw new Error(result.reason);
  }
}

/**
 * Enforces owner/admin privileges.
 */
export function requireAdminOrOwner(
  user: AuthenticatedUser | null | undefined
): void {
  const result = authorizeAdminOrOwner(user);

  if (!result.authorized) {
    throw new Error(result.reason);
  }
}

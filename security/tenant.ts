/**
 * @file security/tenant.ts
 * @description Production-ready, server-only tenant isolation and scoping module
 * for the GrowthAI SaaS platform.
 *
 * SECURITY NOTICE:
 * - This module is SERVER-ONLY.
 * - Tenant identity must come only from a verified AuthenticatedUser.
 * - Client-supplied tenant identifiers must never be trusted directly.
 */

import 'server-only';

import type { AuthenticatedUser } from '../security/auth';

/**
 * Represents a trusted server-side tenant execution context.
 */
export interface TenantContext {
  readonly tenantId: string;
  readonly userId: string;
  readonly role: AuthenticatedUser['role'];
}

/**
 * Validates a tenant identifier.
 *
 * Tenant IDs are restricted to a safe, predictable character set
 * and bounded length.
 */
export function isValidTenantId(
  tenantId: unknown
): tenantId is string {
  if (typeof tenantId !== 'string') {
    return false;
  }

  const normalizedTenantId = tenantId.trim();

  return (
    normalizedTenantId.length > 0 &&
    normalizedTenantId.length <= 128 &&
    /^[a-zA-Z0-9_-]+$/.test(normalizedTenantId)
  );
}

/**
 * Extracts the trusted tenant ID from a verified authenticated user.
 */
export function getTenantIdFromUser(
  user: AuthenticatedUser | null | undefined
): string | null {
  if (!user || typeof user.tenantId !== 'string') {
    return null;
  }

  const tenantId = user.tenantId.trim();

  return isValidTenantId(tenantId) ? tenantId : null;
}

/**
 * Verifies that the authenticated user belongs to the target tenant.
 */
export function verifyTenantOwnership(
  user: AuthenticatedUser | null | undefined,
  targetTenantId: unknown
): boolean {
  const verifiedTenantId = getTenantIdFromUser(user);

  if (!verifiedTenantId || !isValidTenantId(targetTenantId)) {
    return false;
  }

  return verifiedTenantId === targetTenantId.trim();
}

/**
 * Enforces tenant ownership/access.
 *
 * Throws when the tenant context is invalid or a cross-tenant
 * access attempt is detected.
 */
export function assertTenantOwnership(
  user: AuthenticatedUser | null | undefined,
  targetTenantId: unknown
): void {
  if (!verifyTenantOwnership(user, targetTenantId)) {
    throw new Error(
      'Access denied: Tenant isolation violation or invalid tenant context.'
    );
  }
}

/**
 * Creates a trusted server-side TenantContext from a verified user.
 */
export function createTenantContext(
  user: AuthenticatedUser | null | undefined
): TenantContext {
  const tenantId = getTenantIdFromUser(user);

  if (
    !user ||
    !tenantId ||
    typeof user.id !== 'string' ||
    !user.id.trim() ||
    !user.role
  ) {
    throw new Error(
      'Failed to create tenant context: Unauthenticated or malformed session.'
    );
  }

  return {
    tenantId,
    userId: user.id.trim(),
    role: user.role,
  };
}

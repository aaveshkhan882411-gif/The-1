/**
 * @file security/tenant.ts
 * @description Server-only tenant isolation and scoping utilities.
 */

import 'server-only';

import type { AuthenticatedUser } from './auth';

export interface TenantContext {
  readonly tenantId: string;
  readonly userId: string;
  readonly role: AuthenticatedUser['role'];
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const TENANT_SLUG_REGEX =
  /^[a-zA-Z0-9_-]{1,128}$/;

/**
 * Validates UUID or safe internal tenant identifiers.
 */
export function isValidTenantId(
  tenantId: unknown,
): tenantId is string {
  if (typeof tenantId !== 'string') {
    return false;
  }

  const normalized =
    tenantId.trim();

  if (!normalized || normalized.length > 128) {
    return false;
  }

  return (
    UUID_REGEX.test(normalized) ||
    TENANT_SLUG_REGEX.test(normalized)
  );
}

/**
 * Gets the trusted tenant ID from an authenticated user.
 */
export function getTenantIdFromUser(
  user: AuthenticatedUser | null | undefined,
): string | null {
  if (
    !user ||
    typeof user.tenantId !== 'string'
  ) {
    return null;
  }

  const tenantId =
    user.tenantId.trim();

  return isValidTenantId(tenantId)
    ? tenantId
    : null;
}

/**
 * Verifies tenant ownership.
 */
export function verifyTenantOwnership(
  user: AuthenticatedUser | null | undefined,
  targetTenantId: unknown,
): boolean {
  const verifiedTenantId =
    getTenantIdFromUser(user);

  if (
    !verifiedTenantId ||
    !isValidTenantId(targetTenantId)
  ) {
    return false;
  }

  return (
    verifiedTenantId ===
    targetTenantId.trim()
  );
}

/**
 * Enforces tenant ownership.
 */
export function assertTenantOwnership(
  user: AuthenticatedUser | null | undefined,
  targetTenantId: unknown,
): void {
  if (
    !verifyTenantOwnership(
      user,
      targetTenantId,
    )
  ) {
    throw new Error(
      'Access denied: Tenant isolation violation or invalid tenant context.',
    );
  }
}

/**
 * Creates a trusted tenant execution context.
 */
export function createTenantContext(
  user: AuthenticatedUser | null | undefined,
): TenantContext {
  const tenantId =
    getTenantIdFromUser(user);

  if (
    !user ||
    !tenantId ||
    typeof user.id !== 'string' ||
    !user.id.trim() ||
    typeof user.role !== 'string' ||
    !user.role.trim()
  ) {
    throw new Error(
      'Failed to create tenant context: Unauthenticated or malformed session.',
    );
  }

  return {
    tenantId,
    userId: user.id.trim(),
    role: user.role,
  };
}

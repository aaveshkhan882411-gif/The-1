/**
 * @file security/auth.ts
 * @description Server-only authentication identity validation for GrowthAI.
 *
 * SECURITY:
 * - Never trusts client-provided authorization claims.
 * - Authentication and authorization remain separate.
 * - Tenant identity must come from the verified server-side session.
 */

import 'server-only';

import type { UserRole } from '../types/auth';

const USER_ROLES = [
  'owner',
  'admin',
  'manager',
  'agent_manager',
  'sales',
  'support',
  'analyst',
  'member',
  'viewer',
] as const;

function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === 'string' &&
    (USER_ROLES as readonly string[]).includes(value)
  );
}

function getNonEmptyString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const valueTrimmed = value.trim();

  return valueTrimmed.length > 0 ? valueTrimmed : null;
}

export interface AuthenticatedUser {
  readonly id: string;
  readonly email: string;
  readonly tenantId: string;
  readonly role: UserRole;
  readonly emailVerified: boolean;
  readonly status: string;
}

export type AuthCheckResult =
  | {
      readonly isAuthenticated: true;
      readonly user: AuthenticatedUser;
    }
  | {
      readonly isAuthenticated: false;
      readonly error: string;
    };

/**
 * Validates a raw session user object.
 */
export function validateAuthenticatedUser(
  rawUser: unknown,
): AuthenticatedUser | null {
  if (
    rawUser === null ||
    typeof rawUser !== 'object' ||
    Array.isArray(rawUser)
  ) {
    return null;
  }

  const record = rawUser as Record<string, unknown>;

  const id = getNonEmptyString(record.id);
  const email = getNonEmptyString(record.email);
  const tenantId = getNonEmptyString(record.tenantId);
  const role = isUserRole(record.role) ? record.role : null;

  if (!id || !email || !tenantId || !role) {
    return null;
  }

  const emailVerified =
    typeof record.emailVerified === 'boolean'
      ? record.emailVerified
      : false;

  const status =
    getNonEmptyString(record.status) ?? 'active';

  const normalizedStatus = status.toLowerCase();

  if (
    normalizedStatus === 'suspended' ||
    normalizedStatus === 'deactivated' ||
    normalizedStatus === 'disabled' ||
    normalizedStatus === 'banned'
  ) {
    return null;
  }

  return {
    id,
    email: email.toLowerCase(),
    tenantId,
    role,
    emailVerified,
    status: normalizedStatus,
  };
}

/**
 * Verifies that the authenticated user belongs to a target tenant.
 */
export function verifyTenantAccess(
  user: AuthenticatedUser | null | undefined,
  targetTenantId: string | null | undefined,
): boolean {
  if (!user || typeof user.tenantId !== 'string') {
    return false;
  }

  if (typeof targetTenantId !== 'string') {
    return false;
  }

  const userTenantId = user.tenantId.trim();
  const requestedTenantId = targetTenantId.trim();

  if (!userTenantId || !requestedTenantId) {
    return false;
  }

  return userTenantId === requestedTenantId;
}

/**
 * Resolves an already-established server-side session.
 */
export function resolveServerSession(
  rawSessionData: unknown,
): AuthCheckResult {
  if (
    rawSessionData === null ||
    typeof rawSessionData !== 'object' ||
    Array.isArray(rawSessionData)
  ) {
    return {
      isAuthenticated: false,
      error: 'No active session found.',
    };
  }

  const sessionRecord =
    rawSessionData as Record<string, unknown>;

  const candidateUser =
    sessionRecord.user ?? sessionRecord;

  const user =
    validateAuthenticatedUser(candidateUser);

  if (!user) {
    return {
      isAuthenticated: false,
      error: 'Invalid or expired session identity.',
    };
  }

  return {
    isAuthenticated: true,
    user,
  };
}

/**
 * Convenience check for tenant owner/admin.
 */
export function isTenantAdminOrOwner(
  user: AuthenticatedUser | null | undefined,
): boolean {
  return (
    user !== null &&
    user !== undefined &&
    (user.role === 'owner' || user.role === 'admin')
  );
}

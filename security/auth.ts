/**
 * @file security/auth.ts
 * @description Production-ready server-side authentication and session security utilities
 * for the GrowthAI SaaS platform.
 *
 * SECURITY NOTICE:
 * - This module is SERVER-ONLY.
 * - Never trust client-provided claims, roles, or tenant IDs.
 * - Authentication must be established from a trusted server-side session source.
 * - Authorization must be enforced separately by security/authorization.ts.
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

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Represents a verified, authenticated user session context
 * securely resolved on the server.
 */
export interface AuthenticatedUser {
  readonly id: string;
  readonly email: string;
  readonly tenantId: string;
  readonly role: UserRole;
  readonly emailVerified: boolean;
  readonly status: string;
}

/**
 * Result of an authentication check.
 */
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
 * Validates an unknown raw user/session identity.
 *
 * This function performs defensive runtime validation and fails closed
 * when required identity information is missing or malformed.
 */
export function validateAuthenticatedUser(
  rawUser: unknown
): AuthenticatedUser | null {
  if (!rawUser || typeof rawUser !== 'object') {
    return null;
  }

  const record = rawUser as Record<string, unknown>;

  const id = isNonEmptyString(record.id) ? record.id.trim() : '';
  const email = isNonEmptyString(record.email)
    ? record.email.trim()
    : '';
  const tenantId = isNonEmptyString(record.tenantId)
    ? record.tenantId.trim()
    : '';

  const role = isUserRole(record.role) ? record.role : null;

  const emailVerified =
    typeof record.emailVerified === 'boolean'
      ? record.emailVerified
      : false;

  const status = isNonEmptyString(record.status)
    ? record.status.trim()
    : 'active';

  if (!id || !email || !tenantId || !role) {
    return null;
  }

  if (status === 'suspended' || status === 'deactivated') {
    return null;
  }

  return {
    id,
    email,
    tenantId,
    role,
    emailVerified,
    status,
  };
}

/**
 * Verifies that an authenticated user belongs to the requested tenant.
 *
 * Always fails closed when either side of the comparison is missing.
 */
export function verifyTenantAccess(
  user: AuthenticatedUser | null,
  targetTenantId: string | null | undefined
): boolean {
  if (!user || !user.tenantId || !targetTenantId) {
    return false;
  }

  const normalizedTargetTenantId = targetTenantId.trim();

  if (!normalizedTargetTenantId) {
    return false;
  }

  return user.tenantId === normalizedTargetTenantId;
}

/**
 * Resolves and validates a server-side session identity.
 *
 * This function does not create or refresh sessions and does not trust
 * authorization claims supplied by the client.
 */
export function resolveServerSession(
  rawSessionData: unknown
): AuthCheckResult {
  if (!rawSessionData || typeof rawSessionData !== 'object') {
    return {
      isAuthenticated: false,
      error: 'No active session found.',
    };
  }

  const sessionRecord = rawSessionData as Record<string, unknown>;
  const candidateUser = sessionRecord.user ?? sessionRecord;

  const user = validateAuthenticatedUser(candidateUser);

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
 * Checks whether a verified tenant user has owner or admin role.
 *
 * This is a convenience identity check only.
 * Detailed permission checks belong in security/authorization.ts.
 */
export function isTenantAdminOrOwner(
  user: AuthenticatedUser | null
): boolean {
  if (!user) {
    return false;
  }

  return user.role === 'owner' || user.role === 'admin';
}

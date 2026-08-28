import 'server-only';

import type { AuthenticatedUser } from '../security/auth';
import { createTenantContext, type TenantContext } from '../security/tenant';

/**
 * @file server/context.ts
 * @description Trusted server execution context for GrowthAI.
 *
 * Provides a single server-side context containing the verified user
 * and tenant information required by server services and actions.
 */

export interface ServerContext {
  readonly user: AuthenticatedUser;
  readonly tenant: TenantContext;
  readonly requestId: string;
}

/**
 * Creates a trusted server context from an already verified user.
 *
 * The user must come from a trusted server-side authentication boundary.
 * Client-provided user or tenant identifiers must never be passed directly.
 */
export function createServerContext(
  user: AuthenticatedUser,
  requestId: string
): ServerContext {
  if (!user || typeof user !== 'object') {
    throw new Error('Failed to create server context: invalid user.');
  }

  if (!user.id || !user.tenantId || !user.role) {
    throw new Error('Failed to create server context: incomplete user context.');
  }

  const normalizedRequestId = requestId.trim();

  if (!normalizedRequestId) {
    throw new Error('Failed to create server context: request ID is required.');
  }

  const tenant = createTenantContext(user);

  return Object.freeze({
    user,
    tenant,
    requestId: normalizedRequestId,
  });
}

/**
 * Verifies that the supplied server context remains internally consistent.
 */
export function isValidServerContext(
  context: ServerContext | null | undefined
): context is ServerContext {
  if (!context) {
    return false;
  }

  if (!context.user || !context.tenant || !context.requestId) {
    return false;
  }

  return (
    context.user.id === context.tenant.userId &&
    context.user.tenantId === context.tenant.tenantId &&
    context.user.role === context.tenant.role
  );
}

import 'server-only';

import type { AuthenticatedUser } from '../security/auth';
import { createTenantContext, type TenantContext } from '../security/tenant';

/**
 * @file server/service.ts
 * @description Server-only service-layer foundation for GrowthAI.
 *
 * SECURITY:
 * - Services execute only on the server.
 * - Tenant context is derived from a verified AuthenticatedUser.
 * - Client-supplied tenant IDs must never be trusted as authority.
 */

export interface ServiceContext {
  readonly tenant: TenantContext;
  readonly user: AuthenticatedUser;
}

/**
 * Creates a trusted service context from a verified authenticated user.
 */
export function createServiceContext(
  user: AuthenticatedUser | null | undefined
): ServiceContext {
  if (!user) {
    throw new Error(
      'Service context creation failed: authenticated user is required.'
    );
  }

  const tenant = createTenantContext(user);

  return Object.freeze({
    tenant,
    user,
  });
}

/**
 * Executes a server-side operation with a trusted service context.
 */
export async function executeService<T>(
  user: AuthenticatedUser | null | undefined,
  operation: (context: ServiceContext) => Promise<T>
): Promise<T> {
  if (typeof operation !== 'function') {
    throw new Error('Service operation must be a function.');
  }

  const context = createServiceContext(user);

  return operation(context);
}

/**
 * Ensures that a service operation is executed only for the
 * authenticated user's trusted tenant.
 */
export function assertServiceTenant(
  context: ServiceContext,
  tenantId: unknown
): void {
  if (
    typeof tenantId !== 'string' ||
    tenantId.trim() === '' ||
    context.tenant.tenantId !== tenantId.trim()
  ) {
    throw new Error(
      'Access denied: Service tenant context mismatch.'
    );
  }
}

/**
 * Returns the trusted tenant ID associated with the service context.
 */
export function getServiceTenantId(
  context: ServiceContext
): string {
  return context.tenant.tenantId;
}

/**
 * Returns the trusted authenticated user ID associated with the service context.
 */
export function getServiceUserId(
  context: ServiceContext
): string {
  return context.user.id;
}

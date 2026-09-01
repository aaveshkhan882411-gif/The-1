import 'server-only';
import { ServerError } from './errors';

/**
 * @file server/guards.ts
 * @description Server-side route & action guards using centralized ServerError.
 */

export interface GuardContext {
  user?: {
    id: string;
    email: string;
    role: string;
    tenantId: string;
  } | null;
  [key: string]: unknown;
}

/**
 * Guard that enforces authenticated session presence.
 */
export function requireAuth() {
  return async (context: GuardContext) => {
    if (!context.user) {
      throw new ServerError('UNAUTHORIZED', {
        message: 'Authentication is required.',
        statusCode: 401,
      } as any);
    }
    return context.user;
  };
}

/**
 * Guard that enforces required roles.
 */
export function requireRole(allowedRoles: string[]) {
  return async (context: GuardContext) => {
    if (!context.user) {
      throw new ServerError('UNAUTHORIZED', {
        message: 'Authentication is required.',
        statusCode: 401,
      } as any);
    }

    if (!allowedRoles.includes(context.user.role)) {
      throw new ServerError('FORBIDDEN', {
        message: 'You do not have permission to perform this action.',
        statusCode: 403,
      } as any);
    }

    return context.user;
  };
}

/**
 * Guard that enforces tenant ownership/admin status.
 */
export function requireTenantAdmin() {
  return requireRole(['owner', 'admin']);
}

export default {
  requireAuth,
  requireRole,
  requireTenantAdmin,
};

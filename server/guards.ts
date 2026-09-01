import 'server-only';

/**
 * @file server/guards.ts
 * @description Server-side route & action guards with typed error handling.
 */

export class ServerError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(
    code: string,
    options?: { message?: string; statusCode?: number; cause?: unknown }
  ) {
    super(options?.message || code);
    this.name = 'ServerError';
    this.code = code;
    this.statusCode = options?.statusCode || 500;
  }
}

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
      });
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
      });
    }

    if (!allowedRoles.includes(context.user.role)) {
      throw new ServerError('FORBIDDEN', {
        message: 'You do not have permission to perform this action.',
        statusCode: 403,
      });
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
  ServerError,
  requireAuth,
  requireRole,
  requireTenantAdmin,
};

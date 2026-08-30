  /**
 * @file security/audit.ts
 * @description Server-only security audit event definitions and helpers.
 */

import 'server-only';

export type SecurityAuditEvent =
  | 'authentication_success'
  | 'authentication_failure'
  | 'authorization_denied'
  | 'tenant_access_denied'
  | 'csrf_failure'
  | 'rate_limit_exceeded'
  | 'validation_failure'
  | 'security_policy_violation';

export interface SecurityAuditContext {
  readonly userId?: string;
  readonly tenantId?: string;
  readonly requestId?: string;
  readonly ipAddress?: string;
  readonly userAgent?: string;
  readonly metadata?: Readonly<
    Record<string, string>
  >;
}

export interface SecurityAuditEntry {
  readonly event: SecurityAuditEvent;
  readonly timestamp: string;
  readonly context: SecurityAuditContext;
}

const SECURITY_AUDIT_EVENTS =
  new Set<SecurityAuditEvent>([
    'authentication_success',
    'authentication_failure',
    'authorization_denied',
    'tenant_access_denied',
    'csrf_failure',
    'rate_limit_exceeded',
    'validation_failure',
    'security_policy_violation',
  ]);

function sanitizeContext(
  context: SecurityAuditContext,
): SecurityAuditContext {
  const metadata =
    context.metadata
      ? Object.fromEntries(
          Object.entries(
            context.metadata,
          ).map(
            ([key, value]) => [
              String(key),
              String(value),
            ],
          ),
        )
      : undefined;

  return {
    ...(context.userId
      ? {
          userId:
            context.userId.trim(),
        }
      : {}),

    ...(context.tenantId
      ? {
          tenantId:
            context.tenantId.trim(),
        }
      : {}),

    ...(context.requestId
      ? {
          requestId:
            context.requestId.trim(),
        }
      : {}),

    ...(context.ipAddress
      ? {
          ipAddress:
            context.ipAddress.trim(),
        }
      : {}),

    ...(context.userAgent
      ? {
          userAgent:
            context.userAgent.trim(),
        }
      : {}),

    ...(metadata
      ? {
          metadata: Object.freeze(
            metadata,
          ),
        }
      : {}),
  };
}

export function createSecurityAuditEntry(
  event: SecurityAuditEvent,
  context: SecurityAuditContext = {},
): SecurityAuditEntry {
  if (!isSecurityAuditEvent(event)) {
    throw new Error(
      'Invalid security audit event.',
    );
  }

  const normalizedContext =
    sanitizeContext(context);

  return Object.freeze({
    event,
    timestamp:
      new Date().toISOString(),
    context: Object.freeze(
      normalizedContext,
    ),
  });
}

export function isSecurityAuditEvent(
  value: unknown,
): value is SecurityAuditEvent {
  return (
    typeof value === 'string' &&
    SECURITY_AUDIT_EVENTS.has(
      value as SecurityAuditEvent,
    )
  );
}

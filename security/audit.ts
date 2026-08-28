import 'server-only';

/**
 * @file security/audit.ts
 * @description Server-only security audit event definitions and helpers
 * for the GrowthAI SaaS platform.
 */

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
  readonly metadata?: Readonly<Record<string, string>>;
}

export interface SecurityAuditEntry {
  readonly event: SecurityAuditEvent;
  readonly timestamp: string;
  readonly context: SecurityAuditContext;
}

/**
 * Creates a normalized security audit entry.
 *
 * This function does not persist or transmit the event.
 * Persistence/logging is intentionally delegated to a later infrastructure layer.
 */
export function createSecurityAuditEntry(
  event: SecurityAuditEvent,
  context: SecurityAuditContext = {}
): SecurityAuditEntry {
  if (!event) {
    throw new Error('Security audit event is required.');
  }

  return Object.freeze({
    event,
    timestamp: new Date().toISOString(),
    context: Object.freeze({ ...context }),
  });
}

/**
 * Validates whether an unknown value is a supported security audit event.
 */
export function isSecurityAuditEvent(
  value: unknown
): value is SecurityAuditEvent {
  if (typeof value !== 'string') {
    return false;
  }

  switch (value) {
    case 'authentication_success':
    case 'authentication_failure':
    case 'authorization_denied':
    case 'tenant_access_denied':
    case 'csrf_failure':
    case 'rate_limit_exceeded':
    case 'validation_failure':
    case 'security_policy_violation':
      return true;

    default:
      return false;
  }
}

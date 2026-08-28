import 'server-only';

/**
 * @file security/security-policy.ts
 * @description Centralized server-only security policy definitions and
 * security decision helpers for the GrowthAI SaaS platform.
 */

export type SecurityPolicyName =
  | 'authentication'
  | 'tenantIsolation'
  | 'authorization'
  | 'csrf'
  | 'rateLimit'
  | 'secureTransport'
  | 'inputValidation'
  | 'securityHeaders';

export interface SecurityPolicy {
  readonly authentication: boolean;
  readonly tenantIsolation: boolean;
  readonly authorization: boolean;
  readonly csrf: boolean;
  readonly rateLimit: boolean;
  readonly secureTransport: boolean;
  readonly inputValidation: boolean;
  readonly securityHeaders: boolean;
  readonly isPublicEndpoint: boolean;
}

export type SecurityPolicyOverrides = Partial<SecurityPolicy>;

export const DEFAULT_SECURITY_POLICY: Readonly<SecurityPolicy> =
  Object.freeze({
    authentication: true,
    tenantIsolation: true,
    authorization: true,
    csrf: true,
    rateLimit: true,
    secureTransport: true,
    inputValidation: true,
    securityHeaders: true,
    isPublicEndpoint: false,
  });

export function isSecurityPolicyEnabled(
  policy: Readonly<SecurityPolicy>,
  policyName: SecurityPolicyName
): boolean {
  if (!policy || typeof policy !== 'object') {
    return true;
  }

  switch (policyName) {
    case 'authentication':
      return policy.authentication && !policy.isPublicEndpoint;

    case 'tenantIsolation':
      return policy.tenantIsolation;

    case 'authorization':
      return policy.authorization && !policy.isPublicEndpoint;

    case 'csrf':
      return policy.csrf;

    case 'rateLimit':
      return policy.rateLimit;

    case 'secureTransport':
      return policy.secureTransport;

    case 'inputValidation':
      return policy.inputValidation;

    case 'securityHeaders':
      return policy.securityHeaders;

    default:
      return true;
  }
}

export function resolveSecurityPolicy(
  overrides?: SecurityPolicyOverrides
): Readonly<SecurityPolicy> {
  if (!overrides || typeof overrides !== 'object') {
    return DEFAULT_SECURITY_POLICY;
  }

  const isPublicEndpoint =
    overrides.isPublicEndpoint ??
    DEFAULT_SECURITY_POLICY.isPublicEndpoint;

  const resolved: SecurityPolicy = {
    authentication: isPublicEndpoint
      ? false
      : overrides.authentication ??
        DEFAULT_SECURITY_POLICY.authentication,

    tenantIsolation:
      overrides.tenantIsolation ??
      DEFAULT_SECURITY_POLICY.tenantIsolation,

    authorization: isPublicEndpoint
      ? false
      : overrides.authorization ??
        DEFAULT_SECURITY_POLICY.authorization,

    csrf:
      overrides.csrf ??
      DEFAULT_SECURITY_POLICY.csrf,

    rateLimit:
      overrides.rateLimit ??
      DEFAULT_SECURITY_POLICY.rateLimit,

    secureTransport:
      overrides.secureTransport ??
      DEFAULT_SECURITY_POLICY.secureTransport,

    inputValidation:
      overrides.inputValidation ??
      DEFAULT_SECURITY_POLICY.inputValidation,

    securityHeaders:
      overrides.securityHeaders ??
      DEFAULT_SECURITY_POLICY.securityHeaders,

    isPublicEndpoint,
  };

  return Object.freeze(resolved);
}

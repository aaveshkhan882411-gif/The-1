import 'server-only';

/**
 * Path: security/secrets.ts
 * Purpose: Centralized, server-only utility for safely reading and validating server-side environment secrets and sensitive configuration for GrowthAI.
 */

/**
 * Validates that an environment variable name is safe and well-formed.
 * Prevents injection or malformed variable names.
 */
export function validateEnvName(name: string): boolean {
  if (typeof name !== 'string') {
    return false;
  }
  // Standard environment variable name: uppercase letters, numbers, and underscores
  const ENV_NAME_REGEX = /^[A-Z_][A-Z0-9_]*$/;
  return ENV_NAME_REGEX.test(name);
}

/**
 * Checks whether an environment variable exists and is non-empty.
 */
export function hasEnv(name: string): boolean {
  if (!validateEnvName(name)) {
    return false;
  }
  const value = process.env[name];
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates that a secret is not accidentally exposed as a NEXT_PUBLIC_* variable.
 * Throws or returns an error indicator if a public prefix is detected.
 */
export function assertNotPublic(name: string): void {
  if (name.startsWith('NEXT_PUBLIC_')) {
    throw new Error('Security violation: Server-side secrets cannot use NEXT_PUBLIC_ prefix.');
  }
}

/**
 * Reads a required server secret environment variable.
 * Throws a safe error without revealing secret details if missing, empty, or improperly exposed.
 */
export function getRequiredSecret(name: string): string {
  if (!validateEnvName(name)) {
    throw new Error('Required server environment variable name is invalid.');
  }

  assertNotPublic(name);

  const value = process.env[name];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error('Required server environment variable is missing.');
  }

  return value.trim();
}

/**
 * Reads an optional server configuration environment variable.
 * Returns the trimmed string or undefined if not set/empty, ensuring safety checks.
 */
export function getOptionalSecret(name: string): string | undefined {
  if (!validateEnvName(name)) {
    return undefined;
  }

  // Optional secrets should also not be public keys
  if (name.startsWith('NEXT_PUBLIC_')) {
    return undefined;
  }

  const value = process.env[name];
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}


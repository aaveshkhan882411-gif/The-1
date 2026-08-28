/**
 * @file security/csrf.ts
 * @description Server-only CSRF protection utility for the GrowthAI SaaS platform.
 *
 * SECURITY NOTICE:
 * - Uses cryptographically secure Web Crypto APIs.
 * - Fails closed when tokens are missing or malformed.
 * - Provider-independent and compatible with modern server-side runtimes.
 */

import 'server-only';

export const CSRF_CONFIG = {
  byteLength: 32,
  tokenHeaderName: 'x-csrf-token',
  tokenCookieName: 'growthai.csrf',
} as const;

const STATE_CHANGING_METHODS = [
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
] as const;

/**
 * Determines whether an HTTP method can change server-side state.
 */
export function isStateChangingMethod(
  method: unknown
): boolean {
  if (typeof method !== 'string') {
    return false;
  }

  const normalizedMethod = method.trim().toUpperCase();

  return STATE_CHANGING_METHODS.includes(
    normalizedMethod as (typeof STATE_CHANGING_METHODS)[number]
  );
}

/**
 * Generates a cryptographically secure CSRF token.
 *
 * The returned value contains 256 bits of random entropy
 * represented as 64 lowercase hexadecimal characters.
 */
export function generateCsrfToken(): string {
  const bytes = new Uint8Array(
    CSRF_CONFIG.byteLength
  );

  crypto.getRandomValues(bytes);

  let token = '';

  for (const byte of bytes) {
    token += byte.toString(16).padStart(2, '0');
  }

  return token;
}

function isValidTokenFormat(
  token: unknown
): token is string {
  if (typeof token !== 'string') {
    return false;
  }

  const normalizedToken = token.trim();
  const expectedLength =
    CSRF_CONFIG.byteLength * 2;

  return (
    normalizedToken.length === expectedLength &&
    /^[0-9a-f]+$/i.test(normalizedToken)
  );
}

/**
 * Performs a constant-time comparison of two valid CSRF tokens.
 *
 * Both tokens are converted to bytes and compared without
 * early-returning based on matching characters.
 */
export function validateCsrfToken(
  clientToken: unknown,
  serverToken: unknown
): boolean {
  if (
    !isValidTokenFormat(clientToken) ||
    !isValidTokenFormat(serverToken)
  ) {
    return false;
  }

  const clientBytes = hexToBytes(
    clientToken.trim()
  );

  const serverBytes = hexToBytes(
    serverToken.trim()
  );

  if (
    clientBytes.length !== serverBytes.length
  ) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < clientBytes.length; index += 1) {
    difference |=
      clientBytes[index] ^ serverBytes[index];
  }

  return difference === 0;
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(
    hex.length / 2
  );

  for (
    let index = 0;
    index < hex.length;
    index += 2
  ) {
    bytes[index / 2] = Number.parseInt(
      hex.slice(index, index + 2),
      16
    );
  }

  return bytes;
}

/**
 * Enforces CSRF validation and throws a safe error
 * when the supplied token is invalid.
 */
export function requireValidCsrfToken(
  clientToken: unknown,
  serverToken: unknown
): void {
  if (
    !validateCsrfToken(
      clientToken,
      serverToken
    )
  ) {
    throw new Error(
      'Access denied: Invalid or missing CSRF token.'
    );
  }
}

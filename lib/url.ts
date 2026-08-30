import 'server-only';

/**
 * @file lib/url.ts
 * @description Safe URL and origin utilities for GrowthAI.
 *
 * These helpers validate URLs and origins before they are used
 * for redirects, integrations, callbacks, or external requests.
 */

/**
 * Supported protocols for normal web URLs.
 */
const DEFAULT_PROTOCOLS = ['http:', 'https:'] as const;

/**
 * Validates and parses a URL.
 */
export function parseUrl(
  value: unknown,
  allowedProtocols: readonly string[] = DEFAULT_PROTOCOLS
): URL | null {
  if (typeof value !== 'string') {
    return null;
  }

  const input = value.trim();

  if (!input) {
    return null;
  }

  try {
    const url = new URL(input);

    if (!allowedProtocols.includes(url.protocol)) {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

/**
 * Checks whether a value is a valid HTTP or HTTPS URL.
 */
export function isValidUrl(
  value: unknown
): value is string {
  return parseUrl(value) !== null;
}

/**
 * Returns a normalized URL string.
 */
export function normalizeUrl(
  value: unknown
): string | null {
  const url = parseUrl(value);

  return url ? url.toString() : null;
}

/**
 * Returns the origin of a valid URL.
 */
export function getOrigin(
  value: unknown
): string | null {
  const url = parseUrl(value);

  return url ? url.origin : null;
}

/**
 * Safely joins a base URL with a path.
 */
export function joinUrl(
  baseUrl: unknown,
  path: unknown
): string | null {
  if (
    typeof baseUrl !== 'string' ||
    typeof path !== 'string'
  ) {
    return null;
  }

  const base = parseUrl(baseUrl);

  if (!base) {
    return null;
  }

  const normalizedPath = path.trim();

  if (!normalizedPath) {
    return base.toString();
  }

  try {
    return new URL(
      normalizedPath,
      base
    ).toString();
  } catch {
    return null;
  }
}

/**
 * Determines whether two URLs share the same origin.
 */
export function isSameOrigin(
  first: unknown,
  second: unknown
): boolean {
  const firstOrigin = getOrigin(first);
  const secondOrigin = getOrigin(second);

  return (
    firstOrigin !== null &&
    secondOrigin !== null &&
    firstOrigin === secondOrigin
  );
}

/**
 * Safely extracts a URL hostname.
 */
export function getHostname(
  value: unknown
): string | null {
  const url = parseUrl(value);

  return url ? url.hostname : null;
}

/**
 * Checks whether a URL points to localhost.
 */
export function isLocalhostUrl(
  value: unknown
): boolean {
  const hostname = getHostname(value);

  if (!hostname) {
    return false;
  }

  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1'
  );
}

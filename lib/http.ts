import 'server-only';

/**
 * @file lib/http.ts
 * @description Shared HTTP utilities for GrowthAI.
 *
 * Provides safe request metadata extraction and common
 * HTTP method helpers for server-side code.
 */

/**
 * Supported HTTP methods.
 */
export const HTTP_METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
] as const;

export type HttpMethod = (typeof HTTP_METHODS)[number];

/**
 * Checks whether a value is a supported HTTP method.
 */
export function isHttpMethod(
  value: unknown
): value is HttpMethod {
  if (typeof value !== 'string') {
    return false;
  }

  return HTTP_METHODS.includes(
    value.trim().toUpperCase() as HttpMethod
  );
}

/**
 * Normalizes an HTTP method safely.
 */
export function normalizeHttpMethod(
  value: unknown
): HttpMethod | null {
  if (!isHttpMethod(value)) {
    return null;
  }

  return value.trim().toUpperCase() as HttpMethod;
}

/**
 * Checks whether an HTTP method changes server state.
 */
export function isMutationMethod(
  method: unknown
): boolean {
  const normalized = normalizeHttpMethod(method);

  return (
    normalized === 'POST' ||
    normalized === 'PUT' ||
    normalized === 'PATCH' ||
    normalized === 'DELETE'
  );
}

/**
 * Checks whether a request is read-only.
 */
export function isReadOnlyMethod(
  method: unknown
): boolean {
  const normalized = normalizeHttpMethod(method);

  return (
    normalized === 'GET' ||
    normalized === 'HEAD' ||
    normalized === 'OPTIONS'
  );
}

/**
 * Safely reads a request header.
 */
export function getRequestHeader(
  request: Request,
  name: string
): string | null {
  if (!(request instanceof Request)) {
    return null;
  }

  if (
    typeof name !== 'string' ||
    name.trim().length === 0
  ) {
    return null;
  }

  const value = request.headers.get(name.trim());

  return value?.trim() || null;
}

/**
 * Safely extracts the request origin.
 */
export function getRequestOrigin(
  request: Request
): string | null {
  const origin = getRequestHeader(
    request,
    'origin'
  );

  if (!origin) {
    return null;
  }

  try {
    return new URL(origin).origin;
  } catch {
    return null;
  }
}

/**
 * Safely extracts the request content type.
 */
export function getContentType(
  request: Request
): string | null {
  const value = getRequestHeader(
    request,
    'content-type'
  );

  if (!value) {
    return null;
  }

  return value
    .split(';', 1)[0]
    ?.trim()
    .toLowerCase() || null;
}

import 'server-only';

/**
 * @file lib/query.ts
 * @description Safe query-string parsing utilities for GrowthAI.
 */

/**
 * Safely parses a URL query string or URL.
 */
export function parseQuery(
  input: string | URL
): URLSearchParams {
  if (input instanceof URL) {
    return new URLSearchParams(input.search);
  }

  if (typeof input !== 'string') {
    return new URLSearchParams();
  }

  try {
    const value = input.trim();

    if (!value) {
      return new URLSearchParams();
    }

    if (value.startsWith('?')) {
      return new URLSearchParams(value);
    }

    if (value.startsWith('http://') || value.startsWith('https://')) {
      return new URL(value).searchParams;
    }

    return new URLSearchParams(value);
  } catch {
    return new URLSearchParams();
  }
}

/**
 * Returns the first non-empty query parameter value.
 */
export function getQueryParam(
  input: string | URL,
  name: string
): string | null {
  if (
    typeof name !== 'string' ||
    name.trim().length === 0
  ) {
    return null;
  }

  const value = parseQuery(input).get(name.trim());

  return value?.trim() || null;
}

/**
 * Returns all non-empty values for a query parameter.
 */
export function getQueryParams(
  input: string | URL,
  name: string
): readonly string[] {
  if (
    typeof name !== 'string' ||
    name.trim().length === 0
  ) {
    return [];
  }

  return parseQuery(input)
    .getAll(name.trim())
    .map((value) => value.trim())
    .filter(Boolean);
}

/**
 * Safely parses a positive integer query parameter.
 */
export function getPositiveIntegerParam(
  input: string | URL,
  name: string,
  fallback: number,
  max?: number
): number {
  const raw = getQueryParam(input, name);

  if (!raw) {
    return fallback;
  }

  const value = Number(raw);

  if (
    !Number.isInteger(value) ||
    value < 1
  ) {
    return fallback;
  }

  if (
    max !== undefined &&
    value > max
  ) {
    return max;
  }

  return value;
}

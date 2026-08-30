import 'server-only';

/**
 * @file lib/utils.ts
 * @description Shared server-safe utility functions for GrowthAI.
 *
 * This module contains small, dependency-free helpers that can be reused
 * across the server, agents, workflows, billing, integrations, and API layers.
 */

/**
 * Returns true when a value is a non-empty string after trimming.
 */
export function isNonEmptyString(
  value: unknown
): value is string {
  return (
    typeof value === 'string' &&
    value.trim().length > 0
  );
}

/**
 * Safely trims a string.
 */
export function trimString(
  value: unknown
): string {
  return typeof value === 'string'
    ? value.trim()
    : '';
}

/**
 * Safely converts a value to a finite number.
 */
export function toFiniteNumber(
  value: unknown
): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);

    return Number.isFinite(parsed)
      ? parsed
      : null;
  }

  return null;
}

/**
 * Clamps a number between minimum and maximum bounds.
 */
export function clamp(
  value: number,
  min: number,
  max: number
): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  if (min > max) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

/**
 * Safely converts an unknown value to a plain object.
 */
export function toPlainObject(
  value: unknown
): Record<string, unknown> | null {
  if (
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return null;
  }

  return value as Record<string, unknown>;
}

/**
 * Generates a short random identifier using Web Crypto when available.
 */
export function createRandomId(
  length = 16
): string {
  const safeLength = clamp(
    Math.floor(length),
    1,
    128
  );

  const bytes = new Uint8Array(
    Math.ceil(safeLength / 2)
  );

  crypto.getRandomValues(bytes);

  let result = '';

  for (const byte of bytes) {
    result += byte.toString(16).padStart(2, '0');
  }

  return result.slice(0, safeLength);
}

/**
 * Creates a UTC ISO timestamp.
 */
export function nowIso(): string {
  return new Date().toISOString();
}

/**
 * Returns a promise that resolves after the requested delay.
 */
export function sleep(
  milliseconds: number
): Promise<void> {
  const delay = clamp(
    Math.floor(milliseconds),
    0,
    2_147_483_647
  );

  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

/**
 * Safely parses JSON without throwing.
 */
export function safeJsonParse<T = unknown>(
  value: string
): T | null {
  if (typeof value !== 'string') {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

/**
 * Removes undefined properties from a plain object.
 */
export function removeUndefined<T extends Record<string, unknown>>(
  value: T
): Partial<T> {
  const result: Partial<T> = {};

  for (const [key, item] of Object.entries(value)) {
    if (item !== undefined) {
      result[key as keyof T] = item as T[keyof T];
    }
  }

  return result;
}

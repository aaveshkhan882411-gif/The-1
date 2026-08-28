/**
 * @file security/sanitization.ts
 * @description Centralized, server-only text normalization and sanitization
 * utilities for the GrowthAI SaaS platform.
 *
 * SECURITY NOTICE:
 * - This module handles plain text only.
 * - It does not make arbitrary HTML safe.
 * - Output encoding must still be performed by the rendering layer.
 */

import 'server-only';

export interface TextOptions {
  readonly maxLength?: number;
  readonly normalizeWhitespace?: boolean;
}

function getSafeMaxLength(
  maxLength: number | undefined
): number | undefined {
  if (maxLength === undefined) {
    return undefined;
  }

  if (
    !Number.isSafeInteger(maxLength) ||
    maxLength < 0
  ) {
    return undefined;
  }

  return maxLength;
}

/**
 * Normalizes trusted-to-process text without executing or interpreting it.
 */
export function normalizeText(
  input: unknown,
  options: TextOptions = {}
): string {
  if (typeof input !== 'string') {
    return '';
  }

  let text = input.normalize('NFC');

  if (options.normalizeWhitespace) {
    text = text.replace(/\s+/gu, ' ');
  }

  text = text.trim();

  const maxLength = getSafeMaxLength(
    options.maxLength
  );

  if (
    maxLength !== undefined &&
    text.length > maxLength
  ) {
    text = text.slice(0, maxLength);
  }

  return text;
}

/**
 * General-purpose text sanitization.
 */
export function sanitizeText(
  input: unknown,
  options: TextOptions = {}
): string {
  return normalizeText(input, {
    normalizeWhitespace:
      options.normalizeWhitespace ?? false,
    maxLength: options.maxLength,
  });
}

/**
 * Converts input into plain text by removing HTML-like markup.
 *
 * This function is intentionally NOT an HTML sanitizer.
 * Arbitrary HTML should never be considered safe based on this function alone.
 */
export function sanitizePlainText(
  input: unknown,
  options: TextOptions = {}
): string {
  const normalized = normalizeText(input, {
    normalizeWhitespace:
      options.normalizeWhitespace ?? true,
    maxLength: options.maxLength,
  });

  if (!normalized) {
    return '';
  }

  const withoutTags = normalized.replace(
    /<[^>]*>/gu,
    ''
  );

  return withoutTags.trim();
}

/**
 * Sanitizes a non-secret internal identifier.
 *
 * Allowed characters:
 * - A-Z
 * - a-z
 * - 0-9
 * - hyphen
 * - underscore
 */
export function sanitizeIdentifier(
  input: unknown,
  maxLength: number = 128
): string {
  const normalized = normalizeText(input, {
    maxLength,
    normalizeWhitespace: false,
  });

  return normalized.replace(
    /[^a-zA-Z0-9_-]/gu,
    ''
  );
}

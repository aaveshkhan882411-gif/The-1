import 'server-only';

/**
 * @file lib/format.ts
 * @description Shared formatting utilities for GrowthAI.
 *
 * These helpers are deterministic, dependency-free, and safe for
 * server-side application logic.
 */

/**
 * Formats a number using the requested locale.
 */
export function formatNumber(
  value: number,
  locale = 'en-US'
): string {
  if (!Number.isFinite(value)) {
    return '0';
  }

  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Formats a number as currency.
 */
export function formatCurrency(
  value: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  if (!Number.isFinite(value)) {
    value = 0;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats a percentage value.
 *
 * Example: 0.25 -> 25%
 */
export function formatPercentage(
  value: number,
  locale = 'en-US'
): string {
  if (!Number.isFinite(value)) {
    return '0%';
  }

  return new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats an ISO date or Date instance into a readable date.
 */
export function formatDate(
  value: string | Date,
  locale = 'en-US'
): string {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Formats an ISO date or Date instance into a readable date and time.
 */
export function formatDateTime(
  value: string | Date,
  locale = 'en-US'
): string {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

/**
 * Converts a string into a human-readable title.
 */
export function toTitleCase(
  value: string
): string {
  return value
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(
      /\b\w/g,
      (character) => character.toUpperCase()
    );
}

/**
 * Safely abbreviates long text.
 */
export function truncate(
  value: string,
  maxLength: number
): string {
  const text = value.trim();

  if (
    maxLength <= 0 ||
    text.length <= maxLength
  ) {
    return text;
  }

  if (maxLength <= 3) {
    return text.slice(0, maxLength);
  }

  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Masks an email address for privacy-safe display.
 */
export function maskEmail(
  email: string
): string {
  const normalized = email.trim();

  const separatorIndex = normalized.indexOf('@');

  if (
    separatorIndex <= 0 ||
    separatorIndex === normalized.length - 1
  ) {
    return '';
  }

  const localPart = normalized.slice(
    0,
    separatorIndex
  );

  const domain = normalized.slice(
    separatorIndex + 1
  );

  const visible =
    localPart.length <= 2
      ? localPart.charAt(0)
      : localPart.slice(0, 2);

  return `${visible}***@${domain}`;
}

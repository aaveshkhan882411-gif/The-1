import 'server-only';

/**
 * @file lib/date.ts
 * @description Shared date and time utilities for GrowthAI.
 *
 * These helpers are dependency-free and use UTC internally
 * where deterministic server-side behavior is required.
 */

/**
 * Converts a Date or date-like value into a valid Date.
 */
export function toDate(
  value: string | number | Date
): Date | null {
  const date =
    value instanceof Date
      ? new Date(value.getTime())
      : new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

/**
 * Returns the current UTC timestamp as a Date.
 */
export function now(): Date {
  return new Date();
}

/**
 * Returns the current timestamp as an ISO string.
 */
export function nowIso(): string {
  return new Date().toISOString();
}

/**
 * Converts a date value into an ISO string.
 */
export function toIsoString(
  value: string | number | Date
): string | null {
  const date = toDate(value);

  return date ? date.toISOString() : null;
}

/**
 * Checks whether a supplied date value is valid.
 */
export function isValidDate(
  value: unknown
): boolean {
  if (
    value instanceof Date ||
    typeof value === 'string' ||
    typeof value === 'number'
  ) {
    return toDate(value) !== null;
  }

  return false;
}

/**
 * Adds milliseconds to a date.
 */
export function addMilliseconds(
  value: string | number | Date,
  milliseconds: number
): Date | null {
  const date = toDate(value);

  if (
    !date ||
    !Number.isFinite(milliseconds)
  ) {
    return null;
  }

  return new Date(
    date.getTime() + milliseconds
  );
}

/**
 * Adds seconds to a date.
 */
export function addSeconds(
  value: string | number | Date,
  seconds: number
): Date | null {
  if (!Number.isFinite(seconds)) {
    return null;
  }

  return addMilliseconds(
    value,
    seconds * 1_000
  );
}

/**
 * Adds minutes to a date.
 */
export function addMinutes(
  value: string | number | Date,
  minutes: number
): Date | null {
  if (!Number.isFinite(minutes)) {
    return null;
  }

  return addMilliseconds(
    value,
    minutes * 60_000
  );
}

/**
 * Adds hours to a date.
 */
export function addHours(
  value: string | number | Date,
  hours: number
): Date | null {
  if (!Number.isFinite(hours)) {
    return null;
  }

  return addMilliseconds(
    value,
    hours * 3_600_000
  );
}

/**
 * Returns the difference between two dates in milliseconds.
 */
export function differenceInMilliseconds(
  from: string | number | Date,
  to: string | number | Date
): number | null {
  const fromDate = toDate(from);
  const toDateValue = toDate(to);

  if (!fromDate || !toDateValue) {
    return null;
  }

  return toDateValue.getTime() - fromDate.getTime();
}

/**
 * Returns the difference between two dates in seconds.
 */
export function differenceInSeconds(
  from: string | number | Date,
  to: string | number | Date
): number | null {
  const difference = differenceInMilliseconds(
    from,
    to
  );

  return difference === null
    ? null
    : Math.floor(difference / 1_000);
}

/**
 * Checks whether a date is in the past.
 */
export function isPast(
  value: string | number | Date
): boolean {
  const date = toDate(value);

  return date !== null &&
    date.getTime() < Date.now();
}

/**
 * Checks whether a date is in the future.
 */
export function isFuture(
  value: string | number | Date
): boolean {
  const date = toDate(value);

  return date !== null &&
    date.getTime() > Date.now();
}

/**
 * Returns true when two dates represent the same timestamp.
 */
export function isSameTime(
  first: string | number | Date,
  second: string | number | Date
): boolean {
  const firstDate = toDate(first);
  const secondDate = toDate(second);

  return (
    firstDate !== null &&
    secondDate !== null &&
    firstDate.getTime() === secondDate.getTime()
  );
}

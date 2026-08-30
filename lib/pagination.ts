import 'server-only';

/**
 * @file lib/pagination.ts
 * @description Centralized pagination utilities for GrowthAI.
 */

export interface PaginationOptions {
  readonly page?: number;
  readonly pageSize?: number;
  readonly maxPageSize?: number;
}

export interface PaginationMeta {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

export interface PaginationResult {
  readonly offset: number;
  readonly limit: number;
  readonly meta: PaginationMeta;
}

/**
 * Safely normalizes a positive integer.
 */
function normalizePositiveInteger(
  value: unknown,
  fallback: number
): number {
  if (
    typeof value !== 'number' ||
    !Number.isInteger(value) ||
    value < 1
  ) {
    return fallback;
  }

  return value;
}

/**
 * Creates normalized pagination values.
 */
export function createPagination(
  totalItems: number,
  options: PaginationOptions = {}
): PaginationResult {
  const safeTotalItems =
    Number.isFinite(totalItems) && totalItems >= 0
      ? Math.floor(totalItems)
      : 0;

  const maxPageSize = normalizePositiveInteger(
    options.maxPageSize,
    100
  );

  const requestedPageSize = normalizePositiveInteger(
    options.pageSize,
    25
  );

  const pageSize = Math.min(
    requestedPageSize,
    maxPageSize
  );

  const page = normalizePositiveInteger(
    options.page,
    1
  );

  const totalPages =
    safeTotalItems === 0
      ? 0
      : Math.ceil(safeTotalItems / pageSize);

  const offset = (page - 1) * pageSize;

  return {
    offset,
    limit: pageSize,
    meta: {
      page,
      pageSize,
      totalItems: safeTotalItems,
      totalPages,
      hasNextPage:
        totalPages > 0 && page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

/**
 * Calculates the database offset for a page.
 */
export function getOffset(
  page: number,
  pageSize: number
): number {
  const safePage = normalizePositiveInteger(
    page,
    1
  );

  const safePageSize = normalizePositiveInteger(
    pageSize,
    25
  );

  return (safePage - 1) * safePageSize;
}

/**
 * Calculates the total number of pages.
 */
export function getTotalPages(
  totalItems: number,
  pageSize: number
): number {
  if (
    !Number.isFinite(totalItems) ||
    totalItems <= 0
  ) {
    return 0;
  }

  const safePageSize = normalizePositiveInteger(
    pageSize,
    25
  );

  return Math.ceil(
    Math.floor(totalItems) / safePageSize
  );
}

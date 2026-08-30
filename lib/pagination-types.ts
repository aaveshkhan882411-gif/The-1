import 'server-only';

/**
 * @file lib/pagination-types.ts
 * @description Shared pagination types for GrowthAI.
 */

export interface PageRequest {
  readonly page?: number;
  readonly pageSize?: number;
}

export interface PageMeta {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

export interface Paginated

/**
 * @file database/repository.ts
 * @description Generic repository abstraction for GrowthAI.
 *
 * Business logic should use repositories instead of executing SQL directly.
 */

import type {
  DatabaseAdapter,
  DatabaseRecord,
  QueryOptions,
  QueryResult,
  UUID,
} from './types';

export abstract class Repository<
  T extends DatabaseRecord,
  CreateInput,
  UpdateInput,
> {
  protected constructor(
    protected readonly db: DatabaseAdapter,
    protected readonly tableName: string,
  ) {}

  abstract findById(id: UUID): Promise<T | null>;

  abstract findMany(
    options?: QueryOptions,
  ): Promise<QueryResult<T>>;

  abstract create(input: CreateInput): Promise<T>;

  abstract update(
    id: UUID,
    input: UpdateInput,
  ): Promise<T>;

  abstract delete(id: UUID): Promise<void>;
}

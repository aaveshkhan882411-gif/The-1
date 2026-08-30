import 'server-only';

/**
 * @file lib/cache.ts
 * @description Small server-side in-memory cache utility for GrowthAI.
 *
 * NOTE:
 * This cache is process-local and is not suitable for distributed
 * serverless persistence. Use Redis or another shared store when
 * cross-instance persistence is required.
 */

export interface CacheOptions {
  readonly ttlMs?: number;
}

interface CacheEntry<T> {
  readonly value: T;
  readonly expiresAt: number;
}

export interface CacheStore<T = unknown> {
  get(key: string): T | undefined;
  set(key: string, value: T, options?: CacheOptions): void;
  has(key: string): boolean;
  delete(key: string): boolean;
  clear(): void;
}

/**
 * Creates an isolated in-memory cache.
 */
export function createCache<T = unknown>(
  defaultTtlMs = 5 * 60 * 1000
): CacheStore<T> {
  const store = new Map<string, CacheEntry<T>>();
  const safeDefaultTtl = Math.max(
    1,
    Math.floor(defaultTtlMs)
  );

  function normalizeKey(key: unknown): string | null {
    if (
      typeof key !== 'string' ||
      key.trim().length === 0
    ) {
      return null;
    }

    return key.trim();
  }

  function get(key: string): T | undefined {
    const normalizedKey = normalizeKey(key);

    if (!normalizedKey) {
      return undefined;
    }

    const entry = store.get(normalizedKey);

    if (!entry) {
      return undefined;
    }

    if (Date.now() >= entry.expiresAt) {
      store.delete(normalizedKey);
      return undefined;
    }

    return entry.value;
  }

  function set(
    key: string,
    value: T,
    options: CacheOptions = {}
  ): void {
    const normalizedKey = normalizeKey(key);

    if (!normalizedKey) {
      return;
    }

    const ttl =
      typeof options.ttlMs === 'number' &&
      Number.isFinite(options.ttlMs) &&
      options.ttlMs > 0
        ? Math.floor(options.ttlMs)
        : safeDefaultTtl;

    store.set(normalizedKey, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  function has(key: string): boolean {
    return get(key) !== undefined;
  }

  function remove(key: string): boolean {
    const normalizedKey = normalizeKey(key);

    if (!normalizedKey) {
      return false;
    }

    return store.delete(normalizedKey);
  }

  function clear(): void {
    store.clear();
  }

  return {
    get,
    set,
    has,
    delete: remove,
    clear,
  };
}

/**
 * Shared process-local cache instance.
 */
export const serverCache = createCache();

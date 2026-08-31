/**
 * @file lib/cache.ts
 * @description Server-safe in-memory cache with TTL, maximum size,
 * automatic expiration, and LRU-style eviction.
 *
 * IMPORTANT:
 * - This cache is process-local.
 * - It is NOT a distributed cache.
 * - Do not use it for authentication, authorization, payments,
 *   secrets, or other security-critical state.
 * - Redis should be used later when distributed/serverless caching
 *   is required.
 */

import 'server-only';

export interface CacheOptions {
  readonly ttlMs?: number;
}

export interface CacheConfig {
  readonly defaultTtlMs: number;
  readonly maxEntries: number;
  readonly cleanupIntervalMs: number;
}

export interface CacheStats {
  readonly size: number;
  readonly maxEntries: number;
}

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  lastAccessedAt: number;
}

const DEFAULT_TTL_MS = 5 * 60 * 1000;
const DEFAULT_MAX_ENTRIES = 500;
const DEFAULT_CLEANUP_INTERVAL_MS = 60 * 1000;

function normalizePositiveInteger(
  value: number | undefined,
  fallback: number,
): number {
  if (
    value === undefined ||
    !Number.isSafeInteger(value) ||
    value <= 0
  ) {
    return fallback;
  }

  return value;
}

function normalizeKey(key: unknown): string | null {
  if (typeof key !== 'string') {
    return null;
  }

  const normalized = key.trim();

  if (!normalized || normalized.length > 512) {
    return null;
  }

  return normalized;
}

export class MemoryCache {
  private readonly store = new Map<
    string,
    CacheEntry<unknown>
  >();

  private readonly defaultTtlMs: number;
  private readonly maxEntries: number;
  private readonly cleanupIntervalMs: number;

  private cleanupTimer: ReturnType<typeof setInterval> | null =
    null;

  constructor(config: Partial<CacheConfig> = {}) {
    this.defaultTtlMs = normalizePositiveInteger(
      config.defaultTtlMs,
      DEFAULT_TTL_MS,
    );

    this.maxEntries = normalizePositiveInteger(
      config.maxEntries,
      DEFAULT_MAX_ENTRIES,
    );

    this.cleanupIntervalMs = normalizePositiveInteger(
      config.cleanupIntervalMs,
      DEFAULT_CLEANUP_INTERVAL_MS,
    );

    this.startCleanupTimer();
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupIntervalMs);

    /*
     * Do not keep the Node.js process alive only because of
     * the cache cleanup timer.
     */
    const timer = this.cleanupTimer as
      | (ReturnType<typeof setInterval> & {
          unref?: () => void;
        })
      | null;

    timer?.unref?.();
  }

  private getTtl(options?: CacheOptions): number {
    if (options?.ttlMs === undefined) {
      return this.defaultTtlMs;
    }

    return normalizePositiveInteger(
      options.ttlMs,
      this.defaultTtlMs,
    );
  }

  private removeLeastRecentlyUsed(): void {
    if (this.store.size < this.maxEntries) {
      return;
    }

    let oldestKey: string | null = null;
    let oldestAccessTime = Number.POSITIVE_INFINITY;

    for (const [key, entry] of this.store.entries()) {
      if (entry.lastAccessedAt < oldestAccessTime) {
        oldestAccessTime = entry.lastAccessedAt;
        oldestKey = key;
      }
    }

    if (oldestKey !== null) {
      this.store.delete(oldestKey);
    }
  }

  set<T>(
    key: string,
    value: T,
    options?: CacheOptions,
  ): boolean {
    const normalizedKey = normalizeKey(key);

    if (!normalizedKey) {
      return false;
    }

    const now = Date.now();
    const ttlMs = this.getTtl(options);

    /*
     * Replace an existing entry without unnecessarily evicting
     * another entry.
     */
    if (!this.store.has(normalizedKey)) {
      this.removeLeastRecentlyUsed();
    }

    this.store.set(normalizedKey, {
      value,
      expiresAt: now + ttlMs,
      lastAccessedAt: now,
    });

    return true;
  }

  get<T>(key: string): T | undefined {
    const normalizedKey = normalizeKey(key);

    if (!normalizedKey) {
      return undefined;
    }

    const entry = this.store.get(normalizedKey);

    if (!entry) {
      return undefined;
    }

    const now = Date.now();

    if (now >= entry.expiresAt) {
      this.store.delete(normalizedKey);
      return undefined;
    }

    /*
     * Refresh access time for LRU eviction.
     */
    entry.lastAccessedAt = now;

    return entry.value as T;
  }

  has(key: string): boolean {
    const normalizedKey = normalizeKey(key);

    if (!normalizedKey) {
      return false;
    }

    const entry = this.store.get(normalizedKey);

    if (!entry) {
      return false;
    }

    if (Date.now() >= entry.expiresAt) {
      this.store.delete(normalizedKey);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    const normalizedKey = normalizeKey(key);

    if (!normalizedKey) {
      return false;
    }

    return this.store.delete(normalizedKey);
  }

  clear(): void {
    this.store.clear();
  }

  cleanup(): number {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.store.entries()) {
      if (now >= entry.expiresAt) {
        this.store.delete(key);
        removed += 1;
      }
    }

    return removed;
  }

  size(): number {
    this.cleanup();
    return this.store.size;
  }

  stats(): CacheStats {
    this.cleanup();

    return {
      size: this.store.size,
      maxEntries: this.maxEntries,
    };
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }

    this.store.clear();
  }
}

/**
 * Shared application cache.
 *
 * Keep this instance at module scope so all callers in the same
 * server process share the same cache.
 */
export const cache = new MemoryCache({
  defaultTtlMs: DEFAULT_TTL_MS,
  maxEntries: DEFAULT_MAX_ENTRIES,
  cleanupIntervalMs: DEFAULT_CLEANUP_INTERVAL_MS,
});

/**
 * Convenience helpers.
 */

export function cacheGet<T>(
  key: string,
): T | undefined {
  return cache.get<T>(key);
}

export function cacheSet<T>(
  key: string,
  value: T,
  options?: CacheOptions,
): boolean {
  return cache.set(key, value, options);
}

export function cacheHas(key: string): boolean {
  return cache.has(key);
}

export function cacheDelete(key: string): boolean {
  return cache.delete(key);
}

export function cacheClear(): void {
  cache.clear();
}

export function cleanupCache(): number {
  return cache.cleanup();
}

export function getCacheStats(): CacheStats {
  return cache.stats();
}

/**
 * @file security/rate-limit.ts
 * @description Production-ready, server-only rate-limiting utility for GrowthAI.
 *
 * ARCHITECTURAL NOTICE:
 * - This implementation uses process-local in-memory storage.
 * - It is NOT a distributed/global limiter across multiple serverless instances.
 * - A future Redis/database adapter can replace the storage layer without
 *   changing the security architecture.
 */

import 'server-only';

export interface RateLimitConfig {
  readonly windowMs: number;
  readonly maxRequests: number;
  readonly prefix?: string;
}

export interface RateLimitResult {
  readonly allowed: boolean;
  readonly limit: number;
  readonly remaining: number;
  readonly resetTimeMs: number;
  readonly retryAfterSeconds: number;
}

interface RateLimitRecord {
  count: number;
  resetTimeMs: number;
}

export interface CheckRateLimitOptions {
  readonly cost?: number;
}

export interface RateLimiter {
  check(
    clientKey: unknown,
    options?: CheckRateLimitOptions
  ): RateLimitResult;
  reset(clientKey: unknown): boolean;
  cleanup(): void;
}

type RateLimitStore = Map<string, RateLimitRecord>;

function normalizeConfig(config: RateLimitConfig): Required<RateLimitConfig> {
  if (!Number.isFinite(config.windowMs) || config.windowMs <= 0) {
    throw new Error('Rate limit windowMs must be a positive number.');
  }

  if (!Number.isFinite(config.maxRequests) || config.maxRequests <= 0) {
    throw new Error('Rate limit maxRequests must be a positive number.');
  }

  return {
    windowMs: Math.max(1, Math.floor(config.windowMs)),
    maxRequests: Math.max(1, Math.floor(config.maxRequests)),
    prefix: typeof config.prefix === 'string' && config.prefix.trim()
      ? `${config.prefix.trim()}:`
      : '',
  };
}

function normalizeClientKey(
  clientKey: unknown,
  prefix: string
): string | null {
  if (typeof clientKey !== 'string') {
    return null;
  }

  const normalized = clientKey.trim();

  if (!normalized || normalized.length > 512) {
    return null;
  }

  return `${prefix}${normalized}`;
}

function normalizeCost(cost: number | undefined): number {
  if (
    cost === undefined ||
    !Number.isInteger(cost) ||
    cost <= 0
  ) {
    return 1;
  }

  return cost;
}

/**
 * Creates an isolated in-memory rate limiter.
 *
 * The returned limiter owns its own persistent store.
 * Creating a limiter once and reusing it is required for request counts
 * to persist across checks.
 */
export function createRateLimiter(
  config: RateLimitConfig
): RateLimiter {
  const normalizedConfig = normalizeConfig(config);
  const store: RateLimitStore = new Map();

  function cleanup(): void {
    const now = Date.now();

    for (const [key, record] of store.entries()) {
      if (now >= record.resetTimeMs) {
        store.delete(key);
      }
    }
  }

  function check(
    clientKey: unknown,
    options?: CheckRateLimitOptions
  ): RateLimitResult {
    const now = Date.now();
    const normalizedKey = normalizeClientKey(
      clientKey,
      normalizedConfig.prefix
    );

    if (!normalizedKey) {
      return {
        allowed: false,
        limit: normalizedConfig.maxRequests,
        remaining: 0,
        resetTimeMs: now + normalizedConfig.windowMs,
        retryAfterSeconds: Math.ceil(
          normalizedConfig.windowMs / 1000
        ),
      };
    }

    const cost = normalizeCost(options?.cost);

    let record = store.get(normalizedKey);

    if (!record || now >= record.resetTimeMs) {
      record = {
        count: 0,
        resetTimeMs: now + normalizedConfig.windowMs,
      };

      store.set(normalizedKey, record);
    }

    if (record.count + cost > normalizedConfig.maxRequests) {
      const retryAfterMs = Math.max(
        0,
        record.resetTimeMs - now
      );

      return {
        allowed: false,
        limit: normalizedConfig.maxRequests,
        remaining: Math.max(
          0,
          normalizedConfig.maxRequests - record.count
        ),
        resetTimeMs: record.resetTimeMs,
        retryAfterSeconds: Math.ceil(
          retryAfterMs / 1000
        ),
      };
    }

    record.count += cost;

    const remaining = Math.max(
      0,
      normalizedConfig.maxRequests - record.count
    );

    return {
      allowed: true,
      limit: normalizedConfig.maxRequests,
      remaining,
      resetTimeMs: record.resetTimeMs,
      retryAfterSeconds: 0,
    };
  }

  function reset(clientKey: unknown): boolean {
    const normalizedKey = normalizeClientKey(
      clientKey,
      normalizedConfig.prefix
    );

    if (!normalizedKey) {
      return false;
    }

    return store.delete(normalizedKey);
  }

  return {
    check,
    reset,
    cleanup,
  };
}

/**
 * Shared default limiter.
 *
 * IMPORTANT:
 * This instance is created once and reused so request counts persist
 * during the lifetime of the current server process.
 */
const defaultLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 100,
  prefix: 'global',
});

export function checkRateLimit(
  clientKey: string,
  options?: CheckRateLimitOptions
): RateLimitResult {
  return defaultLimiter.check(clientKey, options);
}

export function resetRateLimit(
  clientKey: string
): boolean {
  return defaultLimiter.reset(clientKey);
}

export function cleanupRateLimit(): void {
  defaultLimiter.cleanup();
}

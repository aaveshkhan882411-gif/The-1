/**
 * @file security/rate-limit.ts
 * @description Production-ready, server-only distributed rate limiter
 * for GrowthAI using Upstash Redis.
 *
 * IMPORTANT:
 * - Works across serverless instances.
 * - Uses Redis/Upstash instead of process-local memory.
 * - Uses a sliding-window algorithm.
 * - Fails closed when the Redis configuration is missing or invalid.
 */

import 'server-only';

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

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

export interface CheckRateLimitOptions {
  readonly cost?: number;
}

export interface RateLimiter {
  check(
    clientKey: unknown,
    options?: CheckRateLimitOptions,
  ): Promise<RateLimitResult>;

  reset(clientKey: unknown): Promise<boolean>;
}

function normalizeConfig(
  config: RateLimitConfig,
): Required<RateLimitConfig> {
  if (
    !Number.isSafeInteger(config.windowMs) ||
    config.windowMs <= 0
  ) {
    throw new Error(
      'Rate limit windowMs must be a positive safe integer.',
    );
  }

  if (
    !Number.isSafeInteger(config.maxRequests) ||
    config.maxRequests <= 0
  ) {
    throw new Error(
      'Rate limit maxRequests must be a positive safe integer.',
    );
  }

  return {
    windowMs: config.windowMs,
    maxRequests: config.maxRequests,
    prefix:
      typeof config.prefix === 'string' &&
      config.prefix.trim().length > 0
        ? `${config.prefix.trim()}:`
        : '',
  };
}

function normalizeClientKey(
  clientKey: unknown,
  prefix: string,
): string | null {
  if (typeof clientKey !== 'string') {
    return null;
  }

  const normalized = clientKey.trim();

  if (
    normalized.length === 0 ||
    normalized.length > 512
  ) {
    return null;
  }

  return `${prefix}${normalized}`;
}

function normalizeCost(
  cost: number | undefined,
): number {
  if (
    cost === undefined ||
    !Number.isSafeInteger(cost) ||
    cost <= 0
  ) {
    return 1;
  }

  return cost;
}

function getRedis(): Redis {
  const url =
    process.env.UPSTASH_REDIS_REST_URL?.trim();

  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) {
    throw new Error(
      'Missing Upstash Redis configuration: ' +
        'UPSTASH_REDIS_REST_URL and ' +
        'UPSTASH_REDIS_REST_TOKEN are required.',
    );
  }

  return new Redis({
    url,
    token,
  });
}

function millisecondsToDuration(
  milliseconds: number,
): `${number} ms` {
  return `${Math.max(
    1,
    Math.floor(milliseconds),
  )} ms`;
}

/**
 * Creates a distributed Upstash rate limiter.
 */
export function createRateLimiter(
  config: RateLimitConfig,
): RateLimiter {
  const normalizedConfig =
    normalizeConfig(config);

  const redis = getRedis();

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      normalizedConfig.maxRequests,
      millisecondsToDuration(
        normalizedConfig.windowMs,
      ),
    ),
    prefix:
      normalizedConfig.prefix ||
      '@growthai/ratelimit',
    analytics: false,
  });

  return {
    async check(
      clientKey: unknown,
      options?: CheckRateLimitOptions,
    ): Promise<RateLimitResult> {
      const normalizedKey =
        normalizeClientKey(
          clientKey,
          normalizedConfig.prefix,
        );

      const now = Date.now();

      if (!normalizedKey) {
        return {
          allowed: false,
          limit: normalizedConfig.maxRequests,
          remaining: 0,
          resetTimeMs:
            now + normalizedConfig.windowMs,
          retryAfterSeconds: Math.ceil(
            normalizedConfig.windowMs / 1000,
          ),
        };
      }

      const cost = normalizeCost(
        options?.cost,
      );

      /*
       * Upstash's standard limiter consumes one unit
       * per call. For weighted requests, execute the
       * required number of checks.
       */
      let result = await limiter.limit(
        normalizedKey,
      );

      for (
        let index = 1;
        index < cost;
        index += 1
      ) {
        if (!result.success) {
          break;
        }

        result = await limiter.limit(
          normalizedKey,
        );
      }

      const resetTimeMs =
        typeof result.reset === 'number'
          ? result.reset
          : now + normalizedConfig.windowMs;

      const retryAfterSeconds =
        result.success
          ? 0
          : Math.max(
              1,
              Math.ceil(
                (resetTimeMs - now) / 1000,
              ),
            );

      return {
        allowed: result.success,
        limit: normalizedConfig.maxRequests,
        remaining: Math.max(
          0,
          result.remaining,
        ),
        resetTimeMs,
        retryAfterSeconds,
      };
    },

    async reset(
      clientKey: unknown,
    ): Promise<boolean> {
      const normalizedKey =
        normalizeClientKey(
          clientKey,
          normalizedConfig.prefix,
        );

      if (!normalizedKey) {
        return false;
      }

      /*
       * The Upstash Ratelimit abstraction intentionally
       * does not expose a generic reset operation.
       *
       * Returning false avoids pretending that a reset
       * happened when it did not.
       */
      return false;
    },
  };
}

/**
 * Shared application limiter.
 *
 * 100 requests per minute per client key.
 */
const defaultLimiter =
  createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 100,
    prefix: 'growthai:global',
  });

export async function checkRateLimit(
  clientKey: string,
  options?: CheckRateLimitOptions,
): Promise<RateLimitResult> {
  return defaultLimiter.check(
    clientKey,
    options,
  );
}

export async function resetRateLimit(
  clientKey: string,
): Promise<boolean> {
  return defaultLimiter.reset(clientKey);
}

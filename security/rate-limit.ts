import 'server-only';

/**
 * @file security/rate-limit.ts
 * @description In-memory fallback rate limiter (no external dependencies required).
 */

export interface RateLimitConfig {
  requests: number;
  windowMs: number;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = { requests: 60, windowMs: 60 * 1000 }
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });

    return {
      success: true,
      limit: config.requests,
      remaining: config.requests - 1,
      reset: Math.floor((now + config.windowMs) / 1000),
    };
  }

  if (record.count >= config.requests) {
    return {
      success: false,
      limit: config.requests,
      remaining: 0,
      reset: Math.floor(record.resetTime / 1000),
    };
  }

  record.count += 1;

  return {
    success: true,
    limit: config.requests,
    remaining: config.requests - record.count,
    reset: Math.floor(record.resetTime / 1000),
  };
}

export default rateLimit;

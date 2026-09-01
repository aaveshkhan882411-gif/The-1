import 'server-only';

/**
 * @file security/rate-limit.ts
 * @description In-memory fallback rate limiter with full property compatibility.
 */

export interface RateLimitConfig {
  requests?: number;
  windowMs?: number;
  limit?: number;
  window?: number;
}

export interface RateLimitResult {
  success: boolean;
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export async function rateLimit(
  identifier: string,
  config?: RateLimitConfig
): Promise<RateLimitResult> {
  const maxRequests = config?.requests ?? config?.limit ?? 60;
  const windowTime = config?.windowMs ?? config?.window ?? 60 * 1000;

  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowTime,
    });

    return {
      success: true,
      allowed: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: Math.floor((now + windowTime) / 1000),
    };
  }

  if (record.count >= maxRequests) {
    return {
      success: false,
      allowed: false,
      limit: maxRequests,
      remaining: 0,
      reset: Math.floor(record.resetTime / 1000),
    };
  }

  record.count += 1;

  return {
    success: true,
    allowed: true,
    limit: maxRequests,
    remaining: maxRequests - record.count,
    reset: Math.floor(record.resetTime / 1000),
  };
}

export const checkRateLimit = rateLimit;
export default rateLimit;

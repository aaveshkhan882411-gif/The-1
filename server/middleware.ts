import 'server-only';

import {
  createSecurityHeaders,
  applySecurityHeaders,
} from '../security/headers';
import { isStateChangingMethod } from '../security/csrf';
import { checkRateLimit } from '../security/rate-limit';
import { getRequestId } from './request';

/**
 * @file server/middleware.ts
 * @description Shared server-side request protection utilities for GrowthAI.
 *
 * NOTE:
 * This module provides reusable protection helpers.
 * The actual Next.js middleware entry point remains in the project root
 * if/when request interception is required.
 */

export interface ServerMiddlewareOptions {
  readonly rateLimitKey?: string;
  readonly rateLimitConfig?: {
    readonly windowMs: number;
    readonly maxRequests: number;
    readonly prefix?: string;
  };
  readonly securityHeadersProduction?: boolean;
}

export interface MiddlewareCheckResult {
  readonly allowed: boolean;
  readonly response: Response | null;
  readonly requestId: string | null;
}

/**
 * Applies centralized security headers to a response.
 */
export function withSecurityHeaders(
  response: Response,
  isProduction = process.env.NODE_ENV === 'production'
): Response {
  return applySecurityHeaders(response, {
    isProduction,
  });
}

/**
 * Creates a basic protected response for requests rejected
 * by server-side middleware checks.
 */
export function createMiddlewareRejection(
  status: number,
  message: string,
  requestId: string | null
): Response {
  const response = Response.json(
    {
      success: false,
      error: message,
      ...(requestId ? { requestId } : {}),
    },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );

  return withSecurityHeaders(response);
}

/**
 * Runs reusable server-side request protection checks.
 *
 * Rate limiting is only applied when a rate-limit key is supplied.
 * CSRF token validation itself is performed at the state-changing
 * request boundary where the server and client tokens are available.
 */
export function checkServerRequest(
  request: Request,
  options: ServerMiddlewareOptions = {}
): MiddlewareCheckResult {
  if (!(request instanceof Request)) {
    return {
      allowed: false,
      response: createMiddlewareRejection(
        400,
        'Invalid request.',
        null
      ),
      requestId: null,
    };
  }

  const requestId = getRequestId(request);

  if (isStateChangingMethod(request.method)) {
    const rateLimitKey = options.rateLimitKey?.trim();

    if (rateLimitKey) {
      const result = checkRateLimit(
        rateLimitKey,
        options.rateLimitConfig
      );

      if (!result.allowed) {
        const response = createMiddlewareRejection(
          429,
          'Too many requests. Please try again later.',
          requestId
        );

        response.headers.set(
          'Retry-After',
          String(result.retryAfterSeconds)
        );

        return {
          allowed: false,
          response,
          requestId,
        };
      }
    }
  }

  return {
    allowed: true,
    response: null,
    requestId,
  };
}

/**
 * Applies the project's centralized security policy to an existing response.
 */
export function finalizeServerResponse(
  response: Response,
  options?: Pick<ServerMiddlewareOptions, 'securityHeadersProduction'>
): Response {
  const securityHeaders = createSecurityHeaders({
    isProduction:
      options?.securityHeadersProduction ??
      process.env.NODE_ENV === 'production',
  });

  securityHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
}

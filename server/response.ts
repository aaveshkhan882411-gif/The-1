import 'server-only';

/**
 * @file server/response.ts
 * @description Standardized server-side HTTP response utilities for GrowthAI.
 *
 * Keeps API responses consistent across Route Handlers, Server Actions,
 * and internal server boundaries.
 */

export interface ApiSuccessResponse<T> {
  readonly success: true;
  readonly data: T;
  readonly requestId?: string;
}

export interface ApiErrorResponse {
  readonly success: false;
  readonly error: string;
  readonly code: string;
  readonly requestId?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Creates a successful JSON API response.
 */
export function successResponse<T>(
  data: T,
  status = 200,
  requestId?: string
): Response {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(requestId ? { requestId } : {}),
  };

  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

/**
 * Creates a standardized JSON error response.
 */
export function errorResponse(
  error: string,
  code = 'INTERNAL_SERVER_ERROR',
  status = 500,
  requestId?: string
): Response {
  const safeError =
    typeof error === 'string' && error.trim()
      ? error.trim()
      : 'An unexpected server error occurred.';

  const safeCode =
    typeof code === 'string' && code.trim()
      ? code.trim().toUpperCase()
      : 'INTERNAL_SERVER_ERROR';

  const body: ApiErrorResponse = {
    success: false,
    error: safeError,
    code: safeCode,
    ...(requestId ? { requestId } : {}),
  };

  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

/**
 * Creates a 400 Bad Request response.
 */
export function badRequestResponse(
  message = 'Invalid request.',
  requestId?: string
): Response {
  return errorResponse(message, 'BAD_REQUEST', 400, requestId);
}

/**
 * Creates a 401 Unauthorized response.
 */
export function unauthorizedResponse(
  message = 'Authentication required.',
  requestId?: string
): Response {
  return errorResponse(message, 'UNAUTHORIZED', 401, requestId);
}

/**
 * Creates a 403 Forbidden response.
 */
export function forbiddenResponse(
  message = 'Access denied.',
  requestId?: string
): Response {
  return errorResponse(message, 'FORBIDDEN', 403, requestId);
}

/**
 * Creates a 404 Not Found response.
 */
export function notFoundResponse(
  message = 'Resource not found.',
  requestId?: string
): Response {
  return errorResponse(message, 'NOT_FOUND', 404, requestId);
}

/**
 * Creates a 429 Too Many Requests response.
 */
export function rateLimitResponse(
  retryAfterSeconds = 60,
  requestId?: string
): Response {
  const retryAfter = Math.max(0, Math.floor(retryAfterSeconds));

  const response = errorResponse(
    'Too many requests. Please try again later.',
    'RATE_LIMIT_EXCEEDED',
    429,
    requestId
  );

  response.headers.set('Retry-After', String(retryAfter));

  return response;
}

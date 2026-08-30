import 'server-only';

/**
 * @file lib/api.ts
 * @description Shared API request and response utilities for GrowthAI.
 */

export interface ApiSuccess<T> {
  readonly success: true;
  readonly data: T;
}

export interface ApiFailure {
  readonly success: false;
  readonly error: string;
  readonly code?: string;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

/**
 * Creates a successful API result.
 */
export function apiSuccess<T>(data: T): ApiSuccess<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Creates a failed API result.
 */
export function apiError(
  error: string,
  code?: string
): ApiFailure {
  return {
    success: false,
    error,
    ...(code ? { code } : {}),
  };
}

/**
 * Safely extracts a JSON request body.
 */
export async function parseJsonBody<T = unknown>(
  request: Request
): Promise<T | null> {
  try {
    const contentType =
      request.headers.get('content-type') ?? '';

    if (!contentType.toLowerCase().includes('application/json')) {
      return null;
    }

    return (await request.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Returns a safe JSON Response.
 */
export function jsonResponse<T>(
  result: ApiResult<T>,
  status = 200
): Response {
  return new Response(
    JSON.stringify(result),
    {
      status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    }
  );
}

/**
 * Returns a standardized unauthorized response.
 */
export function unauthorizedResponse(
  message = 'Authentication required.'
): Response {
  return jsonResponse(
    apiError(message, 'UNAUTHORIZED'),
    401
  );
}

/**
 * Returns a standardized forbidden response.
 */
export function forbiddenResponse(
  message = 'Access denied.'
): Response {
  return jsonResponse(
    apiError(message, 'FORBIDDEN'),
    403
  );
}

/**
 * Returns a standardized not-found response.
 */
export function notFoundResponse(
  message = 'Resource not found.'
): Response {
  return jsonResponse(
    apiError(message, 'NOT_FOUND'),
    404
  );
}

/**
 * Returns a standardized server-error response.
 */
export function serverErrorResponse(
  message = 'Internal server error.'
): Response {
  return jsonResponse(
    apiError(message, 'INTERNAL_SERVER_ERROR'),
    500
  );
}

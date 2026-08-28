import 'server-only';

/**
 * @file server/errors.ts
 * @description Centralized server-side error types and safe error utilities
 * for the GrowthAI SaaS platform.
 *
 * SECURITY:
 * - Never expose stack traces, secrets, database details, or internal
 *   implementation details to clients.
 */

export type ServerErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_SERVER_ERROR';

export interface ServerErrorOptions {
  readonly status?: number;
  readonly code?: ServerErrorCode;
  readonly cause?: unknown;
}

/**
 * Standard application error for server-side boundaries.
 */
export class ServerError extends Error {
  readonly code: ServerErrorCode;
  readonly status: number;

  constructor(
    message: string,
    options: ServerErrorOptions = {}
  ) {
    super(message);

    this.name = 'ServerError';
    this.code = options.code ?? 'INTERNAL_SERVER_ERROR';
    this.status = options.status ?? 500;

    if (options.cause !== undefined) {
      this.cause = options.cause;
    }

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Converts unknown thrown values into a controlled ServerError.
 */
export function normalizeServerError(
  error: unknown
): ServerError {
  if (error instanceof ServerError) {
    return error;
  }

  if (error instanceof Error) {
    return new ServerError(
      error.message || 'An unexpected server error occurred.',
      {
        code: 'INTERNAL_SERVER_ERROR',
        status: 500,
        cause: error,
      }
    );
  }

  return new ServerError(
    'An unexpected server error occurred.',
    {
      code: 'INTERNAL_SERVER_ERROR',
      status: 500,
      cause: error,
    }
  );
}

/**
 * Returns a client-safe error message.
 *
 * Internal error details are intentionally hidden for unknown errors.
 */
export function getSafeErrorMessage(
  error: unknown
): string {
  if (error instanceof ServerError) {
    return error.message;
  }

  return 'An unexpected server error occurred.';
}

/**
 * Determines whether an error represents an expected
 * application-level failure.
 */
export function isExpectedServerError(
  error: unknown
): error is ServerError {
  return error instanceof ServerError;
}

/**
 * Creates a validation error.
 */
export function createValidationError(
  message = 'Invalid request data.'
): ServerError {
  return new ServerError(message, {
    code: 'VALIDATION_ERROR',
    status: 400,
  });
}

/**
 * Creates an authentication error.
 */
export function createUnauthorizedError(
  message = 'Authentication required.'
): ServerError {
  return new ServerError(message, {
    code: 'UNAUTHORIZED',
    status: 401,
  });
}

/**
 * Creates an authorization error.
 */
export function createForbiddenError(
  message = 'Access denied.'
): ServerError {
  return new ServerError(message, {
    code: 'FORBIDDEN',
    status: 403,
  });
}

/**
 * Creates a not-found error.
 */
export function createNotFoundError(
  message = 'Resource not found.'
): ServerError {
  return new ServerError(message, {
    code: 'NOT_FOUND',
    status: 404,
  });
}

/**
 * Creates a rate-limit error.
 */
export function createRateLimitError(
  message = 'Too many requests. Please try again later.'
): ServerError {
  return new ServerError(message, {
    code: 'RATE_LIMITED',
    status: 429,
  });
}

import 'server-only';

/**
 * @file lib/errors.ts
 * @description Centralized, server-only error utilities for GrowthAI.
 *
 * SECURITY:
 * - Prevents accidental exposure of internal implementation details.
 * - Provides stable application error codes.
 * - Keeps sensitive server errors out of client-facing responses.
 */

export type AppErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE';

export interface AppErrorOptions {
  readonly code: AppErrorCode;
  readonly message: string;
  readonly status?: number;
  readonly cause?: unknown;
}

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status: number;

  constructor(options: AppErrorOptions) {
    super(options.message);

    this.name = 'AppError';
    this.code = options.code;
    this.status = options.status ?? statusForCode(options.code);

    if (options.cause !== undefined) {
      this.cause = options.cause;
    }

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function statusForCode(
  code: AppErrorCode
): number {
  switch (code) {
    case 'BAD_REQUEST':
    case 'VALIDATION_ERROR':
      return 400;

    case 'UNAUTHORIZED':
      return 401;

    case 'FORBIDDEN':
      return 403;

    case 'NOT_FOUND':
      return 404;

    case 'CONFLICT':
      return 409;

    case 'RATE_LIMITED':
      return 429;

    case 'SERVICE_UNAVAILABLE':
      return 503;

    case 'INTERNAL_ERROR':
    default:
      return 500;
  }
}

/**
 * Converts unknown thrown values into a safe AppError.
 */
export function toAppError(
 error: unknown,
  fallbackMessage = 'An unexpected server error occurred.'
): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError({
      code: 'INTERNAL_ERROR',
      message: fallbackMessage,
      cause: error,
    });
  }

  return new AppError({
    code: 'INTERNAL_ERROR',
    message: fallbackMessage,
    cause: error,
  });
}

/**
 * Returns a safe client-facing error payload.
 *
 * Internal causes and stack traces are intentionally excluded.
 */
export function toPublicError(
  error: unknown
): {
  readonly code: AppErrorCode;
  readonly message: string;
} {
  const appError = toAppError(error);

  return {
    code: appError.code,
    message: appError.message,
  };
}

/**
 * Determines whether an unknown value represents an AppError.
 */
export function isAppError(
  error: unknown
): error is AppError {
  return error instanceof AppError;
}

/**
 * Creates a validation error.
 */
export function validationError(
  message: string
): AppError {
  return new AppError({
    code: 'VALIDATION_ERROR',
    message,
  });
}

/**
 * Creates an unauthorized error.
 */
export function unauthorizedError(
  message = 'Authentication is required.'
): AppError {
  return new AppError({
    code: 'UNAUTHORIZED',
    message,
  });
}

/**
 * Creates a forbidden error.
 */
export function forbiddenError(
  message = 'Access denied.'
): AppError {
  return new AppError({
    code: 'FORBIDDEN',
    message,
  });
}

/**
 * Creates a not-found error.
 */
export function notFoundError(
  message = 'Requested resource was not found.'
): AppError {
  return new AppError({
    code: 'NOT_FOUND',
    message,
  });
}

/**
 * Creates a rate-limit error.
 */
export function rateLimitedError(
  message = 'Too many requests. Please try again later.'
): AppError {
  return new AppError({
    code: 'RATE_LIMITED',
    message,
  });
}

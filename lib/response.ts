import 'server-only';

/**
 * @file lib/response.ts
 * @description Standardized server-side response helpers for GrowthAI.
 *
 * SECURITY:
 * - Provides consistent API response structures.
 * - Prevents accidental exposure of internal server errors.
 * - Keeps response handling independent of external services.
 */

export interface SuccessResponse<T> {
  readonly success: true;
  readonly data: T;
}

export interface ErrorResponse {
  readonly success: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
  };
}

export type ApiResponse<T> =
  | SuccessResponse<T>
  | ErrorResponse;

/**
 * Creates a successful application response.
 */
export function successResponse<T>(
  data: T
): SuccessResponse<T> {
  return Object.freeze({
    success: true,
    data,
  });
}

/**
 * Creates a safe application error response.
 */
export function errorResponse(
  code: string,
  message: string
): ErrorResponse {
  const safeCode = code.trim();
  const safeMessage = message.trim();

  return Object.freeze({
    success: false,
    error: {
      code: safeCode || 'INTERNAL_ERROR',
      message:
        safeMessage ||
        'An unexpected server error occurred.',
    },
  });
}

/**
 * Converts an unknown thrown value into a safe API error response.
 */
export function responseFromError(
  error: unknown,
  fallbackCode = 'INTERNAL_ERROR',
  fallbackMessage = 'An unexpected server error occurred.'
): ErrorResponse {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    'message' in error
  ) {
    const record = error as Record<string, unknown>;

    const code =
      typeof record.code === 'string'
        ? record.code
        : fallbackCode;

    const message =
      typeof record.message === 'string'
        ? record.message
        : fallbackMessage;

    return errorResponse(code, message);
  }

  return errorResponse(
    fallbackCode,
    fallbackMessage
  );
}

/**
 * Executes a server operation and converts its result
 * into a standardized response.
 */
export async function withResponse<T>(
  operation: () => Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const data = await operation();

    return successResponse(data);
  } catch (error: unknown) {
    return responseFromError(error);
  }
}

/**
 * Type guard for successful responses.
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is SuccessResponse<T> {
  return response.success === true;
}

/**
 * Type guard for error responses.
 */
export function isErrorResponse<T>(
  response: ApiResponse<T>
): response is ErrorResponse {
  return response.success === false;
}

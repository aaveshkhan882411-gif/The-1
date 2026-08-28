import 'server-only';

import {
  validateRequiredString,
  validateOptionalString,
  validateEmail,
  validateUuid,
  validateUrl,
  validatePositiveInteger,
  validateArray,
  type ValidationResult,
} from '../security/input-validation';

/**
 * @file server/validation.ts
 * @description Server-boundary validation helpers for GrowthAI.
 *
 * All untrusted request data must be validated before entering
 * server services, database repositories, billing, or agent workflows.
 */

export {
  validateRequiredString,
  validateOptionalString,
  validateEmail,
  validateUuid,
  validateUrl,
  validatePositiveInteger,
  validateArray,
};

export type {
  ValidationResult,
};

/**
 * Validates an unknown request body as a plain object.
 */
export function validateRequestObject(
  input: unknown
): ValidationResult<Record<string, unknown>> {
  if (
    input === null ||
    typeof input !== 'object' ||
    Array.isArray(input)
  ) {
    return {
      valid: false,
      error: 'Invalid request: expected an object.',
    };
  }

  return {
    valid: true,
    value: input as Record<string, unknown>,
  };
}

/**
 * Requires a non-empty field from a validated request object.
 */
export function requireRequestField(
  input: Record<string, unknown>,
  field: string
): ValidationResult<string> {
  if (!field.trim()) {
    return {
      valid: false,
      error: 'Invalid validation field name.',
    };
  }

  return validateRequiredString(input[field]);
}

/**
 * Validates that a request contains only the supplied fields.
 *
 * Useful for strict server boundaries where unexpected fields
 * should be rejected instead of silently trusted.
 */
export function rejectUnknownFields(
  input: Record<string, unknown>,
  allowedFields: readonly string[]
): ValidationResult<Record<string, unknown>> {
  const allowed = new Set(allowedFields);

  for (const key of Object.keys(input)) {
    if (!allowed.has(key)) {
      return {
        valid: false,
        error: `Invalid request: unexpected field '${key}'.`,
      };
    }
  }

  return {
    valid: true,
    value: input,
  };
}

/**
 * Validates that a request contains all required fields.
 */
export function requireFields(
  input: Record<string, unknown>,
  requiredFields: readonly string[]
): ValidationResult<Record<string, unknown>> {
  for (const field of requiredFields) {
    if (!field.trim()) {
      return {
        valid: false,
        error: 'Invalid required field definition.',
      };
    }

    const result = validateRequiredString(input[field]);

    if (!result.valid) {
      return {
        valid: false,
        error: `Invalid request field '${field}'.`,
      };
    }
  }

  return {
    valid: true,
    value: input,
  };
}

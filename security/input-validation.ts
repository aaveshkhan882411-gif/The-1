/**
 * @file security/input-validation.ts
 * @description Centralized, server-only input validation and safe normalization
 * utility for the GrowthAI SaaS platform.
 */

import 'server-only';

export type ValidationResult<T> =
  | {
      readonly valid: true;
      readonly value: T;
    }
  | {
      readonly valid: false;
      readonly error: string;
    };

export interface StringOptions {
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly allowEmpty?: boolean;
}

export interface NumberOptions {
  readonly min?: number;
  readonly max?: number;
}

export interface ArrayOptions<T> {
  readonly maxItems?: number;
  readonly validateItem: (
    item: unknown
  ) => ValidationResult<T>;
}

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Safely trims and validates a string.
 */
export function validateAndTrimString(
  input: unknown,
  options: StringOptions = {}
): ValidationResult<string> {
  if (typeof input !== 'string') {
    return {
      valid: false,
      error: 'Invalid input: expected string.',
    };
  }

  const trimmed = input.trim();
  const allowEmpty = options.allowEmpty ?? false;

  if (!allowEmpty && trimmed.length === 0) {
    return {
      valid: false,
      error: 'Invalid input: string cannot be empty.',
    };
  }

  if (
    options.minLength !== undefined &&
    trimmed.length < options.minLength
  ) {
    return {
      valid: false,
      error: 'Invalid input: string is too short.',
    };
  }

  if (
    options.maxLength !== undefined &&
    trimmed.length > options.maxLength
  ) {
    return {
      valid: false,
      error: 'Invalid input: string is too long.',
    };
  }

  return {
    valid: true,
    value: trimmed,
  };
}

/**
 * Validates a required string.
 */
export function validateRequiredString(
  input: unknown,
  options: Omit<StringOptions, 'allowEmpty'> = {}
): ValidationResult<string> {
  return validateAndTrimString(input, {
    ...options,
    allowEmpty: false,
  });
}

/**
 * Validates an optional string.
 */
export function validateOptionalString(
  input: unknown,
  options: StringOptions = {}
): ValidationResult<string | undefined> {
  if (input === null || input === undefined) {
    return {
      valid: true,
      value: undefined,
    };
  }

  return validateAndTrimString(input, options);
}

/**
 * Validates and normalizes an email address.
 */
export function validateEmail(
  input: unknown
): ValidationResult<string> {
  const result = validateAndTrimString(input, {
    maxLength: 254,
  });

  if (!result.valid) {
    return result;
  }

  const email = result.value.toLowerCase();

  if (!EMAIL_REGEX.test(email)) {
    return {
      valid: false,
      error: 'Invalid input: malformed email address.',
    };
  }

  return {
    valid: true,
    value: email,
  };
}

/**
 * Validates a standard UUID.
 */
export function validateUuid(
  input: unknown
): ValidationResult<string> {
  const result = validateAndTrimString(input, {
    minLength: 36,
    maxLength: 36,
  });

  if (!result.valid || !UUID_REGEX.test(result.value)) {
    return {
      valid: false,
      error: 'Invalid input: malformed UUID.',
    };
  }

  return {
    valid: true,
    value: result.value.toLowerCase(),
  };
}

/**
 * Validates an HTTP/HTTPS URL.
 */
export function validateUrl(
  input: unknown,
  allowedProtocols: readonly string[] = [
    'http:',
    'https:',
  ]
): ValidationResult<string> {
  const result = validateAndTrimString(input, {
    maxLength: 2048,
  });

  if (!result.valid) {
    return result;
  }

  try {
    const parsed = new URL(result.value);

    if (
      !allowedProtocols.includes(
        parsed.protocol.toLowerCase()
      )
    ) {
      return {
        valid: false,
        error: 'Invalid input: unsupported URL protocol.',
      };
    }

    return {
      valid: true,
      value: parsed.toString(),
    };
  } catch {
    return {
      valid: false,
      error: 'Invalid input: malformed URL.',
    };
  }
}

/**
 * Validates a positive integer.
 */
export function validatePositiveInteger(
  input: unknown,
  options: NumberOptions = {}
): ValidationResult<number> {
  if (
    typeof input !== 'number' ||
    !Number.isSafeInteger(input)
  ) {
    return {
      valid: false,
      error: 'Invalid input: expected a safe integer.',
    };
  }

  const min = Math.max(1, options.min ?? 1);

  if (input < min) {
    return {
      valid: false,
      error: 'Invalid input: integer is below the minimum value.',
    };
  }

  if (
    options.max !== undefined &&
    input > options.max
  ) {
    return {
      valid: false,
      error: 'Invalid input: integer exceeds the maximum value.',
    };
  }

  return {
    valid: true,
    value: input,
  };
}

/**
 * Validates an array and every item inside it.
 */
export function validateArray<T>(
  input: unknown,
  options: ArrayOptions<T>
): ValidationResult<readonly T[]> {
  if (!Array.isArray(input)) {
    return {
      valid: false,
      error: 'Invalid input: expected an array.',
    };
  }

  if (
    options.maxItems !== undefined &&
    input.length > options.maxItems
  ) {
    return {
      valid: false,
      error: 'Invalid input: array exceeds maximum item count.',
    };
  }

  const validatedItems: T[] = [];

  for (let index = 0; index < input.length; index += 1) {
    const result = options.validateItem(
      input[index]
    );

    if (!result.valid) {
      return {
        valid: false,
        error: `Invalid input at index ${index}.`,
      };
    }

    validatedItems.push(result.value);
  }

  return {
    valid: true,
    value: validatedItems,
  };
}

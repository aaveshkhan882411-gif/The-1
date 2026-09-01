import 'server-only';

/**
 * @file lib/logger.ts
 * @description Centralized, structured, server-only logging utility for GrowthAI.
 *
 * SECURITY:
 * - Never logs secrets, tokens, passwords, cookies, authorization headers,
 *   payment credentials, or raw sensitive request bodies.
 * - Supports structured metadata for production observability.
 * - Uses console as the runtime-independent logging backend.
 */

export type LogLevel =
  | 'debug'
  | 'info'
  | 'warn'
  | 'error';

export interface LogMetadata {
  readonly [key: string]: unknown;
}

export interface LogEntry {
  readonly level: LogLevel;
  readonly message: string;
  readonly timestamp: string;
  readonly service: 'growthai';
  readonly environment: string;
  readonly metadata?: Record<string, unknown>;
}

const SENSITIVE_KEYS = new Set([
  'password',
  'passwd',
  'secret',
  'token',
  'access_token',
  'refresh_token',
  'api_key',
  'apikey',
  'authorization',
  'cookie',
  'set-cookie',
  'credit_card',
  'card_number',
  'cvv',
  'cvc',
  'private_key',
]);

function sanitizeValue(
  value: unknown,
  depth = 0
): unknown {
  if (depth > 5) {
    return '[MAX_DEPTH]';
  }

  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: process.env.NODE_ENV === 'production'
        ? undefined
        : value.stack,
    };
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      sanitizeValue(item, depth + 1)
    );
  }

  if (typeof value === 'object') {
    const source = value as Record<string, unknown>;
    const sanitized: Record<string, unknown> = {};

    for (const [key, item] of Object.entries(source)) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
        continue;
      }

      sanitized[key] = sanitizeValue(
        item,
        depth + 1
      );
    }

    return sanitized;
  }

  return String(value);
}

function normalizeMetadata(
  metadata?: LogMetadata
): Record<string, unknown> | undefined {
  if (!metadata) {
    return undefined;
  }

  return sanitizeValue(metadata) as Record<string, unknown>;
}

function createEntry(
  level: LogLevel,
  message: string,
  metadata?: LogMetadata
): LogEntry {
  const normalizedMessage = message.trim();

  return {
    level,
    message: normalizedMessage || 'Empty log message.',
    timestamp: new Date().toISOString(),
    service: 'growthai',
    environment: process.env.NODE_ENV ?? 'development',
    metadata: normalizeMetadata(metadata),
  };
}

function writeLog(
  entry: LogEntry
): void {
  const serialized = JSON.stringify(entry);

  switch (entry.level) {
    case 'debug':
      console.debug(serialized);
      break;

    case 'info':
      console.info(serialized);
      break;

    case 'warn':
      console.warn(serialized);
      break;

    case 'error':
      console.error(serialized);
      break;
  }
}

export function debug(
  message: string,
  metadata?: LogMetadata
): void {
  if (process.env.NODE_ENV !== 'production') {
    writeLog(createEntry('debug', message, metadata));
  }
}

export function info(
  message: string,
  metadata?: LogMetadata
): void {
  writeLog(createEntry('info', message, metadata));
}

export function warn(
  message: string,
  metadata?: LogMetadata
): void {
  writeLog(createEntry('warn', message, metadata));
}

export function error(
  message: string,
  metadata?: LogMetadata
): void {
  writeLog(createEntry('error', message, metadata));
}

/**
 * Logs an Error safely without exposing sensitive properties.
 */
export function logError(
  message: string,
  exception: unknown,
  metadata?: LogMetadata
): void {
  const errorDetails = exception instanceof Error
    ? {
        name: exception.name,
        message: exception.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : exception.stack,
      }
    : { error: String(exception) };

  const combinedMetadata = {
    ...metadata,
    ...errorDetails,
  };

  writeLog(createEntry('error', message, combinedMetadata));
}

export const logger = {
  debug,
  info,
  warn,
  error,
  logError,
};

export default logger;

import 'server-only';

/**
 * @file server/logger.ts
 * @description Centralized, server-only structured logging utility for GrowthAI.
 *
 * SECURITY:
 * - Never log passwords, tokens, API keys, cookies, authorization headers,
 *   or other sensitive credentials.
 * - Structured metadata should contain only non-sensitive operational data.
 */

export type LogLevel =
  | 'debug'
  | 'info'
  | 'warn'
  | 'error';

export interface LogContext {
  readonly requestId?: string;
  readonly userId?: string;
  readonly tenantId?: string;
  readonly operation?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface LogEntry {
  readonly level: LogLevel;
  readonly message: string;
  readonly timestamp: string;
  readonly context?: LogContext;
}

/**
 * Removes common sensitive fields from arbitrary metadata before logging.
 */
function sanitizeMetadata(
  metadata: Readonly<Record<string, unknown>> | undefined
): Readonly<Record<string, unknown>> | undefined {
  if (!metadata) {
    return undefined;
  }

  const sensitiveKeys = new Set([
    'password',
    'token',
    'access_token',
    'refresh_token',
    'api_key',
    'apikey',
    'secret',
    'authorization',
    'cookie',
    'set-cookie',
    'csrf',
  ]);

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (sensitiveKeys.has(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
      continue;
    }

    sanitized[key] = value;
  }

  return Object.freeze(sanitized);
}

/**
 * Creates a structured log entry without writing it anywhere.
 */
export function createLogEntry(
  level: LogLevel,
  message: string,
  context?: LogContext
): LogEntry {
  if (!message || typeof message !== 'string') {
    throw new Error('Log message is required.');
  }

  const safeContext: LogContext | undefined = context
    ? Object.freeze({
        ...context,
        metadata: sanitizeMetadata(context.metadata),
      })
    : undefined;

  return Object.freeze({
    level,
    message: message.trim(),
    timestamp: new Date().toISOString(),
    ...(safeContext ? { context: safeContext } : {}),
  });
}

/**
 * Writes a structured log entry to the server runtime.
 */
export function writeLog(
  level: LogLevel,
  message: string,
  context?: LogContext
): void {
  const entry = createLogEntry(level, message, context);
  const serialized = JSON.stringify(entry);

  switch (level) {
    case 'error':
      console.error(serialized);
      break;

    case 'warn':
      console.warn(serialized);
      break;

    case 'debug':
      if (process.env.NODE_ENV !== 'production') {
        console.debug(serialized);
      }
      break;

    case 'info':
    default:
      console.info(serialized);
      break;
  }
}

/**
 * Convenience logger methods.
 */
export const logger = Object.freeze({
  debug(
    message: string,
    context?: LogContext
  ): void {
    writeLog('debug', message, context);
  },

  info(
    message: string,
    context?: LogContext
  ): void {
    writeLog('info', message, context);
  },

  warn(
    message: string,
    context?: LogContext
  ): void {
    writeLog('warn', message, context);
  },

  error(
    message: string,
    context?: LogContext
  ): void {
    writeLog('error', message, context);
  },
});

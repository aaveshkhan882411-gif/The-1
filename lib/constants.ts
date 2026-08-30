import 'server-only';

/**
 * @file lib/constants.ts
 * @description Centralized application constants for GrowthAI.
 *
 * Keep shared, non-secret values here.
 * Never place API keys, passwords, tokens, or other secrets in this file.
 */

/**
 * Application identity.
 */
export const APP = Object.freeze({
  name: 'GrowthAI',
  version: '1.0.0',
  environment:
    process.env.NODE_ENV ?? 'development',
} as const);

/**
 * Supported application environments.
 */
export const ENVIRONMENTS = Object.freeze({
  development: 'development',
  test: 'test',
  production: 'production',
} as const);

/**
 * Standard pagination limits.
 */
export const PAGINATION = Object.freeze({
  defaultPage: 1,
  defaultPageSize: 20,
  minPageSize: 1,
  maxPageSize: 100,
} as const);

/**
 * Common request limits.
 */
export const REQUEST_LIMITS = Object.freeze({
  maxBodyBytes: 1_048_576,
  maxStringLength: 10_000,
  maxArrayItems: 100,
} as const);

/**
 * Common time intervals in milliseconds.
 */
export const TIME = Object.freeze({
  second: 1_000,
  minute: 60_000,
  hour: 3_600_000,
  day: 86_400_000,
} as const);

/**
 * Standard HTTP methods used by GrowthAI APIs.
 */
export const HTTP_METHODS = Object.freeze({
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const);

/**
 * Application-wide API prefixes.
 */
export const API = Object.freeze({
  prefix: '/api',
  version: 'v1',
} as const);

/**
 * Publicly safe feature flags.
 *
 * These flags do not contain secrets and may be safely consumed
 * by server-side application logic.
 */
export const FEATURES = Object.freeze({
  multilingualSupport: true,
  leadCapture: true,
  automatedFollowUps: true,
  appointmentBooking: true,
  analytics: true,
  sentimentAnalysis: true,
  crmIntegration: true,
  agentWorkflows: true,
} as const);

/**
 * Prevent accidental mutation of exported configuration objects.
 */
export type AppEnvironment =
  (typeof ENVIRONMENTS)[keyof typeof ENVIRONMENTS];

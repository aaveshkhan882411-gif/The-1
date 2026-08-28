/**
 * @file config/security.ts
 * @description Production-hardened security configuration module for GrowthAI SaaS.
 * NOTE: This configuration establishes strict security baselines, headers, and policies.
 */

// --- Type Definitions ---

export interface PasswordPolicyConfig {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  maxAgeDays: number | null;
  prevPasswordsBlockCount: number;
}

export interface AuthProtectionConfig {
  maxLoginAttempts: number;
  lockoutDurationSeconds: number;
  enableMfa: boolean;
  sessionTimeoutSeconds: number;
  cookieName: string;
  cookieSecure: boolean;
  cookieSameSite: 'Strict' | 'Lax';
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  loginWindowMs: number;
  loginMaxRequests: number;
  apiWindowMs: number;
  apiMaxRequests: number;
}

export interface CorsConfig {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  allowCredentials: boolean;
  maxAgeSeconds: number;
}

export interface SecurityHeadersConfig {
  contentSecurityPolicy: string;
  strictTransportSecurity: string;
  xFrameOptions: 'DENY' | 'SAMEORIGIN';
  xContentTypeOptions: 'nosniff';
  referrerPolicy: string;
  permissionsPolicy: string;
}

export type NodeEnvType = 'development' | 'staging' | 'production' | 'test';

export interface SecurityConfig {
  env: NodeEnvType;
  isProduction: boolean;
  passwordPolicy: PasswordPolicyConfig;
  authProtection: AuthProtectionConfig;
  rateLimit: RateLimitConfig;
  cors: CorsConfig;
  csrf: {
    cookieName: string;
    headerName: string;
  };
  headers: SecurityHeadersConfig;
}

// --- Helper Functions ---

function getEnv(key: string, fallback: string): string {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return fallback;
}

function getEnvBool(key: string, fallback: boolean): boolean {
  const value = getEnv(key, String(fallback));
  return value.toLowerCase() === 'true' || value === '1';
}

function getEnvNum(
  key: string,
  fallback: number,
  min?: number,
  max?: number
): number {
  const value = getEnv(key, String(fallback));
  const parsed = parseInt(value, 10);

  if (isNaN(parsed)) {
    return fallback;
  }

  let constrained = parsed;
  if (min !== undefined && constrained < min) {
    constrained = min;
  }
  if (max !== undefined && constrained > max) {
    constrained = max;
  }

  return constrained;
}

function getEnvArray(key: string, fallback: string[]): string[] {
  const value = getEnv(key, '');
  if (!value) {
    return fallback;
  }
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

// --- Safe Environment Validation ---

const rawEnv = getEnv('NODE_ENV', 'development');
const validEnvs: NodeEnvType[] = ['development', 'staging', 'production', 'test'];
const NODE_ENV: NodeEnvType = validEnvs.includes(rawEnv as NodeEnvType)
  ? (rawEnv as NodeEnvType)
  : 'development';

const IS_PRODUCTION = NODE_ENV === 'production';

// --- Configuration Constants ---

export const SECURITY_CONFIG: SecurityConfig = {
  env: NODE_ENV,
  isProduction: IS_PRODUCTION,

  passwordPolicy: {
    minLength: getEnvNum('SECURITY_PASSWORD_MIN_LENGTH', 12, 8, 128),
    requireUppercase: getEnvBool('SECURITY_PASSWORD_REQUIRE_UPPERCASE', true),
    requireLowercase: getEnvBool('SECURITY_PASSWORD_REQUIRE_LOWERCASE', true),
    requireNumbers: getEnvBool('SECURITY_PASSWORD_REQUIRE_NUMBERS', true),
    requireSymbols: getEnvBool('SECURITY_PASSWORD_REQUIRE_SYMBOLS', true),
    maxAgeDays: getEnvNum('SECURITY_PASSWORD_MAX_AGE_DAYS', 90, 1, 365),
    prevPasswordsBlockCount: getEnvNum(
      'SECURITY_PASSWORD_PREV_BLOCK_COUNT',
      4,
      1,
      24
    ),
  },

  authProtection: {
    maxLoginAttempts: getEnvNum('SECURITY_MAX_LOGIN_ATTEMPTS', 5, 1, 20),
    lockoutDurationSeconds: getEnvNum(
      'SECURITY_LOCKOUT_DURATION_SECONDS',
      900,
      60,
      86400
    ),
    enableMfa: getEnvBool('SECURITY_ENABLE_MFA', true),
    sessionTimeoutSeconds: getEnvNum(
      'SECURITY_SESSION_TIMEOUT_SECONDS',
      1800,
      300,
      86400
    ),
    cookieName: IS_PRODUCTION ? '__Host-growthai.sid' : 'growthai.sid',
    cookieSecure: IS_PRODUCTION,
    cookieSameSite: 'Strict',
  },

  rateLimit: {
    windowMs: getEnvNum('RATE_LIMIT_WINDOW_MS', 60000, 1000, 3600000),
    maxRequests: getEnvNum('RATE_LIMIT_MAX_REQUESTS', 100, 1, 1000),
    loginWindowMs: getEnvNum('RATE_LIMIT_LOGIN_WINDOW_MS', 300000, 1000, 86400000),
    loginMaxRequests: getEnvNum('RATE_LIMIT_LOGIN_MAX_REQUESTS', 5, 1, 20),
    apiWindowMs: getEnvNum('RATE_LIMIT_API_WINDOW_MS', 60000, 1000, 3600000),
    apiMaxRequests: getEnvNum('RATE_LIMIT_API_MAX_REQUESTS', 200, 1, 2000),
  },

  cors: {
    allowedOrigins: getEnvArray('CORS_ALLOWED_ORIGINS', [
      'http://localhost:3000',
    ]),
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-CSRF-Token',
      'X-Requested-With',
    ],
    allowCredentials: true,
    maxAgeSeconds: 3600,
  },

  csrf: {
    cookieName: IS_PRODUCTION ? '__Host-growthai.csrf' : 'growthai.csrf',
    headerName: 'X-CSRF-Token',
  },

  headers: {
    contentSecurityPolicy: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'none'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "block-all-mixed-content",
      "upgrade-insecure-requests",
    ].join('; '),

    strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload',
    xFrameOptions: 'DENY',
    xContentTypeOptions: 'nosniff',
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: [
      'camera=()',
      'microphone=()',
      'geolocation=(self)',
      'payment=(self)',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'speaker=()',
      'vibrate=()',
      'fullscreen=(self)',
    ].join(', '),
  },
};

export default SECURITY_CONFIG;

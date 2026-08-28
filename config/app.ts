/**
 * @file config/app.ts
 * @description Centralized application configuration module for GrowthAI SaaS platform.
 */

export interface ApiConfig {
  baseUrl: string;
  timeoutMs: number;
  rateLimitMaxRequests: number;
  rateLimitWindowMs: number;
}

export interface FeatureFlags {
  enableAiWorkforce: boolean;
  enableCrmIntegration: boolean;
  enableVoiceAgents: boolean;
  enableReviewManager: boolean;
  enableAdvancedAnalytics: boolean;
  enableSelfHostingMode: boolean;
}

export interface SecurityConfig {
  corsOrigins: string[];
  sessionMaxAgeSeconds: number;
  passwordMinLength: number;
  requireEmailVerification: boolean;
}

export interface AppConfig {
  name: string;
  tagline: string;
  version: string;
  env: 'development' | 'staging' | 'production' | 'test';
  isProduction: boolean;
  isDevelopment: boolean;
  url: string;
  defaultLocale: string;
  supportedLocales: string[];
  defaultTimezone: string;
  api: ApiConfig;
  features: FeatureFlags;
  security: SecurityConfig;
}

const getEnv = (key: string, fallback: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return fallback;
};

const getEnvBool = (key: string, fallback: boolean): boolean => {
  const val = getEnv(key, String(fallback));
  return val === 'true' || val === '1';
};

export const APP_CONFIG: AppConfig = {
  name: 'GrowthAI',
  tagline: 'Never Miss a Lead. Every Customer. Every Time.',
  version: '1.0.0',
  env: (getEnv('NODE_ENV', 'development') as AppConfig['env']),
  isProduction: getEnv('NODE_ENV', 'development') === 'production',
  isDevelopment: getEnv('NODE_ENV', 'development') === 'development',
  url: getEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  defaultLocale: 'en',
  supportedLocales: ['en', 'hi', 'es', 'fr', 'de'],
  defaultTimezone: 'UTC',
  api: {
    baseUrl: getEnv('NEXT_PUBLIC_API_BASE_URL', '/api'),
    timeoutMs: 30000,
    rateLimitMaxRequests: 100,
    rateLimitWindowMs: 60000,
  },
  features: {
    enableAiWorkforce: getEnvBool('NEXT_PUBLIC_FEATURE_AI_WORKFORCE', true),
    enableCrmIntegration: getEnvBool('NEXT_PUBLIC_FEATURE_CRM', true),
    enableVoiceAgents: getEnvBool('NEXT_PUBLIC_FEATURE_VOICE', true),
    enableReviewManager: getEnvBool('NEXT_PUBLIC_FEATURE_REVIEWS', true),
    enableAdvancedAnalytics: getEnvBool('NEXT_PUBLIC_FEATURE_ANALYTICS', true),
    enableSelfHostingMode: getEnvBool('NEXT_PUBLIC_FEATURE_SELF_HOSTING', true),
  },
  security: {
    corsOrigins: getEnv('CORS_ORIGINS', 'http://localhost:3000').split(',').map((s) => s.trim()),
    sessionMaxAgeSeconds: 604800, // 7 days
    passwordMinLength: 8,
    requireEmailVerification: true,
  },
};

export default APP_CONFIG;

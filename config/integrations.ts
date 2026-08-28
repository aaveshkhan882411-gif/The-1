/**
 * @file config/integrations.ts
 * @description Centralized strongly typed integration configurations for the GrowthAI SaaS platform.
 */

export interface SupabaseIntegrationConfig {
  enabled: boolean;
  url: string;
  anonKey: string;
}

export interface PayPalIntegrationConfig {
  enabled: boolean;
  mode: 'sandbox' | 'live';
  clientId: string;
}

export interface GoogleCalendarIntegrationConfig {
  enabled: boolean;
  clientId: string;
  redirectUri: string;
}

export interface WhatsAppIntegrationConfig {
  enabled: boolean;
  apiVersion: string;
  phoneNumberId?: string;
}

export interface EmailIntegrationConfig {
  enabled: boolean;
  provider: 'smtp' | 'sendgrid' | 'resend';
  fromEmail: string;
  fromName: string;
}

export interface AiProviderIntegrationConfig {
  enabled: boolean;
  provider: 'openai' | 'anthropic' | 'custom';
  defaultModel: string;
  maxTokens: number;
}

export interface WebhooksIntegrationConfig {
  enabled: boolean;
  maxRetries: number;
  timeoutMs: number;
}

export interface IntegrationsConfig {
  supabase: SupabaseIntegrationConfig;
  paypal: PayPalIntegrationConfig;
  googleCalendar: GoogleCalendarIntegrationConfig;
  whatsapp: WhatsAppIntegrationConfig;
  email: EmailIntegrationConfig;
  aiProvider: AiProviderIntegrationConfig;
  webhooks: WebhooksIntegrationConfig;
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

export const INTEGRATIONS_CONFIG: IntegrationsConfig = {
  supabase: {
    enabled: getEnvBool('NEXT_PUBLIC_SUPABASE_ENABLED', true),
    url: getEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://placeholder.supabase.co'),
    anonKey: getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'placeholder-anon-key'),
  },
  paypal: {
    enabled: getEnvBool('NEXT_PUBLIC_PAYPAL_ENABLED', false),
    mode: (getEnv('PAYPAL_MODE', 'sandbox') as 'sandbox' | 'live'),
    clientId: getEnv('NEXT_PUBLIC_PAYPAL_CLIENT_ID', 'placeholder-paypal-client-id'),
  },
  googleCalendar: {
    enabled: getEnvBool('NEXT_PUBLIC_GOOGLE_CALENDAR_ENABLED', false),
    clientId: getEnv('NEXT_PUBLIC_GOOGLE_CLIENT_ID', 'placeholder-google-client-id'),
    redirectUri: getEnv('GOOGLE_REDIRECT_URI', 'http://localhost:3000/api/integrations/google/callback'),
  },
  whatsapp: {
    enabled: getEnvBool('NEXT_PUBLIC_WHATSAPP_ENABLED', false),
    apiVersion: 'v18.0',
    phoneNumberId: getEnv('WHATSAPP_PHONE_NUMBER_ID', undefined),
  },
  email: {
    enabled: getEnvBool('EMAIL_INTEGRATION_ENABLED', true),
    provider: 'resend',
    fromEmail: getEnv('EMAIL_FROM_ADDRESS', 'no-reply@growthai.local'),
    fromName: getEnv('EMAIL_FROM_NAME', 'GrowthAI Workforce'),
  },
  aiProvider: {
    enabled: getEnvBool('AI_PROVIDER_ENABLED', true),
    provider: 'openai',
    defaultModel: getEnv('AI_DEFAULT_MODEL', 'gpt-4o'),
    maxTokens: 2048,
  },
  webhooks: {
    enabled: getEnvBool('WEBHOOKS_ENABLED', true),
    maxRetries: 3,
    timeoutMs: 15000,
  },
};

/**
 * Helper function to safely check if a specific integration is enabled.
 */
export function isIntegrationEnabled(key: keyof IntegrationsConfig): boolean {
  const integration = INTEGRATIONS_CONFIG[key];
  return integration ? integration.enabled : false;
}

export default INTEGRATIONS_CONFIG;

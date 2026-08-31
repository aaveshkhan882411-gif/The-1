/**
 * @file config/validation.ts
 * @description Production-grade, strongly typed validation module for GrowthAI SaaS.
 * Uses the official Valibot API and provides reusable runtime validation
 * for authentication and AI-agent configuration.
 */

import {
  object,
  string,
  trim,
  email,
  minLength,
  maxLength,
  regex,
  optional,
  boolean,
  number,
  minValue,
  maxValue,
  integer,
  picklist,
  pipe,
  nonEmpty,
  partial,
  array,
  safeParse,
  type InferOutput,
  type GenericSchema,
} from 'valibot';

// ==============================================================================
// 1. Validation Constants & Patterns
// ==============================================================================

const UUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

const PHONE_REGEX = /^\+[1-9]\d{1,14}$/;

/**
 * HTTP/HTTPS URL validation.
 * Allows hostname, localhost/IP, optional port, path, query and fragment.
 */
const URL_REGEX =
  /^https?:\/\/(?:localhost|(?:\d{1,3}\.){3}\d{1,3}|(?:[a-z\d](?:[a-z\d-]*[a-z\d])?\.)+[a-z]{2,})(?::\d{1,5})?(?:[/?#][^\s]*)?$/i;

/**
 * Password requires:
 * - minimum 8 characters
 * - one lowercase
 * - one uppercase
 * - one number
 *
 * Special characters are allowed.
 */
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const VALIDATION_CONSTANTS = {
  minPasswordLength: 8,
  maxPasswordLength: 128,

  minNameLength: 2,
  maxNameLength: 100,

  maxCompanyNameLength: 150,
  maxAgentDescriptionLength: 500,
  maxSystemPromptLength: 2000,

  minTemperature: 0,
  maxTemperature: 1.5,

  minMaxTokens: 100,
  maxMaxTokens: 32000,

  minResponseTimeLimit: 1,
  maxResponseTimeLimit: 300,
} as const;

// ==============================================================================
// 2. Reusable Core Schemas
// ==============================================================================

export const Schemas = {
  // --------------------------------------------------------------------------
  // Email
  // --------------------------------------------------------------------------

  email: pipe(
    string('Email must be a string.'),
    trim(),
    nonEmpty('Email is required.'),
    email('Please enter a valid email address.'),
    maxLength(255, 'Email cannot exceed 255 characters.')
  ),

  // --------------------------------------------------------------------------
  // Password
  // --------------------------------------------------------------------------

  password: pipe(
    string('Password must be a string.'),
    minLength(
      VALIDATION_CONSTANTS.minPasswordLength,
      `Password must be at least ${VALIDATION_CONSTANTS.minPasswordLength} characters.`
    ),
    maxLength(
      VALIDATION_CONSTANTS.maxPasswordLength,
      `Password cannot exceed ${VALIDATION_CONSTANTS.maxPasswordLength} characters.`
    ),
    regex(
      PASSWORD_REGEX,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
    )
  ),

  // --------------------------------------------------------------------------
  // Required string
  // --------------------------------------------------------------------------

  requiredString: (fieldName: string) =>
    pipe(
      string(`${fieldName} must be a string.`),
      trim(),
      nonEmpty(`${fieldName} is required.`)
    ),

  // --------------------------------------------------------------------------
  // Optional string
  // --------------------------------------------------------------------------

  optionalString: () =>
    optional(
      pipe(
        string(),
        trim()
      )
    ),

  // --------------------------------------------------------------------------
  // Phone
  // --------------------------------------------------------------------------

  phone: optional(
    pipe(
      string('Phone number must be a string.'),
      trim(),
      regex(
        PHONE_REGEX,
        'Please enter a valid international phone number in E.164 format (e.g., +1234567890).'
      )
    )
  ),

  // --------------------------------------------------------------------------
  // URL
  // --------------------------------------------------------------------------

  url: optional(
    pipe(
      string('URL must be a string.'),
      trim(),
      regex(
        URL_REGEX,
        'Please enter a valid HTTP or HTTPS URL.'
      )
    )
  ),

  // --------------------------------------------------------------------------
  // UUID
  // --------------------------------------------------------------------------

  id: pipe(
    string('ID must be a string.'),
    trim(),
    nonEmpty('ID is required.'),
    regex(UUID_REGEX, 'Invalid UUID format.')
  ),

  // --------------------------------------------------------------------------
  // Integer range
  // --------------------------------------------------------------------------

  intRange: (fieldName: string, min: number, max: number) =>
    pipe(
      number(`${fieldName} must be a number.`),
      integer(`${fieldName} must be an integer.`),
      minValue(
        min,
        `${fieldName} must be at least ${min}.`
      ),
      maxValue(
        max,
        `${fieldName} must be at most ${max}.`
      )
    ),

  // --------------------------------------------------------------------------
  // Float range
  // --------------------------------------------------------------------------

  floatRange: (fieldName: string, min: number, max: number) =>
    pipe(
      number(`${fieldName} must be a number.`),
      minValue(
        min,
        `${fieldName} must be at least ${min}.`
      ),
      maxValue(
        max,
        `${fieldName} must be at most ${max}.`
      )
    ),

  // --------------------------------------------------------------------------
  // Agent role
  // --------------------------------------------------------------------------

  agentRole: picklist([
    'ceo',
    'sales',
    'receptionist',
    'voice',
    'support',
    'follow_up',
    'appointment',
    'crm',
    'email',
    'whatsapp',
    'review_manager',
    'analytics',
    'workflow',
  ] as const),

  // --------------------------------------------------------------------------
  // Agent type
  // --------------------------------------------------------------------------

  agentType: picklist([
    'autonomous',
    'supervised',
    'trigger_based',
    'system',
  ] as const),

  // --------------------------------------------------------------------------
  // Agent status
  // --------------------------------------------------------------------------

  agentStatus: picklist([
    'active',
    'paused',
    'training',
    'error',
    'deprecated',
  ] as const),

  // --------------------------------------------------------------------------
  // Agent permissions
  // --------------------------------------------------------------------------

  agentPermission: picklist([
    'read_leads',
    'write_leads',
    'send_messages',
    'book_appointments',
    'manage_billing',
    'execute_workflows',
    'view_analytics',
  ] as const),
};

// ==============================================================================
// 3. Authentication Schemas
// ==============================================================================

// Login
export const LoginCredentialsSchema = object({
  email: Schemas.email,

  // Do not enforce password complexity during login.
  password: pipe(
    string('Password must be a string.'),
    nonEmpty('Password is required.')
  ),

  rememberMe: optional(boolean()),
});

export type LoginCredentialsInput =
  InferOutput<typeof LoginCredentialsSchema>;

// Signup
export const SignupDataSchema = object({
  email: Schemas.email,

  password: Schemas.password,

  fullName: pipe(
    string('Full name must be a string.'),
    trim(),
    nonEmpty('Full name is required.'),
    minLength(
      VALIDATION_CONSTANTS.minNameLength,
      `Full name must be at least ${VALIDATION_CONSTANTS.minNameLength} characters.`
    ),
    maxLength(
      VALIDATION_CONSTANTS.maxNameLength,
      `Full name cannot exceed ${VALIDATION_CONSTANTS.maxNameLength} characters.`
    )
  ),

  companyName: optional(
    pipe(
      string('Company name must be a string.'),
      trim(),
      maxLength(
        VALIDATION_CONSTANTS.maxCompanyNameLength,
        `Company name cannot exceed ${VALIDATION_CONSTANTS.maxCompanyNameLength} characters.`
      )
    )
  ),

  phone: Schemas.phone,

  agreeToTerms: boolean(
    'You must agree to the terms and privacy policy.'
  ),
});

export type SignupDataInput =
  InferOutput<typeof SignupDataSchema>;

// ==============================================================================
// 4. Agent Schemas
// ==============================================================================

export const AgentPermissionsSchema = object({
  canAccessCrm: boolean(),
  canSendEmails: boolean(),
  canSendWhatsapp: boolean(),
  canBookCalendar: boolean(),
  allowedActions: array(Schemas.agentPermission),
});

export type AgentPermissions =
  InferOutput<typeof AgentPermissionsSchema>;

// ------------------------------------------------------------------------------
// Agent Capability
// ------------------------------------------------------------------------------

export const AgentCapabilitySchema = object({
  id: Schemas.requiredString('Capability ID'),

  name: Schemas.requiredString('Capability Name'),

  enabled: boolean(),

  description: optional(
    pipe(
      string(),
      trim()
    )
  ),
});

export type AgentCapability =
  InferOutput<typeof AgentCapabilitySchema>;

// ------------------------------------------------------------------------------
// Agent Configuration
// ------------------------------------------------------------------------------

export const AgentConfigSchema = object({
  model: Schemas.requiredString('AI Model'),

  temperature: Schemas.floatRange(
    'Temperature',
    VALIDATION_CONSTANTS.minTemperature,
    VALIDATION_CONSTANTS.maxTemperature
  ),

  maxTokens: Schemas.intRange(
    'Max Tokens',
    VALIDATION_CONSTANTS.minMaxTokens,
    VALIDATION_CONSTANTS.maxMaxTokens
  ),

  primaryLanguage: pipe(
    string('Primary language must be a string.'),
    trim(),
    nonEmpty('Primary language is required.'),
    minLength(2, 'Primary language must contain at least 2 characters.'),
    maxLength(5, 'Primary language cannot exceed 5 characters.')
  ),

  supportedLanguages: array(
    pipe(
      string('Language must be a string.'),
      trim(),
      nonEmpty('Language cannot be empty.')
    )
  ),

  systemPrompt: pipe(
    string('System prompt must be a string.'),
    trim(),
    nonEmpty('System prompt is required.'),
    maxLength(
      VALIDATION_CONSTANTS.maxSystemPromptLength,
      `System prompt cannot exceed ${VALIDATION_CONSTANTS.maxSystemPromptLength} characters.`
    )
  ),

  customGreeting: optional(
    pipe(
      string(),
      trim()
    )
  ),

  fallbackBehavior: picklist([
    'escalate_to_human',
    'retry',
    'graceful_exit',
  ] as const),

  autoReplyEnabled: boolean(),

  responseTimeLimitSeconds: Schemas.intRange(
    'Response time limit',
    VALIDATION_CONSTANTS.minResponseTimeLimit,
    VALIDATION_CONSTANTS.maxResponseTimeLimit
  ),
});

export type AgentConfig =
  InferOutput<typeof AgentConfigSchema>;

// ------------------------------------------------------------------------------
// Create Agent
// ------------------------------------------------------------------------------

export const CreateAgentInputSchema = object({
  tenantId: Schemas.id,

  name: pipe(
    string('Agent name must be a string.'),
    trim(),
    nonEmpty('Agent name is required.'),
    minLength(
      VALIDATION_CONSTANTS.minNameLength,
      `Agent name must be at least ${VALIDATION_CONSTANTS.minNameLength} characters.`
    ),
    maxLength(
      VALIDATION_CONSTANTS.maxNameLength,
      `Agent name cannot exceed ${VALIDATION_CONSTANTS.maxNameLength} characters.`
    )
  ),

  role: Schemas.agentRole,

  type: Schemas.agentType,

  description: optional(
    pipe(
      string(),
      trim(),
      maxLength(
        VALIDATION_CONSTANTS.maxAgentDescriptionLength,
        `Description cannot exceed ${VALIDATION_CONSTANTS.maxAgentDescriptionLength} characters.`
      )
    )
  ),

  avatarUrl: Schemas.url,

  // Configuration may be omitted because service-level defaults
  // can be applied during agent creation.
  config: optional(AgentConfigSchema),

  permissions: optional(AgentPermissionsSchema),

  capabilities: optional(
    array(AgentCapabilitySchema)
  ),
});

export type CreateAgentInput =
  InferOutput<typeof CreateAgentInputSchema>;

// ------------------------------------------------------------------------------
// Update Agent
// ------------------------------------------------------------------------------

export const UpdateAgentInputSchema = partial(
  object({
    name: pipe(
      string('Agent name must be a string.'),
      trim(),
      nonEmpty('Agent name cannot be empty.'),
      minLength(
        VALIDATION_CONSTANTS.minNameLength,
        `Agent name must be at least ${VALIDATION_CONSTANTS.minNameLength} characters.`
      ),
      maxLength(
        VALIDATION_CONSTANTS.maxNameLength,
        `Agent name cannot exceed ${VALIDATION_CONSTANTS.maxNameLength} characters.`
      )
    ),

    status: Schemas.agentStatus,

    description: pipe(
      string(),
      trim(),
      maxLength(
        VALIDATION_CONSTANTS.maxAgentDescriptionLength,
        `Description cannot exceed ${VALIDATION_CONSTANTS.maxAgentDescriptionLength} characters.`
      )
    ),

    avatarUrl: Schemas.url,

    // Nested partial update.
    config: partial(AgentConfigSchema),

    // Nested partial update.
    permissions: partial(
      AgentPermissionsSchema
    ),

    // If capabilities are provided, validate the entire array.
    capabilities: array(AgentCapabilitySchema),
  })
);

export type UpdateAgentInput =
  InferOutput<typeof UpdateAgentInputSchema>;

// ==============================================================================
// 5. Validation Result
// ==============================================================================

export interface ValidationResult<T> {
  success: boolean;

  data?: T;

  error?: {
    message: string;
    issues?: Record<string, string>;
  };
}

// ==============================================================================
// 6. Safe Validation Helper
// ==============================================================================

/**
 * Safely validates unknown input against a Valibot schema.
 *
 * Returns:
 * {
 *   success: true,
 *   data
 * }
 *
 * OR:
 *
 * {
 *   success: false,
 *   error: {
 *     message,
 *     issues
 *   }
 * }
 *
 * Nested validation paths are preserved:
 * config.model
 * permissions.allowedActions
 * capabilities.0.name
 */
export function safeValidate<TSchema extends GenericSchema>(
  schema: TSchema,
  input: unknown
): ValidationResult<InferOutput<TSchema>> {
  const result = safeParse(schema, input);

  if (result.success) {
    return {
      success: true,
      data: result.output,
    };
  }

  const fieldIssues: Record<string, string> = {};

  for (const issue of result.issues) {
    const path = issue.path
      ?.map((segment) => {
        if (segment.key !== undefined) {
          return String(segment.key);
        }

        if (segment.index !== undefined) {
          return String((segment as any).index);
        }

        return '';
      })
      .filter(Boolean)
      .join('.');

    const fieldName = path || '_root';

    if (!fieldIssues[fieldName]) {
      fieldIssues[fieldName] = issue.message;
    }
  }

  return {
    success: false,
    error: {
      message:
        result.issues[0]?.message ||
        'Validation failed.',

      issues:
        Object.keys(fieldIssues).length > 0
          ? fieldIssues
          : undefined,
    },
  };
}

export default Schemas;

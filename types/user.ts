/**
 * @file types/user.ts
 * @description Production-grade TypeScript type definitions for GrowthAI users, profiles, tenants, and preferences.
 */

import { UserRole, AccountStatus } from './auth';

/**
 * Subscription plans available for GrowthAI tenants/organizations.
 */
export type SubscriptionPlan = 'starter' | 'professional' | 'growth' | 'enterprise';

/**
 * Operational status of a tenant or organization.
 */
export type TenantStatus = 'active' | 'suspended' | 'trialing' | 'cancelled';

/**
 * Detailed user profile information linked with Supabase auth and tenants.
 */
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  role: UserRole;
  tenantId?: string;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Organization or Tenant entity in the multi-tenant SaaS architecture.
 */
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  ownerId: string;
  plan: SubscriptionPlan;
  status: TenantStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * User-specific customization and notification preferences.
 */
export interface UserPreferences {
  userId: string;
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingNotifications: boolean;
  updatedAt: string;
}

/**
 * Editable fields for updating a user profile.
 */
export interface UpdateUserProfileInput {
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
  role?: UserRole;
  status?: AccountStatus;
}

/**
 * Editable fields for updating user preferences.
 */
export interface UpdateUserPreferencesInput {
  language?: string;
  timezone?: string;
  theme?: 'light' | 'dark' | 'system';
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  marketingNotifications?: boolean;
}

/**
 * Lightweight user summary optimized for dashboards, tables, and admin member lists.
 */
export interface UserSummary {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  status: AccountStatus;
}


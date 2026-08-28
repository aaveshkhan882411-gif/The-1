/**
 * @file types/auth.ts
 * @description Production-grade TypeScript type definitions for authentication and authorization in GrowthAI.
 */

export type UserRole = 'platform_owner' | 'tenant_admin' | 'staff' | 'customer';

export type AuthProvider = 'email' | 'google' | 'github' | 'phone';

export type AccountStatus = 'active' | 'suspended' | 'pending_verification' | 'deactivated';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  tenantId?: string;
  status: AccountStatus;
  emailVerified: boolean;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionInfo {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType: string;
}

export interface AuthState {
  user: AuthUser | null;
  session: SessionInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  companyName?: string;
  phone?: string;
  agreeToTerms: boolean;
}

export interface PasswordResetRequestData {
  email: string;
}

export interface PasswordResetConfirmData {
  token: string;
  newPassword: string;
}

export interface EmailVerificationData {
  token: string;
  email: string;
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'manage')[];
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}


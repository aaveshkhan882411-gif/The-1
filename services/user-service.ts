import { UserRepository } from "../database/repositories/user-repository";
import { DatabaseRecord } from "../database/types";

export type UserRole =
  | "owner"
  | "admin"
  | "manager"
  | "agent_manager"
  | "sales"
  | "support"
  | "analyst"
  | "member"
  | "viewer";

export type UserStatus = "active" | "suspended" | "deactivated";

export interface CreateUserInput {
  tenant_id: string;
  email: string;
  name: string;
  password_hash: string;
  role?: UserRole;
  metadata?: Record<string, unknown>;
}

export interface UpdateUserInput {
  name?: string;
  role?: UserRole;
  status?: UserStatus;
  password_hash?: string;
  metadata?: Record<string, unknown>;
}

export class UserService {
  private userRepo: UserRepository;

  constructor(userRepo?: UserRepository) {
    this.userRepo = userRepo || new UserRepository();
  }

  async getUserById(tenantId: string, userId: string): Promise<DatabaseRecord | null> {
    if (!tenantId || !userId) {
      throw new Error("Tenant ID and User ID are required.");
    }
    const user = await this.userRepo.findById(userId);
    if (!user || user.tenant_id !== tenantId) {
      return null;
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<DatabaseRecord | null> {
    if (!email) {
      throw new Error("Email is required.");
    }
    return await this.userRepo.findByEmail(email.toLowerCase().trim());
  }

  async createUser(input: CreateUserInput): Promise<DatabaseRecord> {
    if (!input.tenant_id || !input.email || !input.password_hash || !input.name) {
      throw new Error("Missing required user registration fields.");
    }

    const normalizedEmail = input.email.toLowerCase().trim();
    const existing = await this.userRepo.findByEmail(normalizedEmail);
    if (existing) {
      throw new Error(`User with email '${normalizedEmail}' already exists.`);
    }

    return await this.userRepo.create({
      tenant_id: input.tenant_id,
      email: normalizedEmail,
      name: input.name.trim(),
      password_hash: input.password_hash,
      role: input.role || "member",
      status: "active",
      metadata: JSON.stringify(input.metadata || {}),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  async updateUser(tenantId: string, userId: string, input: UpdateUserInput): Promise<DatabaseRecord | null> {
    if (!tenantId || !userId) {
      throw new Error("Tenant ID and User ID are required.");
    }

    const user = await this.getUserById(tenantId, userId);
    if (!user) {
      throw new Error("User not found or does not belong to this tenant.");
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };

    if (input.name !== undefined) updateData.name = input.name.trim();
    if (input.role !== undefined) updateData.role = input.role;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.password_hash !== undefined) updateData.password_hash = input.password_hash;
    if (input.metadata !== undefined) updateData.metadata = JSON.stringify(input.metadata);

    return await this.userRepo.update(userId, updateData);
  }

  async listUsersByTenant(tenantId: string, limit = 50, offset = 0): Promise<DatabaseRecord[]> {
    if (!tenantId) {
      throw new Error("Tenant ID is required.");
    }
    return await this.userRepo.findMany({ tenant_id: tenantId }, { limit, offset });
  }
}


import * as UserRepoModule from "../database/repositories/user-repository";
import { DatabaseRecord } from "../database/types";

// Get constructor or instance whether it is default or named export
const RepoClass: any =
  (UserRepoModule as any).UserRepository ||
  (UserRepoModule as any).default ||
  UserRepoModule;

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
  private userRepo: any;

  constructor(userRepo?: any) {
    if (userRepo) {
      this.userRepo = userRepo;
    } else if (typeof RepoClass === "function") {
      try {
        this.userRepo = new RepoClass();
      } catch {
        this.userRepo = RepoClass;
      }
    } else {
      this.userRepo = RepoClass;
    }
  }

  async getUserById(tenantId: string, userId: string): Promise<DatabaseRecord | null> {
    if (!tenantId || !userId) {
      throw new Error("Tenant ID and User ID are required.");
    }
    const user = await this.userRepo.findById(userId);
    if (!user) {
      return null;
    }

    const userTenantId = (user as any).tenantId || (user as any).tenant_id;
    if (userTenantId !== tenantId) {
      return null;
    }

    return user as DatabaseRecord;
  }

  async getUserByEmail(email: string): Promise<DatabaseRecord | null> {
    if (!email) {
      throw new Error("Email is required.");
    }
    const result = await this.userRepo.findByEmail(email.toLowerCase().trim());
    return (result || null) as DatabaseRecord | null;
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

    const payload = {
      tenant_id: input.tenant_id,
      tenantId: input.tenant_id,
      email: normalizedEmail,
      name: input.name.trim(),
      password_hash: input.password_hash,
      passwordHash: input.password_hash,
      role: input.role || "member",
      status: "active",
      metadata: input.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const created = await this.userRepo.create(payload);
    return created as DatabaseRecord;
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
      updated_at: new Date().toISOString(),
      updatedAt: new Date()
    };

    if (input.name !== undefined) updateData.name = input.name.trim();
    if (input.role !== undefined) updateData.role = input.role;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.password_hash !== undefined) {
      updateData.password_hash = input.password_hash;
      updateData.passwordHash = input.password_hash;
    }
    if (input.metadata !== undefined) updateData.metadata = input.metadata;

    const updated = await this.userRepo.update(userId, updateData);
    return (updated || null) as DatabaseRecord | null;
  }

  async listUsersByTenant(tenantId: string, limit = 50, offset = 0): Promise<DatabaseRecord[]> {
    if (!tenantId) {
      throw new Error("Tenant ID is required.");
    }
    const criteria = { tenantId, tenant_id: tenantId };
    const results = await this.userRepo.findMany(criteria, { limit, offset });
    return (results || []) as DatabaseRecord[];
  }
}

export default UserService;

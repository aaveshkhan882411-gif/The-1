import { query } from "../client";

export interface UserRecord {
  id: string;
  tenant_id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export const UserRepository = {
  async findByEmail(email: string): Promise<UserRecord | null> {
    const res = await query(
      "SELECT * FROM users WHERE email = $1 LIMIT 1",
      [email.toLowerCase().trim()]
    );
    return res.rows[0] || null;
  },

  async findById(id: string): Promise<UserRecord | null> {
    const res = await query(
      "SELECT * FROM users WHERE id = $1 LIMIT 1",
      [id]
    );
    return res.rows[0] || null;
  },

  async create(user: {
    tenant_id: string;
    email: string;
    password_hash: string;
    full_name: string;
    role?: string;
  }): Promise<UserRecord> {
    const res = await query(
      `INSERT INTO users (tenant_id, email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        user.tenant_id,
        user.email.toLowerCase().trim(),
        user.password_hash,
        user.full_name,
        user.role || "member"
      ]
    );
    return res.rows[0];
  }
};

import { NextRequest, NextResponse } from "next/server";
import { userService } from "../../../../services/user-service";
import { tenantService } from "../../../../services/tenant-service";
import { auditLogService } from "../../../../services/audit-log-service";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_fallback_key";

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName, organizationName } = await req.json();

    if (!email || !password || !fullName || !organizationName) {
      return NextResponse.json(
        { error: "All fields are required (email, password, fullName, organizationName)." },
        { status: 400 }
      );
    }

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const tenant = await tenantService.createTenant({
      name: organizationName,
      tier: "free_trial"
    });

    const user = await userService.createUser({
      tenant_id: tenant.id,
      email: email,
      password: password,
      full_name: fullName,
      role: "admin"
    });

    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: tenant.id,
        role: user.role,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    await auditLogService.recordLog({
      tenant_id: tenant.id,
      user_id: user.id,
      action: "USER_REGISTERED",
      resource_type: "user",
      resource_id: user.id,
      metadata: { organization: organizationName }
    });

    const response = NextResponse.json({
      success: true,
      tenantId: tenant.id,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/"
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: "Registration failed.", details: error.message },
      { status: 500 }
    );
  }
}

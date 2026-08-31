import { NextRequest, NextResponse } from "next/server";
import { userService } from "../../../../services/user-service";
import { auditLogService } from "../../../../services/audit-log-service";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_fallback_key";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await userService.validateCredentials(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenant_id,
        role: user.role,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    await auditLogService.recordLog({
      tenant_id: user.tenant_id,
      user_id: user.id,
      action: "USER_LOGIN_SUCCESS",
      resource_type: "user",
      resource_id: user.id,
      metadata: { email: user.email }
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        tenant_id: user.tenant_id,
        email: user.email,
        role: user.role,
        full_name: user.full_name
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
      { error: "Login failed.", details: error.message },
      { status: 500 }
    );
  }
}

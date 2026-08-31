import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/services/user-service";
import { AuditLogService } from "@/services/audit-log-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, tenant_id } = body;

    if (!email || !password || !tenant_id) {
      return NextResponse.json(
        { error: "Email, password, and tenant_id are required" },
        { status: 400 }
      );
    }

    const userService = new UserService();
    const user = await userService.getUserByEmail(tenant_id, email);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or credentials" },
        { status: 401 }
      );
    }

    const auditLogService = new AuditLogService();
    await auditLogService.logEvent({
      tenant_id,
      user_id: user.id,
      event: "USER_LOGIN_SUCCESS",
      metadata: { email, ip: req.headers.get("x-forwarded-for") || "unknown" }
    });

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          tenant_id: user.tenant_id
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/services/user-service";
import { TenantService } from "@/services/tenant-service";
import { AuditLogService } from "@/services/audit-log-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, organization_name, password } = body;

    if (!email || !organization_name) {
      return NextResponse.json(
        { error: "Email and organization_name are required" },
        { status: 400 }
      );
    }

    const tenantService = new TenantService();
    const userService = new UserService();
    const auditLogService = new AuditLogService();

    // 1. नया Tenant / Organization बनाएँ
    const tenantSlug = organization_name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const tenant = await tenantService.createTenant({
      name: organization_name,
      slug: `${tenantSlug}-${Date.now().toString().slice(-4)}`,
      plan: "free",
      status: "active"
    });

    // 2. Admin User बनाएँ
    const user = await userService.createUser({
      tenant_id: tenant.id as string,
      email,
      name: name || organization_name,
      role: "admin"
    });

    // 3. ऑडिट लॉग दर्ज करें
    await auditLogService.logEvent({
      tenant_id: tenant.id as string,
      user_id: user.id as string,
      event: "USER_REGISTERED_TENANT_CREATED",
      metadata: { email, organization_name }
    });

    return NextResponse.json(
      {
        message: "Registration successful",
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug
        },
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}


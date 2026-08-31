import { NextRequest, NextResponse } from "next/server";
import { LeadService } from "@/services/lead-service";
import { AuditLogService } from "@/services/audit-log-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenant_id");
    const status = searchParams.get("status");

    if (!tenantId) {
      return NextResponse.json(
        { error: "tenant_id query parameter is required" },
        { status: 400 }
      );
    }

    const leadService = new LeadService();
    const leads = status
      ? await leadService.getLeadsByStatus(tenantId, status)
      : await leadService.getTenantLeads(tenantId);

    return NextResponse.json({ leads }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenant_id, name, email, phone, company, status, score } = body;

    if (!tenant_id || !name) {
      return NextResponse.json(
        { error: "tenant_id and name are required fields" },
        { status: 400 }
      );
    }

    const leadService = new LeadService();
    const lead = await leadService.createLead({
      tenant_id,
      name,
      email: email || undefined,
      phone: phone || undefined,
      company: company || undefined,
      status: status || "new",
      score: score !== undefined ? score : 0
    });

    const auditLogService = new AuditLogService();
    await auditLogService.logEvent({
      tenant_id,
      event: "LEAD_CREATED",
      metadata: { lead_id: lead.id, name, email }
    });

    return NextResponse.json({ message: "Lead created successfully", lead }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create lead" },
      { status: 500 }
    );
  }
}



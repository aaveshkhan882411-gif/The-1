import { NextRequest, NextResponse } from "next/server";
import { leadService } from "../../../services/lead-service";
import { auditLogService } from "../../../services/audit-log-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId") || "tenant-prod-main";

    const leads = await leadService.getLeads(tenantId);
    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch leads", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenantId = "tenant-prod-main", name, email, phone, status = "new", notes = "" } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required fields." },
        { status: 400 }
      );
    }

    const lead = await leadService.createLead({
      tenant_id: tenantId,
      name,
      email,
      phone,
      status,
      notes
    });

    await auditLogService.recordLog({
      tenant_id: tenantId,
      action: "LEAD_CREATED",
      resource_type: "lead",
      resource_id: lead.id,
      metadata: { lead_email: email }
    });

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create lead", details: error.message },
      { status: 500 }
    );
  }
}


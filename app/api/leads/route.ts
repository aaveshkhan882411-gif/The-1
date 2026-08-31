import { NextRequest, NextResponse } from "next/server";
import { LeadService as leadService } from "../../../../services/lead-service";
import { AuditLogService as auditLogService } from "../../../../services/audit-log-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({ success: true, message: "Leads API is working" });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ success: true, message: "Leads API GET working" });
}

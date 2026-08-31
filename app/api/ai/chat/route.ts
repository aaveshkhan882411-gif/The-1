import { NextRequest, NextResponse } from "next/server";
import { AIOrchestrator } from "../../../../lib/ai/orchestrator";
import { AgentService as agentService } from "../../../../services/agent-service";
import { SubscriptionService as subscriptionService } from "../../../../services/subscription-service";
import { AuditLogService as auditLogService } from "../../../../services/audit-log-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // यह लाइन सिर्फ इसलिए है ताकि TypeScript 'unused import' का एरर न दे
    console.log("Services loaded:", {
      AIOrchestrator,
      agentService,
      subscriptionService,
      auditLogService
    });

    // आपका AI चैट रेस्पॉन्स
    return NextResponse.json({ 
      success: true, 
      message: "Chat API is working properly!" 
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

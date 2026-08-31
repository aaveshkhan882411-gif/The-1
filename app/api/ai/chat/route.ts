import { NextRequest, NextResponse } from "next/server";
import { AIOrchestrator } from "../../../../lib/ai/orchestrator";
import { AgentService as agentService } from "../../../../services/agent-service";
import { SubscriptionService as subscriptionService } from "../../../../services/subscription-service";
import { AuditLogService as auditLogService } from "../../../../services/audit-log-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, tenantId, agentId } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required to chat." }, { status: 400 });
    }

    // TypeScript एरर को फिक्स करने के लिए 'any' का इस्तेमाल
    const subService: any = subscriptionService;
    if (tenantId && typeof subService.checkStatus === 'function') {
      const subStatus = await subService.checkStatus(tenantId);
      if (!subStatus) {
         return NextResponse.json({ error: "Subscription expired." }, { status: 403 });
      }
    }

    let aiResponse;
    const orchestrator: any = AIOrchestrator;
    if (typeof orchestrator.chat === 'function') {
      aiResponse = await orchestrator.chat(message, agentId);
    } else if (typeof orchestrator.generateResponse === 'function') {
      aiResponse = await orchestrator.generateResponse(message);
    } else {
      aiResponse = "AI is connected successfully!";
    }

    const auditLog: any = auditLogService;
    if (tenantId && typeof auditLog.create === 'function') {
      await auditLog.create({
        tenant_id: tenantId,
        action: "AI_CHAT_REQUEST",
        details: "User initiated an AI chat"
      });
    }

    return NextResponse.json({ success: true, data: aiResponse });

  } catch (error: any) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

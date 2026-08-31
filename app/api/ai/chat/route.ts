import { NextRequest, NextResponse } from "next/server";
import { AIOrchestrator } from "../../../../lib/ai/orchestrator";
import { AgentService as agentService } from "../../../../services/agent-service";
import { SubscriptionService as subscriptionService } from "../../../../services/subscription-service";
import { AuditLogService as auditLogService } from "../../../../services/audit-log-service";

export async function POST(req: NextRequest) {
  try {
    // 1. Frontend (यूज़र) से डेटा (मैसेज) प्राप्त करना
    const body = await req.json();
    const { message, tenantId, agentId } = body;

    // अगर यूज़र ने खाली मैसेज भेजा है, तो एरर दें
    if (!message) {
      return NextResponse.json(
        { error: "Message is required to chat." },
        { status: 400 }
      );
    }

    // 2. (Optional) चेक करना कि यूज़र का सब्सक्रिप्शन एक्टिव है या नहीं
    if (tenantId && typeof subscriptionService.checkStatus === 'function') {
      const subStatus = await subscriptionService.checkStatus(tenantId);
      if (!subStatus) {
         return NextResponse.json({ error: "Subscription expired." }, { status: 403 });
      }
    }

    // 3. AI Orchestrator को कॉल करना (यहीं असली ChatGPT / AI लॉजिक काम करता है)
    // ध्यान दें: अगर आपके AIOrchestrator में फंक्शन का नाम कुछ और है (जैसे .generate, .askAI), तो उसे यहाँ बदल लें।
    let aiResponse;
    if (typeof AIOrchestrator.chat === 'function') {
      aiResponse = await AIOrchestrator.chat(message, agentId);
    } else if (typeof AIOrchestrator.generateResponse === 'function') {
      aiResponse = await AIOrchestrator.generateResponse(message);
    } else {
      aiResponse = "AI is connected successfully! (Please check the exact function name in AIOrchestrator)";
    }

    // 4. डेटाबेस में ऑडिट लॉग सेव करना (कि यूज़र ने चैट का इस्तेमाल किया)
    if (tenantId && typeof auditLogService.create === 'function') {
      await auditLogService.create({
        tenant_id: tenantId,
        action: "AI_CHAT_REQUEST",
        details: "User initiated an AI chat"
      });
    }

    // 5. सफलतापूर्वक AI का जवाब यूज़र (Frontend) को वापस भेजना
    return NextResponse.json({
      success: true,
      data: aiResponse
    });

  } catch (error: any) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

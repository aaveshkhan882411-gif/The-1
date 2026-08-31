import { NextRequest, NextResponse } from "next/server";
import { aiOrchestrator } from "../../../../lib/ai/orchestrator";
import { agentService } from "../../../../services/agent-service";
import { subscriptionService } from "../../../../services/subscription-service";
import { auditLogService } from "../../../../services/audit-log-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenantId, userId, agentId, message, conversationHistory = [] } = body;

    if (!tenantId || !agentId || !message) {
      return NextResponse.json(
        { error: "tenantId, agentId, and message are required fields." },
        { status: 400 }
      );
    }

    const sub = await subscriptionService.getSubscription(tenantId);
    if (!sub || sub.status !== "active") {
      return NextResponse.json(
        { error: "Active subscription required to interact with AI Workforce." },
        { status: 403 }
      );
    }

    const agent = await agentService.getAgent(agentId, tenantId);
    if (!agent) {
      return NextResponse.json(
        { error: "Specified AI Agent not found or not provisioned for this tenant." },
        { status: 404 }
      );
    }

    const aiResult = await aiOrchestrator.runAgent({
      agentName: agent.name,
      systemPrompt: agent.system_prompt,
      userMessage: message,
      conversationHistory: conversationHistory
    });

    if (userId) {
      await auditLogService.recordLog({
        tenant_id: tenantId,
        user_id: userId,
        action: "AI_AGENT_CHAT_EXECUTION",
        resource_type: "agent",
        resource_id: agentId,
        metadata: {
          prompt_tokens: aiResult.usage.prompt_tokens,
          completion_tokens: aiResult.usage.completion_tokens,
          model: aiResult.model
        }
      });
    }

    return NextResponse.json({
      success: true,
      agentId: agent.id,
      agentName: agent.name,
      reply: aiResult.reply,
      usage: aiResult.usage
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "AI Chat Execution Failed", details: error.message },
      { status: 500 }
    );
  }
}

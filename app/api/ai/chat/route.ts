import { NextRequest, NextResponse } from "next/server";
import { AIOrchestrator } from "@/lib/ai/orchestrator";
import { AgentService } from "@/services/agent-service";
import { SubscriptionService } from "@/services/subscription-service";
import { AuditLogService } from "@/services/audit-log-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenant_id, agent_id, message, conversation_history } = body;

    if (!tenant_id || !agent_id || !message) {
      return NextResponse.json(
        { error: "tenant_id, agent_id, and message are required" },
        { status: 400 }
      );
    }

    // 1. एक्टिव सब्सक्रिप्शन चेक करें
    const subscriptionService = new SubscriptionService();
    const activeSub = await subscriptionService.getActiveSubscription(tenant_id);

    if (!activeSub || activeSub.status !== "active") {
      return NextResponse.json(
        { error: "Active subscription required to access AI agents." },
        { status: 403 }
      );
    }

    // 2. एजेंट की जानकारी और सिस्टम प्रॉम्प्ट लाएं
    const agentService = new AgentService();
    const agent = await agentService.getAgentById(tenant_id, agent_id);

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found or inactive" },
        { status: 404 }
      );
    }

    // 3. सेल्फ-होस्टेड AI इनफेरेंस रन करें
    const orchestrator = new AIOrchestrator();
    const systemPrompt = agent.configuration?.system_prompt || "You are an AI workforce agent for GrowthAI.";

    const aiResponse = await orchestrator.runAgentTurn(
      {
        tenantId: tenant_id,
        agentId: agent.id as string,
        systemPrompt
      },
      conversation_history || [],
      message
    );

    // 4. ऑडिट लॉग में चैट निष्पादन रिकॉर्ड करें
    const auditLogService = new AuditLogService();
    await auditLogService.logEvent({
      tenant_id,
      event: "AI_AGENT_CHAT_EXECUTED",
      metadata: {
        agent_id: agent.id,
        agent_role: agent.role,
        tokens_used: aiResponse.usage?.total_tokens || 0
      }
    });

    return NextResponse.json(
      {
        response: aiResponse.content,
        tool_calls: aiResponse.tool_calls || null,
        usage: aiResponse.usage
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to execute AI chat" },
      { status: 500 }
    );
  }
}


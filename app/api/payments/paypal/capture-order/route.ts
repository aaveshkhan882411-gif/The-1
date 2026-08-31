import { NextRequest, NextResponse } from "next/server";
import { SubscriptionManager } from "@/lib/payments/subscription-manager";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, tenantId, planId } = body;

    if (!orderId || !tenantId || !planId) {
      return NextResponse.json(
        { error: "orderId, tenantId, and planId are required" },
        { status: 400 }
      );
    }

    const subscriptionManager = new SubscriptionManager();
    const result = await subscriptionManager.handleOrderCaptureAndActivation(
      tenantId,
      orderId,
      planId
    );

    return NextResponse.json(
      {
        message: "Payment captured and subscription activated successfully",
        subscription: result.subscription
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to capture payment and activate subscription" },
      { status: 500 }
    );
  }
}


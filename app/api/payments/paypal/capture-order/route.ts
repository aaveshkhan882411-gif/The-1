import { NextRequest, NextResponse } from "next/server";
import { subscriptionManager } from "../../../../../lib/payments/subscription-manager";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, tenantId } = body;

    if (!orderId || !tenantId) {
      return NextResponse.json(
        { error: "orderId and tenantId are required." },
        { status: 400 }
      );
    }

    const result = await subscriptionManager.captureAndActivate({
      orderId,
      tenantId
    });

    return NextResponse.json({
      success: true,
      message: "Payment captured and subscription activated.",
      data: result
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Capture Order Failed", details: error.message },
      { status: 500 }
    );
  }
}

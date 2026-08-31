import { NextRequest, NextResponse } from "next/server";
import { PayPalClient } from "@/lib/payments/paypal-client";
import { getPlan, isValidPurchasablePlan } from "@/config/plans";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, tenantId } = body;

    if (!planId || !tenantId) {
      return NextResponse.json(
        { error: "planId and tenantId are required" },
        { status: 400 }
      );
    }

    if (!isValidPurchasablePlan(planId)) {
      return NextResponse.json(
        { error: "Invalid plan or requires manual enterprise consultation" },
        { status: 400 }
      );
    }

    const plan = getPlan(planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const paypalClient = new PayPalClient();
    const order = await paypalClient.createOrder({
      plan,
      tenantId
    });

    return NextResponse.json({ orderId: order.id, links: order.links }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create PayPal order" },
      { status: 500 }
    );
  }
}

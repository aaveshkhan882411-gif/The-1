import { NextRequest, NextResponse } from "next/server";
import { paypalClient } from "../../../../../lib/payments/paypal-client";
import { GROWTHAI_PLANS } from "../../../../../config/plans";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, tenantId } = body;

    if (!planId || !tenantId) {
      return NextResponse.json(
        { error: "planId and tenantId are required." },
        { status: 400 }
      );
    }

    const plan = GROWTHAI_PLANS[planId];
    if (!plan || plan.price <= 0) {
      return NextResponse.json(
        { error: "Invalid plan selected for payment." },
        { status: 400 }
      );
    }

    const order = await paypalClient.createOrder({
      planId: plan.id,
      amount: plan.price.toString(),
      currency: "USD",
      customId: tenantId
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      links: order.links
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create PayPal order", details: error.message },
      { status: 500 }
    );
  }
}

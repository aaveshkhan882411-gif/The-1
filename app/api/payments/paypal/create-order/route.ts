import { NextRequest, NextResponse } from "next/server";
// यहाँ हमने रास्ता ठीक कर दिया है (एक एक्स्ट्रा '../' जोड़कर)
import { paypalClient } from "../../../../../lib/payments/paypal-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, amount, tenantId } = body;

    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required to create an order." }, 
        { status: 400 }
      );
    }

    const order = await paypalClient.createOrder(amount.toString(), "USD");

    return NextResponse.json({
      success: true,
      orderId: order.id || "ORDER_ID_NOT_FOUND",
      planId: planId,
      message: "PayPal Order created successfully"
    });

  } catch (error: any) {
    console.error("PayPal Create Order API Error:", error);
    return NextResponse.json(
      { error: "Failed to create PayPal order", details: error.message },
      { status: 500 }
    );
  }
}

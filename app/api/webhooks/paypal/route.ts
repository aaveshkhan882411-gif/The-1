import { NextRequest, NextResponse } from "next/server";
import { paypalClient } from "../../../../lib/payments/paypal-client";
import { subscriptionService } from "../../../../services/subscription-service";
import { auditLogService } from "../../../../services/audit-log-service";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const headersList = req.headers;

    const signatureVerification = await paypalClient.verifyWebhookSignature({
      authAlgo: headersList.get("paypal-auth-algo") || "",
      certUrl: headersList.get("paypal-cert-url") || "",
      transmissionId: headersList.get("paypal-transmission-id") || "",
      transmissionSig: headersList.get("paypal-transmission-sig") || "",
      transmissionTime: headersList.get("paypal-transmission-time") || "",
      webhookId: process.env.PAYPAL_WEBHOOK_ID || "default_webhook_id",
      eventBody: rawBody
    });

    if (!signatureVerification) {
      return NextResponse.json(
        { error: "Invalid PayPal Webhook Signature." },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event_type;
    const resource = event.resource;

    if (eventType === "PAYMENT.CAPTURE.COMPLETED" || eventType === "CHECKOUT.ORDER.APPROVED") {
      const tenantId = resource.custom_id;
      if (tenantId) {
        await subscriptionService.updateStatus(tenantId, "active");
        await auditLogService.recordLog({
          tenant_id: tenantId,
          action: "PAYPAL_WEBHOOK_ACTIVATION_SUCCESS",
          resource_type: "payment",
          resource_id: resource.id,
          metadata: { event_type: eventType }
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Webhook Processing Failed", details: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { PayPalClient } from "@/lib/payments/paypal-client";
import { SubscriptionService } from "@/services/subscription-service";
import { AuditLogService } from "@/services/audit-log-service";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;

    // 1. यदि Webhook ID कॉन्फ़िगर है, तो सिग्नेचर वेरिफाई करें
    if (webhookId) {
      const headers: Record<string, string> = {
        "paypal-transmission-id": req.headers.get("paypal-transmission-id") || "",
        "paypal-transmission-time": req.headers.get("paypal-transmission-time") || "",
        "paypal-cert-url": req.headers.get("paypal-cert-url") || "",
        "paypal-auth-algo": req.headers.get("paypal-auth-algo") || "",
        "paypal-transmission-sig": req.headers.get("paypal-transmission-sig") || ""
      };

      const paypalClient = new PayPalClient();
      const isValid = await paypalClient.verifyWebhookSignature(headers, rawBody, webhookId);

      if (!isValid) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event_type;
    const resource = event.resource;

    const subscriptionService = new SubscriptionService();
    const auditLogService = new AuditLogService();

    // 2. पेमेंट और कैंसलेशन इवेंट्स हैंडल करें
    if (eventType === "BILLING.SUBSCRIPTION.CANCELLED" || eventType === "BILLING.SUBSCRIPTION.SUSPENDED") {
      const externalId = resource.id;
      const sub = await subscriptionService.getSubscriptionByExternalId(externalId);

      if (sub) {
        await subscriptionService.updateSubscription(sub.id as string, {
          status: "canceled"
        });

        await auditLogService.logEvent({
          tenant_id: sub.tenant_id,
          event: "SUBSCRIPTION_CANCELED_WEBHOOK",
          metadata: { externalId, eventType }
        });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process PayPal webhook" },
      { status: 500 }
    );
  }
}


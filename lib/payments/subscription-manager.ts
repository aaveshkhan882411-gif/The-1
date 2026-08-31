import { SubscriptionService } from "../../services/subscription-service";
import { AuditLogService } from "../../services/audit-log-service";
import { PayPalClient, CaptureOrderResponse } from "./paypal-client";
import { getPlan } from "../../config/plans";

export class SubscriptionManager {
  private subscriptionService: SubscriptionService;
  private auditLogService: AuditLogService;
  private paypalClient: PayPalClient;

  constructor() {
    this.subscriptionService = new SubscriptionService();
    this.auditLogService = new AuditLogService();
    this.paypalClient = new PayPalClient();
  }

  private calculatePeriodEnd(billingPeriod: string): string {
    const now = new Date();
    if (billingPeriod === "trial_5_days") {
      now.setDate(now.getDate() + 5);
    } else if (billingPeriod === "trial_7_days") {
      now.setDate(now.getDate() + 7);
    } else if (billingPeriod === "annual") {
      now.setFullYear(now.getFullYear() + 1);
    } else if (billingPeriod === "membership_fixed") {
      now.setMonth(now.getMonth() + 1);
    } else {
      now.setDate(now.getDate() + 30);
    }
    return now.toISOString();
  }

  async handleOrderCaptureAndActivation(
    tenantId: string,
    orderId: string,
    planId: string
  ) {
    if (!tenantId || !orderId || !planId) {
      throw new Error("Tenant ID, Order ID, and Plan ID are required.");
    }

    const plan = getPlan(planId);
    if (!plan) {
      throw new Error(`Invalid plan specified: ${planId}`);
    }

    const captureResult: CaptureOrderResponse = await this.paypalClient.captureOrder(orderId);

    if (captureResult.status !== "COMPLETED") {
      throw new Error(`Payment not completed. Status: ${captureResult.status}`);
    }

    const now = new Date();
    const periodStart = now.toISOString();
    const periodEnd = this.calculatePeriodEnd(plan.billingPeriod);

    const existingSubscription = await this.subscriptionService.getActiveSubscription(tenantId);

    let subscriptionRecord;
    if (existingSubscription) {
      subscriptionRecord = await this.subscriptionService.updateSubscription(
        existingSubscription.id as string,
        {
          status: "active",
          plan: plan.id as any,
          current_period_start: periodStart,
          current_period_end: periodEnd,
          metadata: {
            paypal_order_id: orderId,
            plan_name: plan.name,
            agents_allowed: plan.agentsAllowed,
            captured_at: periodStart
          }
        }
      );
    } else {
      subscriptionRecord = await this.subscriptionService.createSubscription({
        tenant_id: tenantId,
        plan: plan.id as any,
        provider: "paypal",
        external_id: orderId,
        status: "active",
        current_period_start: periodStart,
        current_period_end: periodEnd,
        metadata: {
          paypal_order_id: orderId,
          plan_name: plan.name,
          agents_allowed: plan.agentsAllowed,
          payer_info: captureResult.payer || {}
        }
      });
    }

    await this.auditLogService.logEvent({
      tenant_id: tenantId,
      event: "SUBSCRIPTION_ACTIVATED_PAYPAL",
      metadata: {
        orderId,
        planId: plan.id,
        planName: plan.name,
        pricePaid: plan.price,
        status: captureResult.status
      }
    });

    return {
      success: true,
      subscription: subscriptionRecord
    };
  }
}


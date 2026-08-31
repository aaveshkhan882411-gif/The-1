import { PlanDefinition } from "../../config/plans";

export interface PayPalAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface CreateOrderParams {
  plan: PlanDefinition;
  tenantId: string;
  customId?: string;
}

export interface CaptureOrderResponse {
  id: string;
  status: "COMPLETED" | "APPROVED" | "VOIDED" | "PAYER_ACTION_REQUIRED";
  payer?: {
    payer_id?: string;
    email_address?: string;
    name?: {
      given_name?: string;
      surname?: string;
    };
  };
  purchase_units?: Array<{
    reference_id?: string;
    payments?: {
      captures?: Array<{
        id: string;
        status: string;
        amount: {
          value: string;
          currency_code: string;
        };
      }>;
    };
  }>;
}

export class PayPalClient {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;

  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID || "";
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET || "";
    const env = process.env.PAYPAL_ENVIRONMENT || "sandbox";
    this.baseUrl =
      env === "production"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";
  }

  private async getAccessToken(): Promise<string> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error("PayPal Client ID and Secret must be configured in environment variables.");
    }

    const authHeader = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64");
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PayPal OAuth failed (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as PayPalAccessTokenResponse;
    return data.access_token;
  }

  async createOrder(params: CreateOrderParams): Promise<{ id: string; status: string; links: any[] }> {
    const token = await this.getAccessToken();

    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: `${params.tenantId}:${params.plan.id}`,
          description: `GrowthAI ${params.plan.name} Subscription`,
          amount: {
            currency_code: params.plan.currency,
            value: params.plan.price.toFixed(2)
          }
        }
      ],
      application_context: {
        brand_name: "GrowthAI",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/billing/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/billing`
      }
    };

    const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderPayload)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`PayPal Create Order Error (${response.status}): ${err}`);
    }

    return await response.json();
  }

  async captureOrder(orderId: string): Promise<CaptureOrderResponse> {
    const token = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`PayPal Capture Order Error (${response.status}): ${err}`);
    }

    return await response.json();
  }

  async verifyWebhookSignature(
    headers: Record<string, string>,
    body: string,
    webhookId: string
  ): Promise<boolean> {
    const token = await this.getAccessToken();

    const verifyPayload = {
      transmission_id: headers["paypal-transmission-id"],
      transmission_time: headers["paypal-transmission-time"],
      cert_url: headers["paypal-cert-url"],
      auth_algo: headers["paypal-auth-algo"],
      transmission_sig: headers["paypal-transmission-sig"],
      webhook_id: webhookId,
      webhook_event: JSON.parse(body)
    };

    const response = await fetch(`${this.baseUrl}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(verifyPayload)
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.verification_status === "SUCCESS";
  }
}


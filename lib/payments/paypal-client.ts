const base = process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com"; 

async function generateAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.warn("PayPal API Credentials are missing in Environment Variables!");
    return "";
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const data = await response.json();
  return data.access_token;
}

export const paypalClient = {
  createOrder: async (amount: string, currency: string = "USD") => {
    try {
      const accessToken = await generateAccessToken();
      const url = `${base}/v2/checkout/orders`;
      const payload = { intent: "CAPTURE", purchase_units: [{ amount: { currency_code: currency, value: amount } }] };
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(payload),
      });
      return await response.json();
    } catch (error) {
      console.error("Failed to create PayPal Order:", error);
      throw error;
    }
  },

  verifyWebhookSignature: async (params: any): Promise<boolean> => {
    try {
      const accessToken = await generateAccessToken();
      const url = `${base}/v1/notifications/verify-webhook-signature`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      return data.verification_status === "SUCCESS";
    } catch (error) {
      console.error("PayPal Webhook Verification Error:", error);
      return false;
    }
  },
};

// यह लाइन केस-सेंसिटिव एरर को हमेशा के लिए रोक लेगी!
export const PayPalClient = paypalClient;

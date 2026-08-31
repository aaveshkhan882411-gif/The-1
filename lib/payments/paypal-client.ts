const base = process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com"; 

// 1. PayPal से Access Token जनरेट करने का फंक्शन (Internal use)
async function generateAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.warn("PayPal API Credentials are missing in Environment Variables!");
    // अगर API Key नहीं है, तो क्रैश होने से बचाने के लिए खाली स्ट्रिंग भेजें (टेस्टिंग के लिए)
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

// 2. आपका मेन PayPal Client जिसे दूसरे फाइल्स में इस्तेमाल (Export) किया गया है
export const paypalClient = {
  
  // ऑर्डर क्रिएट करने का असली फंक्शन
  createOrder: async (amount: string, currency: string = "USD") => {
    try {
      const accessToken = await generateAccessToken();
      const url = `${base}/v2/checkout/orders`;

      const payload = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount,
            },
          },
        ],
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      return await response.json();
    } catch (error) {
      console.error("Failed to create PayPal Order:", error);
      throw error;
    }
  },

  // वेबहुक (Webhook) सिग्नेचर वेरीफाई करने का असली फंक्शन
  verifyWebhookSignature: async (params: any): Promise<boolean> => {
    try {
      const accessToken = await generateAccessToken();
      const url = `${base}/v1/notifications/verify-webhook-signature`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      
      // अगर PayPal कहे "SUCCESS", तभी true रिटर्न करें
      return data.verification_status === "SUCCESS";
    } catch (error) {
      console.error("PayPal Webhook Verification Error:", error);
      return false;
    }
  },
};

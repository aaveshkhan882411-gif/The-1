// यह कोड यह सुनिश्चित करेगा कि subscriptionManager हर हाल में एक्सपोर्ट हो
export const subscriptionManager = {
  activateSubscription: async (tenantId: string) => {
    console.log(`Subscription activated for tenant: ${tenantId}`);
    return true;
  },
  cancelSubscription: async (tenantId: string) => {
    console.log(`Subscription cancelled for tenant: ${tenantId}`);
    return true;
  },
  checkStatus: async (tenantId: string) => {
    return true;
  }
};

// केस-सेंसिटिविटी से बचने के लिए कैपिटल वाला भी एक्सपोर्ट कर दिया
export const SubscriptionManager = subscriptionManager;

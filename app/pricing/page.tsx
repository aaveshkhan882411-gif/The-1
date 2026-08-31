"use client";

import React, { useState } from "react";
import { GROWTHAI_PLANS, PlanDefinition } from "@/config/plans";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [selectedBillingTab, setSelectedBillingTab] = useState<"monthly" | "annual" | "trial">("monthly");

  // डेमो टेनेंट ID (वास्तविक ऐप में यह यूजर सेशन से आता है)
  const tenantId = "tenant-prod-main";

  const handleCheckout = async (plan: PlanDefinition) => {
    if (plan.isCustomQuote) {
      window.location.href = "/contact-consultation";
      return;
    }

    try {
      setLoadingPlan(plan.id);
      const res = await fetch("/app/api/payments/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          tenantId: tenantId
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order creation failed");

      // PayPal अप्रूवल URL पर रीडायरेक्ट करें
      const approveLink = data.links?.find((l: any) => l.rel === "approve");
      if (approveLink) {
        window.location.href = approveLink.href;
      } else {
        alert("PayPal checkout initialized: " + data.orderId);
      }
    } catch (err: any) {
      alert("Checkout error: " + err.message);
    } finally {
      setLoadingPlan(null);
    }
  };

  const filteredPlans = Object.values(GROWTHAI_PLANS).filter((p) => {
    if (selectedBillingTab === "monthly") return p.billingPeriod === "monthly";
    if (selectedBillingTab === "annual") return p.billingPeriod === "annual";
    if (selectedBillingTab === "trial") return p.billingPeriod.startsWith("trial");
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
          GrowthAI Workforce Pricing
        </h1>
        <p className="mt-4 text-xl text-slate-400">
          Scale your business operations 24/7 with autonomous, domain-trained AI employees.
        </p>

        {/* टैब सेलेक्टर */}
        <div className="mt-10 flex justify-center space-x-3">
          {(["monthly", "annual", "trial"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedBillingTab(tab)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold capitalize transition-all ${
                selectedBillingTab === tab
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {tab === "monthly" ? "Core Monthly" : tab === "annual" ? "Annual (Save Big)" : "Trial Passes"}
            </button>
          ))}
        </div>

        {/* प्लान्स ग्रिड */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="relative flex flex-col justify-between p-8 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur shadow-xl hover:border-slate-700 transition"
            >
              <div>
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-5xl font-extrabold tracking-tight">${plan.price.toLocaleString()}</span>
                  <span className="ml-1 text-sm text-slate-400">
                    /{plan.billingPeriod === "annual" ? "year" : plan.billingPeriod.includes("trial") ? "flat" : "month"}
                  </span>
                </div>

                <div className="mt-4 inline-block bg-blue-500/10 text-blue-400 text-xs px-3 py-1 rounded-full font-medium">
                  {plan.agentsAllowed > 0 ? `${plan.agentsAllowed} AI Agents Included` : "Full Platform Pass"}
                </div>

                <ul className="mt-6 space-y-3 text-left text-sm text-slate-300">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <span className="text-emerald-400">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleCheckout(plan)}
                disabled={loadingPlan === plan.id}
                className={`mt-8 w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition shadow-md ${
                  plan.isCustomQuote
                    ? "bg-slate-700 hover:bg-slate-600 text-white"
                    : "bg-gradient-to-r from-blue-600 to-teal-500 hover:opacity-90 text-white"
                }`}
              >
                {loadingPlan === plan.id
                  ? "Processing..."
                  : plan.isCustomQuote
                  ? "Request Consultation"
                  : "Deploy Workforce Now"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


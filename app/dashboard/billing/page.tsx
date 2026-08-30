"use client";

import { useState } from "react";

type BillingCycle = "Monthly" | "Yearly";

const plans = [
  {
    name: "Standard",
    monthly: "$1,999",
    yearly: "$19,990",
    agents: "4 of 13",
    trial7: "$299",
    trial5: "$199",
    description: "Core AI workforce for growing businesses.",
  },
  {
    name: "Premium",
    monthly: "$2,999",
    yearly: "$35,000",
    agents: "7 of 13",
    trial7: "$500",
    trial5: "$350",
    description: "Expanded AI workforce and automation.",
  },
  {
    name: "Enterprise",
    monthly: "$3,999",
    yearly: "$45,000",
    agents: "13 of 13",
    trial7: "$699",
    trial5: "$499",
    description: "Complete 13-agent AI workforce.",
  },
];

const membership = [
  {
    name: "Monthly",
    price: "$150",
    detail: "Membership Club",
  },
  {
    name: "6-Month",
    price: "$700",
    detail: "Membership Club",
  },
  {
    name: "Annual",
    price: "$1,000",
    detail: "Membership Club",
  },
];

export default function BillingPage() {
  const [cycle, setCycle] = useState<BillingCycle>("Monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#06090F] px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
            Billing & Plans
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            Choose your AI workforce.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
            Manage your GrowthAI plan, workforce capacity, billing cycle,
            trials, and Membership Club benefits from one place.
          </p>

          {/* Billing toggle */}
          <div className="mt-7 inline-flex rounded-xl border border-white/10 bg-white/[0.025] p-1">
            {(["Monthly", "Yearly"] as BillingCycle[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCycle(item)}
                className={[
                  "rounded-lg px-5 py-2.5 text-sm font-medium transition",
                  cycle === item
                    ? "bg-white text-black"
                    : "text-white/40 hover:text-white",
                ].join(" ")}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* Current plan */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-white/25">
                Current Workspace
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                No active plan
              </h2>

              <p className="mt-1 text-sm text-white/35">
                Choose a plan below to activate your AI workforce.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3">
              <p className="text-xs text-white/30">Agents</p>
              <p className="mt-1 text-lg font-semibold">0 / 13</p>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="mt-6 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => {
            const price =
              cycle === "Monthly" ? plan.monthly : plan.yearly;

            return (
              <article
                key={plan.name}
                className="flex min-h-[520px] flex-col rounded-3xl border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.04]"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/30">
                    {plan.name}
                  </p>

                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-4xl font-semibold tracking-tight">
                      {price}
                    </span>

                    <span className="pb-1 text-xs text-white/30">
                      {cycle === "Monthly" ? "/ month" : "/ year"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-white/40">
                    {plan.description}
                  </p>
                </div>

                <div className="mt-7 space-y-3">
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                    <p className="text-xs text-white/30">
                      AI Workforce
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      {plan.agents}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                    <p className="text-xs text-white/30">
                      7-day Trial
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      {plan.trial7}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                    <p className="text-xs text-white/30">
                      5-day Trial
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      {plan.trial5}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-7">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(plan.name)}
                    className="w-full rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
                  >
                    Select {plan.name}
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {/* Membership Club */}
        <section className="mt-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
              Membership Club
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Additional membership benefits.
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Membership Club is separate from the main AI workforce
              plans and is designed for membership discounts and benefits.
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {membership.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
              >
                <p className="text-xs uppercase tracking-[0.15em] text-white/25">
                  {item.detail}
                </p>

                <h3 className="mt-3 text-lg font-semibold">
                  {item.name}
                </h3>

                <p className="mt-2 text-2xl font-semibold">
                  {item.price}
                </p>

                <button
                  type="button"
                  className="mt-5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/60 transition hover:bg-white/[0.07] hover:text-white"
                >
                  Join Membership
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Plan confirmation */}
      {selectedPlan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <section className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0a0e16] p-7 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.16em] text-white/30">
              Plan Selection
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              {selectedPlan}
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/45">
              You selected the {selectedPlan} plan on a{" "}
              {cycle.toLowerCase()} billing cycle.
            </p>

            <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
              <p className="text-xs text-white/30">
                Next step
              </p>

              <p className="mt-2 text-sm leading-6 text-white/50">
                The secure checkout and payment verification system will
                process your subscription before activating the selected
                AI workforce.
              </p>
            </div>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="flex-1 rounded-xl border border-white/10 px-5 py-3 text-sm text-white/50 hover:bg-white/[0.05] hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="flex-1 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
              >
                Continue
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

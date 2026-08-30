"use client";

import { useState } from "react";

type Webhook = {
  id: number;
  name: string;
  endpoint: string;
  event: string;
  active: boolean;
};

const initialWebhooks: Webhook[] = [
  {
    id: 1,
    name: "Lead Created",
    endpoint: "/api/webhooks/leads",
    event: "lead.created",
    active: true,
  },
  {
    id: 2,
    name: "Payment Completed",
    endpoint: "/api/webhooks/payments",
    event: "payment.completed",
    active: true,
  },
  {
    id: 3,
    name: "Appointment Updated",
    endpoint: "/api/webhooks/appointments",
    event: "appointment.updated",
    active: false,
  },
];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] =
    useState<Webhook[]>(initialWebhooks);

  const activeCount = webhooks.filter(
    (webhook) => webhook.active
  ).length;

  function toggleWebhook(id: number) {
    setWebhooks((current) =>
      current.map((webhook) =>
        webhook.id === id
          ? { ...webhook, active: !webhook.active }
          : webhook
      )
    );
  }

  return (
    <main className="min-h-screen bg-[#06090F] px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
            Webhooks
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            Real-time business events.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
            Manage the event endpoints that allow GrowthAI to
            communicate with connected business systems in real time.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-xs text-white/30">Total Webhooks</p>
              <p className="mt-1 text-lg font-semibold">
                {webhooks.length}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-xs text-white/30">Active</p>
              <p className="mt-1 text-lg font-semibold">
                {activeCount}
              </p>
            </div>
          </div>
        </section>

        {/* Webhook list */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
          <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-base font-semibold">
                Event endpoints
              </h2>

              <p className="mt-1 text-xs text-white/30">
                Control which webhook workflows are active.
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:-translate-y-0.5"
            >
              Add Webhook
            </button>
          </div>

          <div>
            {webhooks.map((webhook) => (
              <article
                key={webhook.id}
                className="border-b border-white/[0.06] p-5 last:border-b-0 sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-sm font-semibold">
                        {webhook.name}
                      </h3>

                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/30">
                        {webhook.event}
                      </span>
                    </div>

                    <p className="mt-3 break-all font-mono text-xs text-white/35">
                      {webhook.endpoint}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={
                        webhook.active
                          ? "text-xs text-white/60"
                          : "text-xs text-white/25"
                      }
                    >
                      {webhook.active ? "Active" : "Disabled"}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleWebhook(webhook.id)}
                      aria-pressed={webhook.active}
                      className={[
                        "relative h-6 w-11 shrink-0 rounded-full border transition",
                        webhook.active
                          ? "border-white/20 bg-white"
                          : "border-white/10 bg-white/[0.05]",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "absolute top-1 h-4 w-4 rounded-full transition",
                          webhook.active
                            ? "left-6 bg-black"
                            : "left-1 bg-white/30",
                        ].join(" ")}
                      />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Event types */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/25">
            Supported Events
          </p>

          <h2 className="mt-2 text-lg font-semibold">
            GrowthAI event architecture
          </h2>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              "lead.created",
              "lead.updated",
              "payment.completed",
              "payment.failed",
              "appointment.created",
              "appointment.updated",
              "agent.activity",
              "integration.connected",
            ].map((event) => (
              <span
                key={event}
                className="rounded-lg border border-white/10 bg-white/[0.025] px-3 py-2 font-mono text-xs text-white/45"
              >
                {event}
              </span>
            ))}
          </div>
        </section>

        {/* Security */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/25">
            Security
          </p>

          <h2 className="mt-2 text-lg font-semibold">
            Verify every incoming event.
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
            The production webhook layer will validate signatures,
            authenticate event sources, prevent replay attacks, and
            safely process each event before it reaches GrowthAI
            workflows.
          </p>
        </section>
      </div>
    </main>
  );
}

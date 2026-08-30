"use client";

import { useMemo, useState } from "react";

type Metric = {
  label: string;
  value: string;
  change: string;
  description: string;
};

const metrics: Metric[] = [
  {
    label: "Leads Captured",
    value: "1,284",
    change: "+18.4%",
    description: "Qualified and captured leads",
  },
  {
    label: "AI Conversations",
    value: "3,842",
    change: "+24.7%",
    description: "Customer conversations handled",
  },
  {
    label: "Appointments",
    value: "326",
    change: "+12.8%",
    description: "Appointments generated",
  },
  {
    label: "Response Rate",
    value: "94.6%",
    change: "+6.2%",
    description: "AI response performance",
  },
];

const activity = [
  { name: "AI Sales", value: 428, percentage: 86 },
  { name: "AI Receptionist", value: 361, percentage: 72 },
  { name: "AI Follow-up", value: 297, percentage: 59 },
  { name: "AI Appointment", value: 198, percentage: 40 },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState("30D");

  const totalActivity = useMemo(
    () => activity.reduce((sum, item) => sum + item.value, 0),
    []
  );

  return (
    <main className="min-h-screen bg-[#06090F] px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                Analytics
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                See what your AI workforce is doing.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
                Monitor leads, conversations, appointments, response
                performance, and AI workforce activity from one place.
              </p>
            </div>

            <div className="flex rounded-xl border border-white/10 bg-white/[0.025] p-1">
              {["7D", "30D", "90D"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRange(item)}
                  className={[
                    "rounded-lg px-4 py-2 text-xs font-semibold transition",
                    range === item
                      ? "bg-white text-black"
                      : "text-white/35 hover:text-white",
                  ].join(" ")}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
            >
              <p className="text-xs text-white/35">{metric.label}</p>

              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold tracking-tight">
                  {metric.value}
                </p>

                <span className="text-xs font-medium text-white/50">
                  {metric.change}
                </span>
              </div>

              <p className="mt-3 text-xs text-white/25">
                {metric.description}
              </p>
            </article>
          ))}
        </section>

        {/* Performance */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <article className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-white/25">
                  Performance
                </p>

                <h2 className="mt-2 text-lg font-semibold">
                  Lead activity
                </h2>
              </div>

              <span className="text-xs text-white/30">{range}</span>
            </div>

            <div className="mt-8 flex h-64 items-end gap-2 sm:gap-3">
              {[38, 52, 44, 67, 58, 73, 64, 81, 69, 88, 76, 94].map(
                (height, index) => (
                  <div
                    key={index}
                    className="flex h-full flex-1 items-end"
                  >
                    <div
                      className="w-full rounded-t-lg bg-white/[0.12] transition hover:bg-white/[0.22]"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                )
              )}
            </div>

            <div className="mt-4 flex justify-between text-[10px] uppercase tracking-wider text-white/20">
              <span>Earlier</span>
              <span>Today</span>
            </div>
          </article>

          {/* Workforce */}
          <article className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-white/25">
              AI Workforce
            </p>

            <div className="mt-2 flex items-end justify-between">
              <h2 className="text-lg font-semibold">Agent activity</h2>

              <span className="text-xs text-white/30">
                {totalActivity.toLocaleString()} actions
              </span>
            </div>

            <div className="mt-7 space-y-5">
              {activity.map((agent) => (
                <div key={agent.name}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-white/55">
                      {agent.name}
                    </span>

                    <span className="text-xs text-white/25">
                      {agent.value}
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-white/[0.35]"
                      style={{ width: `${agent.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        {/* Revenue & ROI */}
        <section className="mt-6 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-white/25">
              Revenue Impact
            </p>

            <p className="mt-4 text-3xl font-semibold">$84,620</p>

            <p className="mt-2 text-xs leading-5 text-white/30">
              Estimated revenue influenced by GrowthAI workflows.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-white/25">
              Missed Revenue Audit
            </p>

            <p className="mt-4 text-3xl font-semibold">$12,480</p>

            <p className="mt-2 text-xs leading-5 text-white/30">
              Potential revenue identified from missed or delayed leads.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-white/25">
              Workforce ROI
            </p>

            <p className="mt-4 text-3xl font-semibold">8.4×</p>

            <p className="mt-2 text-xs leading-5 text-white/30">
              Estimated return generated relative to workforce cost.
            </p>
          </article>
        </section>

        {/* Status */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-white/25">
                System Status
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                GrowthAI workforce is operating normally.
              </h2>

              <p className="mt-2 text-sm text-white/35">
                Detailed analytics will be connected to real workspace
                data in the backend analytics layer.
              </p>
            </div>

            <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/50">
              Operational
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}

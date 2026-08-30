"use client";

import { useMemo, useState } from "react";

type Report = {
  id: number;
  name: string;
  category: string;
  period: string;
  status: "Ready" | "Processing";
  updated: string;
};

const reports: Report[] = [
  {
    id: 1,
    name: "Revenue Performance",
    category: "Revenue",
    period: "Last 30 days",
    status: "Ready",
    updated: "8 min ago",
  },
  {
    id: 2,
    name: "Lead Conversion",
    category: "Sales",
    period: "Last 30 days",
    status: "Ready",
    updated: "21 min ago",
  },
  {
    id: 3,
    name: "AI Workforce Performance",
    category: "AI Workforce",
    period: "This month",
    status: "Ready",
    updated: "46 min ago",
  },
  {
    id: 4,
    name: "Customer Engagement",
    category: "Engagement",
    period: "This month",
    status: "Processing",
    updated: "1 hr ago",
  },
];

const categories = ["All", "Revenue", "Sales", "AI Workforce", "Engagement"];

export default function ReportsPage() {
  const [category, setCategory] = useState("All");

  const filteredReports = useMemo(() => {
    if (category === "All") return reports;

    return reports.filter((report) => report.category === category);
  }, [category]);

  return (
    <main className="min-h-screen bg-[#06090F] px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                Reports & Insights
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                Know what your AI workforce is really doing.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
                Turn conversations, leads, appointments, CRM activity,
                and revenue signals into actionable business insights.
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
            >
              Generate Report
            </button>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Revenue Generated", "$486K"],
            ["Leads Converted", "18.7%"],
            ["AI Conversations", "12.8K"],
            ["Estimated ROI", "6.4×"],
          ].map(([label, value]) => (
            <article
              key={label}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
            >
              <p className="text-xs text-white/30">{label}</p>
              <p className="mt-2 text-3xl font-semibold">{value}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">Performance Overview</h2>
              <p className="mt-1 text-xs text-white/30">
                AI-generated business performance snapshot.
              </p>
            </div>

            <div className="flex overflow-x-auto rounded-xl border border-white/10 p-1">
              {["7D", "30D", "90D", "1Y"].map((period, index) => (
                <button
                  key={period}
                  type="button"
                  className={[
                    "rounded-lg px-4 py-2 text-xs font-semibold",
                    index === 1
                      ? "bg-white text-black"
                      : "text-white/35 hover:text-white",
                  ].join(" ")}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex h-56 items-end gap-2">
            {[42, 55, 48, 68, 61, 76, 70, 84, 73, 91, 82, 96].map(
              (height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-lg bg-white/[0.10] transition hover:bg-white/[0.18]"
                  style={{ height: `${height}%` }}
                />
              ),
            )}
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">Available Reports</h2>
              <p className="mt-1 text-xs text-white/30">
                Business intelligence generated from your GrowthAI data.
              </p>
            </div>

            <div className="flex overflow-x-auto rounded-xl border border-white/10 p-1">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={[
                    "whitespace-nowrap rounded-lg px-3 py-2 text-[10px] font-semibold",
                    category === item
                      ? "bg-white text-black"
                      : "text-white/35 hover:text-white",
                  ].join(" ")}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {filteredReports.map((report) => (
              <article
                key={report.id}
                className="flex flex-col gap-4 px-6 py-6 transition hover:bg-white/[0.025] sm:flex-row sm:items-center"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <span className="text-xs font-semibold">R</span>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold">{report.name}</h3>

                  <p className="mt-1 text-xs text-white/35">
                    {report.category} · {report.period}
                  </p>

                  <p className="mt-2 text-[10px] uppercase tracking-wider text-white/20">
                    Updated {report.updated}
                  </p>
                </div>

                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-wider text-white/45">
                  {report.status}
                </span>

                <button
                  type="button"
                  disabled={report.status !== "Ready"}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-xs text-white/55 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  View Report
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

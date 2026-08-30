"use client";

import Link from "next/link";
import { useState } from "react";

const stats = [
  {
    label: "Active Agents",
    value: "0",
    detail: "Ready to deploy",
  },
  {
    label: "Leads Captured",
    value: "0",
    detail: "This month",
  },
  {
    label: "Conversations",
    value: "0",
    detail: "AI handled",
  },
  {
    label: "Appointments",
    value: "0",
    detail: "Booked",
  },
];

const workforce = [
  {
    name: "AI Sales",
    description: "Lead qualification and sales conversations",
  },
  {
    name: "AI Receptionist",
    description: "Customer greeting and first-response handling",
  },
  {
    name: "AI Follow-up",
    description: "Automated lead follow-ups and re-engagement",
  },
  {
    name: "AI Appointment",
    description: "Appointment scheduling and coordination",
  },
];

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#06090F] text-white">
      {/* Top navigation */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#06090F]/80 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight"
          >
            Growth<span className="text-white/40">AI</span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-white"
            >
              Dashboard
            </Link>

            <Link
              href="/agents"
              className="text-sm text-white/45 transition hover:text-white"
            >
              Agents
            </Link>

            <Link
              href="/pricing"
              className="text-sm text-white/45 transition hover:text-white"
            >
              Pricing
            </Link>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-xs font-semibold transition hover:bg-white/[0.09]"
              aria-label="Open account menu"
              aria-expanded={menuOpen}
            >
              AI
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 w-48 rounded-xl border border-white/10 bg-[#0a0e16] p-2 shadow-2xl">
                <Link
                  href="/dashboard/settings"
                  className="block rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/[0.05] hover:text-white"
                >
                  Settings
                </Link>

                <Link
                  href="/"
                  className="block rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/[0.05] hover:text-white"
                >
                  Sign out
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Dashboard content */}
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        {/* Welcome */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-32 h-72 w-72 rounded-full bg-white/[0.035] blur-[100px]"
          />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Command Center
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
              Your AI workforce.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
              Manage your agents, conversations, leads, workflows, and
              business intelligence from one central workspace.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/agents"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
              >
                Hire an AI Agent
              </Link>

              <button
                type="button"
                className="rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-medium text-white/65 transition hover:bg-white/[0.07] hover:text-white"
              >
                View Activity
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
            >
              <p className="text-xs uppercase tracking-[0.15em] text-white/30">
                {stat.label}
              </p>

              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-white/35">
                {stat.detail}
              </p>
            </article>
          ))}
        </section>

        {/* Main workspace */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Workforce */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-white/30">
                  Workforce
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  AI employees
                </h2>
              </div>

              <Link
                href="/agents"
                className="text-xs font-medium text-white/50 transition hover:text-white"
              >
                View all
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              {workforce.map((agent) => (
                <div
                  key={agent.name}
                  className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition hover:bg-white/[0.045]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-xs font-semibold">
                    AI
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium">
                      {agent.name}
                    </h3>

                    <p className="mt-1 truncate text-xs text-white/35">
                      {agent.description}
                    </p>
                  </div>

                  <span className="hidden rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/35 sm:block">
                    Ready
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI assistant */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <p className="text-xs uppercase tracking-[0.15em] text-white/30">
              GrowthAI Assistant
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              What would you like to do?
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/40">
              Your AI assistant will help you manage your workforce,
              pricing, agents, workflows, and business operations.
            </p>

            <div className="mt-6 space-y-2">
              {[
                "Hire an AI agent",
                "Review my leads",
                "Create a workflow",
                "Check my plan",
              ].map((action) => (
                <button
                  key={action}
                  type="button"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-left text-sm text-white/55 transition hover:bg-white/[0.06] hover:text-white"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Activity */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-white/30">
              Recent Activity
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Your workspace activity
            </h2>
          </div>

          <div className="mt-6 flex min-h-32 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.015]">
            <p className="text-sm text-white/30">
              No activity yet. Your AI workforce activity will appear here.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

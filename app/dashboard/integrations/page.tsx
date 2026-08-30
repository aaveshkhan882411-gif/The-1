"use client";

import { useState } from "react";

type Integration = {
  name: string;
  description: string;
  category: string;
};

const integrations: Integration[] = [
  {
    name: "Business Website",
    description:
      "Connect your website so GrowthAI can power your approved customer workflows.",
    category: "Core",
  },
  {
    name: "CRM",
    description:
      "Connect your customer data and keep leads, contacts, and activities synchronized.",
    category: "Business",
  },
  {
    name: "Calendar",
    description:
      "Allow your AI appointment agent to work with your scheduling workflow.",
    category: "Business",
  },
  {
    name: "Email",
    description:
      "Connect business email workflows for AI-assisted communication and follow-ups.",
    category: "Communication",
  },
  {
    name: "WhatsApp",
    description:
      "Prepare WhatsApp communication workflows for your AI workforce.",
    category: "Communication",
  },
  {
    name: "API",
    description:
      "Connect your existing business software through a secure API workflow.",
    category: "Developer",
  },
];

export default function IntegrationsPage() {
  const [connected, setConnected] = useState<string[]>([]);

  function toggleIntegration(name: string) {
    setConnected((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    );
  }

  return (
    <main className="min-h-screen bg-[#06090F] px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
            Integrations
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            Connect your business systems.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
            Connect GrowthAI with the systems your business already uses.
            Your AI workforce can then operate through the approved
            connections in your workspace.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-xs text-white/30">Available</p>
              <p className="mt-1 text-lg font-semibold">
                {integrations.length}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-xs text-white/30">Connected</p>
              <p className="mt-1 text-lg font-semibold">
                {connected.length}
              </p>
            </div>
          </div>
        </section>

        {/* Connection cards */}
        <section className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => {
            const isConnected = connected.includes(integration.name);

            return (
              <article
                key={integration.name}
                className="flex min-h-[260px] flex-col rounded-3xl border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <span className="text-xs font-semibold tracking-wider">
                      {integration.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-wider text-white/30">
                    {integration.category}
                  </span>
                </div>

                <h2 className="mt-6 text-lg font-semibold">
                  {integration.name}
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  {integration.description}
                </p>

                <div className="mt-auto pt-6">
                  <button
                    type="button"
                    onClick={() => toggleIntegration(integration.name)}
                    className={[
                      "w-full rounded-xl px-5 py-3 text-sm font-semibold transition",
                      isConnected
                        ? "border border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.07] hover:text-white"
                        : "bg-white text-black hover:-translate-y-0.5",
                    ].join(" ")}
                  >
                    {isConnected ? "Connected" : "Connect"}
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {/* Security notice */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/25">
            Connection Security
          </p>

          <h2 className="mt-2 text-lg font-semibold">
            Your connections stay under your workspace controls.
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
            Only integrations that you explicitly connect should be
            available to your AI workforce. Real authentication,
            permissions, encrypted credentials, webhook handling, and
            connection verification will be wired into the backend
            integration layer.
          </p>
        </section>
      </div>
    </main>
  );
}

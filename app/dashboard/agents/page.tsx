"use client";

import { useMemo, useState } from "react";

type Agent = {
  id: string;
  name: string;
  role: string;
  description: string;
  category: string;
  status: "Available" | "Coming Soon";
};

const agents: Agent[] = [
  {
    id: "sales",
    name: "AI Sales",
    role: "Sales Employee",
    description:
      "Qualifies leads, handles sales conversations, answers objections, and helps move prospects toward conversion.",
    category: "Sales",
    status: "Available",
  },
  {
    id: "receptionist",
    name: "AI Receptionist",
    role: "Front Desk Employee",
    description:
      "Greets customers, answers common questions, collects information, and routes conversations.",
    category: "Customer",
    status: "Available",
  },
  {
    id: "voice",
    name: "AI Voice",
    role: "Voice Employee",
    description:
      "Handles voice-based customer conversations and can support inbound and outbound workflows.",
    category: "Communication",
    status: "Available",
  },
  {
    id: "support",
    name: "AI Support",
    role: "Support Employee",
    description:
      "Provides customer support, resolves common issues, and keeps conversations organized.",
    category: "Customer",
    status: "Available",
  },
  {
    id: "followup",
    name: "AI Follow-up",
    role: "Follow-up Employee",
    description:
      "Automatically follows up with leads and customers according to your configured workflow.",
    category: "Sales",
    status: "Available",
  },
  {
    id: "appointment",
    name: "AI Appointment",
    role: "Appointment Employee",
    description:
      "Handles appointment requests, scheduling conversations, reminders, and booking workflows.",
    category: "Operations",
    status: "Available",
  },
  {
    id: "crm",
    name: "AI CRM",
    role: "CRM Employee",
    description:
      "Organizes customer information and keeps your business records synchronized with conversations.",
    category: "Operations",
    status: "Available",
  },
  {
    id: "email",
    name: "AI Email",
    role: "Email Employee",
    description:
      "Assists with customer emails, follow-ups, responses, and business communication workflows.",
    category: "Communication",
    status: "Available",
  },
  {
    id: "whatsapp",
    name: "AI WhatsApp",
    role: "WhatsApp Employee",
    description:
      "Handles customer conversations and automated workflows through WhatsApp.",
    category: "Communication",
    status: "Available",
  },
  {
    id: "review",
    name: "AI Review Manager",
    role: "Reputation Employee",
    description:
      "Helps manage customer feedback, review requests, and reputation workflows.",
    category: "Customer",
    status: "Available",
  },
  {
    id: "analytics",
    name: "AI Analytics",
    role: "Analytics Employee",
    description:
      "Turns business activity into useful insights, performance metrics, and revenue intelligence.",
    category: "Intelligence",
    status: "Available",
  },
  {
    id: "workflow",
    name: "AI Workflow",
    role: "Automation Employee",
    description:
      "Connects business actions into automated workflows and operational processes.",
    category: "Automation",
    status: "Available",
  },
  {
    id: "ceo",
    name: "AI CEO",
    role: "Executive Employee",
    description:
      "Provides high-level business intelligence and helps coordinate the AI workforce.",
    category: "Leadership",
    status: "Available",
  },
];

const categories = [
  "All",
  "Sales",
  "Customer",
  "Communication",
  "Operations",
  "Intelligence",
  "Automation",
  "Leadership",
];

export default function AgentsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const filteredAgents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return agents.filter((agent) => {
      const categoryMatch =
        activeCategory === "All" ||
        agent.category === activeCategory;

      const searchMatch =
        !query ||
        agent.name.toLowerCase().includes(query) ||
        agent.role.toLowerCase().includes(query) ||
        agent.description.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  return (
    <main className="min-h-screen bg-[#06090F] px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/[0.035] blur-[110px]"
          />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
              AI Workforce
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
              Build your workforce.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
              Choose the AI employees you need for your business. Each
              agent is designed for a specific business function and can
              become part of your automated workforce.
            </p>
          </div>
        </section>

        {/* Search */}
        <section className="mt-6">
          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search AI employees..."
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.025] px-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-white/20 focus:bg-white/[0.04]"
              aria-label="Search AI employees"
            />
          </div>
        </section>

        {/* Categories */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const active = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={[
                  "whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition",
                  active
                    ? "border-white/20 bg-white text-black"
                    : "border-white/10 bg-white/[0.025] text-white/45 hover:bg-white/[0.06] hover:text-white",
                ].join(" ")}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Agent count */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-white/25">
              Available Workforce
            </p>

            <p className="mt-1 text-sm text-white/45">
              {filteredAgents.length} of {agents.length} AI employees
            </p>
          </div>
        </div>

        {/* Agent grid */}
        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredAgents.map((agent) => (
            <article
              key={agent.id}
              className="group flex min-h-[290px] flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.045]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-xs font-semibold tracking-wider">
                  AI
                </div>

                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/35">
                  {agent.status}
                </span>
              </div>

              <div className="mt-5">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
                  {agent.category}
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {agent.name}
                </h2>

                <p className="mt-1 text-xs text-white/35">
                  {agent.role}
                </p>

                <p className="mt-4 text-sm leading-6 text-white/40">
                  {agent.description}
                </p>
              </div>

              <div className="mt-auto pt-6">
                <button
                  type="button"
                  onClick={() => setSelectedAgent(agent)}
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  View & Hire
                </button>
              </div>
            </article>
          ))}
        </section>

        {filteredAgents.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
            <p className="text-sm text-white/40">
              No AI employees match your search.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-4 text-xs text-white/60 underline underline-offset-4 hover:text-white"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Agent detail modal */}
      {selectedAgent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="agent-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedAgent(null);
            }
          }}
        >
          <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0a0e16] p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-white/30">
                  {selectedAgent.category}
                </p>

                <h2
                  id="agent-modal-title"
                  className="mt-2 text-2xl font-semibold"
                >
                  {selectedAgent.name}
                </h2>

                <p className="mt-1 text-sm text-white/35">
                  {selectedAgent.role}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAgent(null)}
                className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/40 hover:bg-white/[0.06] hover:text-white"
                aria-label="Close agent details"
              >
                Close
              </button>
            </div>

            <p className="mt-6 text-sm leading-7 text-white/50">
              {selectedAgent.description}
            </p>

            <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-white/25">
                Workforce deployment
              </p>

              <p className="mt-2 text-sm leading-6 text-white/45">
                Your plan, agent limits, billing status, and deployment
                permissions will be checked automatically before the
                agent is activated.
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setSelectedAgent(null)}
                className="flex-1 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
              >
                Continue to Hire
              </button>

              <button
                type="button"
                onClick={() => setSelectedAgent(null)}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white/50 hover:bg-white/[0.05] hover:text-white"
              >
                Cancel
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

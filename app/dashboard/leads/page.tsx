"use client";

import { useMemo, useState } from "react";

type LeadStatus = "New" | "Qualified" | "Contacted" | "Converted";

type Lead = {
  id: number;
  name: string;
  company: string;
  email: string;
  source: string;
  agent: string;
  status: LeadStatus;
  value: string;
  time: string;
};

const leads: Lead[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "Johnson Properties",
    email: "sarah@example.com",
    source: "Website",
    agent: "AI Sales",
    status: "Qualified",
    value: "$12,500",
    time: "8 min ago",
  },
  {
    id: 2,
    name: "Michael Carter",
    company: "Carter Digital",
    email: "michael@example.com",
    source: "WhatsApp",
    agent: "AI Receptionist",
    status: "New",
    value: "$8,000",
    time: "21 min ago",
  },
  {
    id: 3,
    name: "Emma Williams",
    company: "Williams Group",
    email: "emma@example.com",
    source: "Referral",
    agent: "AI Sales",
    status: "Contacted",
    value: "$18,400",
    time: "46 min ago",
  },
  {
    id: 4,
    name: "Daniel Brown",
    company: "Brown Commerce",
    email: "daniel@example.com",
    source: "Website",
    agent: "AI Follow-up",
    status: "Converted",
    value: "$25,000",
    time: "1 hr ago",
  },
  {
    id: 5,
    name: "Olivia Davis",
    company: "Davis Consulting",
    email: "olivia@example.com",
    source: "LinkedIn",
    agent: "AI Sales",
    status: "New",
    value: "$6,500",
    time: "2 hrs ago",
  },
];

const filters = ["All", "New", "Qualified", "Contacted", "Converted"] as const;

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<(typeof filters)[number]>("All");

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        !query ||
        lead.name.toLowerCase().includes(query) ||
        lead.company.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.agent.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" || lead.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <main className="min-h-screen bg-[#06090F] px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                Lead Intelligence
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                Turn conversations into customers.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
                Capture, qualify, track, and convert leads generated
                by your AI workforce.
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
            >
              Add Lead
            </button>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total Leads", "2,486"],
            ["New Leads", "184"],
            ["Qualified", "742"],
            ["Conversion Rate", "18.7%"],
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

        <section className="mt-6 flex flex-col gap-3 lg:flex-row">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search leads, companies or agents..."
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20"
          />

          <div className="flex overflow-x-auto rounded-xl border border-white/10 bg-white/[0.025] p-1">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={[
                  "whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-semibold transition",
                  filter === item
                    ? "bg-white text-black"
                    : "text-white/35 hover:text-white",
                ].join(" ")}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
          <div className="border-b border-white/[0.07] px-6 py-5">
            <h2 className="text-sm font-semibold">Lead Pipeline</h2>
            <p className="mt-1 text-xs text-white/30">
              Leads captured across your AI-powered channels.
            </p>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {filteredLeads.map((lead) => (
              <article
                key={lead.id}
                className="flex flex-col gap-5 px-6 py-6 transition hover:bg-white/[0.025] lg:flex-row lg:items-center"
              >
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <span className="text-xs font-semibold">
                      {lead.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">
                      {lead.name}
                    </h3>

                    <p className="mt-1 text-xs text-white/35">
                      {lead.company} · {lead.email}
                    </p>

                    <p className="mt-2 text-[10px] uppercase tracking-wider text-white/20">
                      {lead.source} · {lead.agent} · {lead.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {lead.value}
                    </p>

                    <p className="mt-1 text-[10px] uppercase tracking-wider text-white/25">
                      Estimated value
                    </p>
                  </div>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-wider text-white/45">
                    {lead.status}
                  </span>

                  <button
                    type="button"
                    className="rounded-xl border border-white/10 px-4 py-2.5 text-xs text-white/55 transition hover:bg-white/[0.07] hover:text-white"
                  >
                    View
                  </button>
                </div>
              </article>
            ))}

            {filteredLeads.length === 0 && (
              <div className="px-6 py-16 text-center text-sm text-white/35">
                No leads match your search or filter.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";

type CustomerStatus = "Active" | "Prospect" | "At Risk" | "Customer";

type Customer = {
  id: number;
  name: string;
  company: string;
  email: string;
  source: string;
  owner: string;
  status: CustomerStatus;
  value: string;
  lastActivity: string;
};

const customers: Customer[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "Johnson Properties",
    email: "sarah@example.com",
    source: "Website",
    owner: "AI Sales",
    status: "Customer",
    value: "$25,000",
    lastActivity: "8 min ago",
  },
  {
    id: 2,
    name: "Michael Carter",
    company: "Carter Digital",
    email: "michael@example.com",
    source: "WhatsApp",
    owner: "AI Receptionist",
    status: "Prospect",
    value: "$12,500",
    lastActivity: "21 min ago",
  },
  {
    id: 3,
    name: "Emma Williams",
    company: "Williams Group",
    email: "emma@example.com",
    source: "Referral",
    owner: "AI Sales",
    status: "Active",
    value: "$18,400",
    lastActivity: "46 min ago",
  },
  {
    id: 4,
    name: "Daniel Brown",
    company: "Brown Commerce",
    email: "daniel@example.com",
    source: "Website",
    owner: "AI Follow-up",
    status: "Customer",
    value: "$32,000",
    lastActivity: "1 hr ago",
  },
  {
    id: 5,
    name: "Olivia Davis",
    company: "Davis Consulting",
    email: "olivia@example.com",
    source: "LinkedIn",
    owner: "AI Sales",
    status: "At Risk",
    value: "$9,800",
    lastActivity: "2 hrs ago",
  },
];

const filters = ["All", "Customer", "Active", "Prospect", "At Risk"] as const;

export default function CRMPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<(typeof filters)[number]>("All");

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        !query ||
        customer.name.toLowerCase().includes(query) ||
        customer.company.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.owner.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" || customer.status === filter;

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
                Customer Relationship Management
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                One customer record. Every interaction.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
                Keep leads, conversations, appointments, activities,
                and customer value connected in one CRM workspace.
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
            >
              Add Customer
            </button>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total Contacts", "3,842"],
            ["Active Customers", "1,284"],
            ["Pipeline Value", "$486K"],
            ["Retention", "96.4%"],
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
            placeholder="Search contacts, companies or agents..."
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
            <h2 className="text-sm font-semibold">Customer Database</h2>
            <p className="mt-1 text-xs text-white/30">
              Unified customer records managed by GrowthAI.
            </p>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {filteredCustomers.map((customer) => (
              <article
                key={customer.id}
                className="flex flex-col gap-5 px-6 py-6 transition hover:bg-white/[0.025] lg:flex-row lg:items-center"
              >
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <span className="text-xs font-semibold">
                      {customer.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">
                      {customer.name}
                    </h3>

                    <p className="mt-1 text-xs text-white/35">
                      {customer.company} · {customer.email}
                    </p>

                    <p className="mt-2 text-[10px] uppercase tracking-wider text-white/20">
                      {customer.source} · {customer.owner} ·{" "}
                      {customer.lastActivity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {customer.value}
                    </p>

                    <p className="mt-1 text-[10px] uppercase tracking-wider text-white/25">
                      Customer value
                    </p>
                  </div>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-wider text-white/45">
                    {customer.status}
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

            {filteredCustomers.length === 0 && (
              <div className="px-6 py-16 text-center text-sm text-white/35">
                No customers match your search or filter.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

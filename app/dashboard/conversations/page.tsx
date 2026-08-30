"use client";

import { useMemo, useState } from "react";

type Conversation = {
  id: number;
  customer: string;
  channel: "Website" | "WhatsApp" | "Voice" | "Email";
  agent: string;
  preview: string;
  time: string;
  status: "Active" | "Waiting" | "Resolved";
};

const conversations: Conversation[] = [
  {
    id: 1,
    customer: "Sarah Johnson",
    channel: "Website",
    agent: "AI Sales",
    preview: "I'm interested in your premium package.",
    time: "2 min ago",
    status: "Active",
  },
  {
    id: 2,
    customer: "Michael Carter",
    channel: "WhatsApp",
    agent: "AI Receptionist",
    preview: "Can I schedule a call for tomorrow?",
    time: "8 min ago",
    status: "Waiting",
  },
  {
    id: 3,
    customer: "Emma Williams",
    channel: "Voice",
    agent: "AI Voice",
    preview: "Customer requested pricing information.",
    time: "14 min ago",
    status: "Active",
  },
  {
    id: 4,
    customer: "Daniel Brown",
    channel: "Email",
    agent: "AI Follow-up",
    preview: "Following up regarding the proposal.",
    time: "31 min ago",
    status: "Resolved",
  },
  {
    id: 5,
    customer: "Olivia Davis",
    channel: "Website",
    agent: "AI Support",
    preview: "I need help with my account.",
    time: "42 min ago",
    status: "Waiting",
  },
  {
    id: 6,
    customer: "James Wilson",
    channel: "WhatsApp",
    agent: "AI Sales",
    preview: "What is included in the Enterprise plan?",
    time: "1 hr ago",
    status: "Resolved",
  },
];

const filters = ["All", "Active", "Waiting", "Resolved"] as const;

export default function ConversationsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<(typeof filters)[number]>("All");

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const matchesSearch =
        !query ||
        conversation.customer.toLowerCase().includes(query) ||
        conversation.agent.toLowerCase().includes(query) ||
        conversation.preview.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" || conversation.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <main className="min-h-screen bg-[#06090F] px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                Conversations
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                Every customer conversation.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
                Monitor AI conversations across your connected
                channels, agents, and customer workflows.
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
            >
              New Conversation
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <p className="text-xs text-white/30">Total Conversations</p>
            <p className="mt-2 text-3xl font-semibold">1,284</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <p className="text-xs text-white/30">Active Now</p>
            <p className="mt-2 text-3xl font-semibold">42</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <p className="text-xs text-white/30">Resolution Rate</p>
            <p className="mt-2 text-3xl font-semibold">94.8%</p>
          </article>
        </section>

        {/* Search + filters */}
        <section className="mt-6 flex flex-col gap-3 lg:flex-row">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search conversations, customers or agents..."
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

        {/* Conversations */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
          <div className="border-b border-white/[0.07] px-6 py-5">
            <h2 className="text-sm font-semibold">
              Recent Conversations
            </h2>
            <p className="mt-1 text-xs text-white/30">
              AI-powered customer interactions across your workforce.
            </p>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {filteredConversations.map((conversation) => (
              <article
                key={conversation.id}
                className="flex flex-col gap-5 px-6 py-6 transition hover:bg-white/[0.025] lg:flex-row lg:items-center"
              >
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <span className="text-xs font-semibold">
                      {conversation.customer
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold">
                        {conversation.customer}
                      </h3>

                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-white/35">
                        {conversation.channel}
                      </span>
                    </div>

                    <p className="mt-2 truncate text-sm text-white/40">
                      {conversation.preview}
                    </p>

                    <p className="mt-2 text-[10px] uppercase tracking-wider text-white/20">
                      {conversation.agent} · {conversation.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 lg:justify-end">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-wider text-white/40">
                    {conversation.status}
                  </span>

                  <button
                    type="button"
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-white/60 transition hover:bg-white/[0.07] hover:text-white"
                  >
                    Open
                  </button>
                </div>
              </article>
            ))}

            {filteredConversations.length === 0 && (
              <div className="px-6 py-16 text-center">
                <p className="text-sm text-white/40">
                  No conversations match your search or filter.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Automation layer */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/25">
            Conversation Intelligence
          </p>

          <h2 className="mt-2 text-lg font-semibold">
            One workspace for every customer interaction.
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
            This interface is designed to connect with the real
            conversation engine, agent memory, CRM, channel
            integrations, sentiment analysis, and automated
            follow-up workflows.
          </p>
        </section>
      </div>
    </main>
  );
}

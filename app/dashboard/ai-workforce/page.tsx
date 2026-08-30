"use client";

import { useMemo, useState } from "react";

type Agent = {
  name: string;
  role: string;
  description: string;
  status: "Active" | "Standby";
  tasks: number;
};

const initialAgents: Agent[] = [
  {
    name: "AI Sales",
    role: "Sales Agent",
    description:
      "Qualifies prospects, handles sales conversations, and moves opportunities forward.",
    status: "Active",
    tasks: 428,
  },
  {
    name: "AI Receptionist",
    role: "Reception Agent",
    description:
      "Greets customers, answers common questions, and routes conversations.",
    status: "Active",
    tasks: 361,
  },
  {
    name: "AI Follow-up",
    role: "Follow-up Agent",
    description:
      "Keeps prospects engaged with timely follow-ups across approved channels.",
    status: "Active",
    tasks: 297,
  },
  {
    name: "AI Appointment",
    role: "Appointment Agent",
    description:
      "Handles appointment workflows and helps customers reach the right schedule.",
    status: "Standby",
    tasks: 198,
  },
];

export default function AIWorkforcePage() {
  const [agents, setAgents] = useState(initialAgents);
  const [search, setSearch] = useState("");

  const filteredAgents = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return agents;
    }

    return agents.filter(
      (agent) =>
        agent.name.toLowerCase().includes(query) ||
        agent.role.toLowerCase().includes(query)
    );
  }, [agents, search]);

  const activeAgents = agents.filter(
    (agent) => agent.status === "Active"
  ).length;

  const totalTasks = agents.reduce(
    (total, agent) => total + agent.tasks,
    0
  );

  function toggleAgent(name: string) {
    setAgents((current) =>
      current.map((agent) =>
        agent.name === name
          ? {
              ...agent,
              status:
                agent.status === "Active" ? "Standby" : "Active",
            }
          : agent
      )
    );
  }

  return (
    <main className="min-h-screen bg-[#06090F] px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                AI Workforce
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                Your AI employees, working together.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
                Manage the AI workforce assigned to your business.
                Monitor their status, workload, and responsibilities
                from one centralized workspace.
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
            >
              Deploy New Agent
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <p className="text-xs text-white/30">Total Agents</p>
            <p className="mt-2 text-3xl font-semibold">
              {agents.length}
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <p className="text-xs text-white/30">Active Agents</p>
            <p className="mt-2 text-3xl font-semibold">
              {activeAgents}
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <p className="text-xs text-white/30">Tasks Handled</p>
            <p className="mt-2 text-3xl font-semibold">
              {totalTasks.toLocaleString()}
            </p>
          </article>
        </section>

        {/* Search */}
        <section className="mt-6">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search AI workforce..."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20"
          />
        </section>

        {/* Agents */}
        <section className="mt-6 grid gap-5 md:grid-cols-2">
          {filteredAgents.map((agent) => (
            <article
              key={agent.name}
              className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.04]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <span className="text-xs font-semibold tracking-wider">
                    AI
                  </span>
                </div>

                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-wider text-white/40">
                  {agent.status}
                </span>
              </div>

              <h2 className="mt-6 text-xl font-semibold">
                {agent.name}
              </h2>

              <p className="mt-1 text-xs uppercase tracking-wider text-white/25">
                {agent.role}
              </p>

              <p className="mt-4 text-sm leading-6 text-white/40">
                {agent.description}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-5">
                <div>
                  <p className="text-xs text-white/25">Tasks</p>
                  <p className="mt-1 text-sm font-semibold">
                    {agent.tasks}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleAgent(agent.name)}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-white/60 transition hover:bg-white/[0.07] hover:text-white"
                >
                  {agent.status === "Active"
                    ? "Set Standby"
                    : "Activate"}
                </button>
              </div>
            </article>
          ))}

          {filteredAgents.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-10 text-center md:col-span-2">
              <p className="text-sm text-white/40">
                No AI workforce agents match your search.
              </p>
            </div>
          )}
        </section>

        {/* Architecture note */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/25">
            Workforce Architecture
          </p>

          <h2 className="mt-2 text-lg font-semibold">
            Built for coordinated AI operations.
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
            This dashboard is the management layer. Real agent
            execution, model providers, permissions, task queues,
            memory, integrations, usage limits, and persistent
            workspace data will be connected through the backend
            architecture.
          </p>
        </section>
      </div>
    </main>
  );
}

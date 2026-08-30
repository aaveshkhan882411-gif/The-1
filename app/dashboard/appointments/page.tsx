"use client";

import { useMemo, useState } from "react";

type AppointmentStatus =
  | "Scheduled"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

type Appointment = {
  id: number;
  customer: string;
  company: string;
  agent: string;
  date: string;
  time: string;
  type: string;
  status: AppointmentStatus;
};

const appointments: Appointment[] = [
  {
    id: 1,
    customer: "Sarah Johnson",
    company: "Johnson Properties",
    agent: "AI Appointment",
    date: "Today",
    time: "4:30 PM",
    type: "Sales Call",
    status: "Confirmed",
  },
  {
    id: 2,
    customer: "Michael Carter",
    company: "Carter Digital",
    agent: "AI Receptionist",
    date: "Today",
    time: "6:00 PM",
    type: "Discovery Call",
    status: "Scheduled",
  },
  {
    id: 3,
    customer: "Emma Williams",
    company: "Williams Group",
    agent: "AI Sales",
    date: "Tomorrow",
    time: "11:00 AM",
    type: "Product Demo",
    status: "Confirmed",
  },
  {
    id: 4,
    customer: "Daniel Brown",
    company: "Brown Commerce",
    agent: "AI Appointment",
    date: "Tomorrow",
    time: "2:30 PM",
    type: "Strategy Call",
    status: "Scheduled",
  },
  {
    id: 5,
    customer: "Olivia Davis",
    company: "Davis Consulting",
    agent: "AI Sales",
    date: "Aug 31",
    time: "5:00 PM",
    type: "Consultation",
    status: "Completed",
  },
];

const filters = [
  "All",
  "Scheduled",
  "Confirmed",
  "Completed",
  "Cancelled",
] as const;

export default function AppointmentsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<(typeof filters)[number]>("All");

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const matchesSearch =
        !query ||
        appointment.customer.toLowerCase().includes(query) ||
        appointment.company.toLowerCase().includes(query) ||
        appointment.agent.toLowerCase().includes(query) ||
        appointment.type.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" || appointment.status === filter;

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
                Appointments
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                Your AI books the meetings.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
                Manage customer meetings, demos, consultations,
                and automated bookings from one workspace.
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
            >
              Schedule Appointment
            </button>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Upcoming", "38"],
            ["Today", "12"],
            ["Confirmed", "29"],
            ["Completed", "416"],
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
            placeholder="Search appointments, customers or agents..."
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
            <h2 className="text-sm font-semibold">
              Appointment Schedule
            </h2>

            <p className="mt-1 text-xs text-white/30">
              Meetings generated and managed by your AI workforce.
            </p>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {filteredAppointments.map((appointment) => (
              <article
                key={appointment.id}
                className="flex flex-col gap-5 px-6 py-6 transition hover:bg-white/[0.025] lg:flex-row lg:items-center"
              >
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <span className="text-[9px] uppercase text-white/30">
                      {appointment.date}
                    </span>

                    <span className="mt-0.5 text-xs font-semibold">
                      {appointment.time}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">
                      {appointment.customer}
                    </h3>

                    <p className="mt-1 text-xs text-white/35">
                      {appointment.company} · {appointment.type}
                    </p>

                    <p className="mt-2 text-[10px] uppercase tracking-wider text-white/20">
                      {appointment.agent}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-wider text-white/45">
                    {appointment.status}
                  </span>

                  <button
                    type="button"
                    className="rounded-xl border border-white/10 px-4 py-2.5 text-xs text-white/55 transition hover:bg-white/[0.07] hover:text-white"
                  >
                    Open
                  </button>
                </div>
              </article>
            ))}

            {filteredAppointments.length === 0 && (
              <div className="px-6 py-16 text-center text-sm text-white/35">
                No appointments match your search or filter.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

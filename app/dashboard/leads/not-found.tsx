import Link from "next/link";

export default function LeadsNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#06090F] px-5 text-white">
      <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center shadow-2xl backdrop-blur-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
          <span className="text-xs font-semibold tracking-[0.18em]">
            404
          </span>
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
          Lead Intelligence
        </p>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          Lead not found.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/40">
          The requested lead or lead workspace could not be found.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard/leads"
            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
          >
            Back to Leads
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/60 transition hover:bg-white/[0.07] hover:text-white"
          >
            Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}

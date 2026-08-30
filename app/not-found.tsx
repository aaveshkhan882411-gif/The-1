import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#06090F] px-5 text-white">
      <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/[0.05]">
          <span className="text-sm font-semibold tracking-[0.2em]">
            404
          </span>
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
          Page not found
        </p>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          This destination does not exist.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/45">
          The GrowthAI page you requested could not be found or may have
          moved to another location.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
        >
          Return to GrowthAI
        </Link>
      </section>
    </main>
  );
}

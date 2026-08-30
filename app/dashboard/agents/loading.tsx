export default function AgentsLoading() {
  return (
    <main className="min-h-screen bg-[#06090F] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        {/* Header skeleton */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="h-3 w-28 rounded-full bg-white/10" />
          <div className="mt-4 h-10 w-72 rounded-lg bg-white/10" />
          <div className="mt-4 h-4 w-full max-w-2xl rounded bg-white/[0.07]" />
          <div className="mt-2 h-4 w-2/3 max-w-xl rounded bg-white/[0.07]" />
        </section>

        {/* Search skeleton */}
        <div className="mt-6 h-12 w-full rounded-xl border border-white/10 bg-white/[0.025]" />

        {/* Category skeleton */}
        <div className="mt-4 flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-8 w-20 shrink-0 rounded-full bg-white/[0.07]"
            />
          ))}
        </div>

        {/* Agent cards skeleton */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="min-h-[290px] rounded-2xl border border-white/10 bg-white/[0.025] p-5"
            >
              <div className="h-12 w-12 rounded-xl bg-white/[0.08]" />

              <div className="mt-6 h-2.5 w-16 rounded-full bg-white/[0.07]" />
              <div className="mt-3 h-6 w-32 rounded bg-white/[0.08]" />
              <div className="mt-2 h-3 w-28 rounded bg-white/[0.06]" />

              <div className="mt-5 h-3 w-full rounded bg-white/[0.06]" />
              <div className="mt-2 h-3 w-5/6 rounded bg-white/[0.06]" />
              <div className="mt-2 h-3 w-2/3 rounded bg-white/[0.06]" />

              <div className="mt-8 h-11 w-full rounded-xl bg-white/[0.08]" />
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

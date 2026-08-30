export default function AIWorkforceLoading() {
  return (
    <main className="min-h-screen bg-[#06090F] px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl animate-pulse">
        {/* Header */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex-1">
              <div className="h-3 w-28 rounded-full bg-white/10" />

              <div className="mt-4 h-10 w-full max-w-2xl rounded-lg bg-white/10" />

              <div className="mt-4 h-4 w-full max-w-2xl rounded bg-white/[0.07]" />
              <div className="mt-2 h-4 w-2/3 max-w-xl rounded bg-white/[0.07]" />
            </div>

            <div className="h-11 w-36 rounded-xl bg-white/[0.08]" />
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <article
              key={index}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
            >
              <div className="h-3 w-24 rounded bg-white/[0.07]" />
              <div className="mt-3 h-9 w-16 rounded bg-white/[0.08]" />
            </article>
          ))}
        </section>

        {/* Search */}
        <section className="mt-6">
          <div className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.025]" />
        </section>

        {/* Agents */}
        <section className="mt-6 grid gap-5 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <article
              key={index}
              className="rounded-3xl border border-white/10 bg-white/[0.025] p-6"
            >
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-xl bg-white/[0.07]" />
                <div className="h-6 w-20 rounded-full bg-white/[0.05]" />
              </div>

              <div className="mt-6 h-6 w-32 rounded bg-white/[0.08]" />
              <div className="mt-2 h-3 w-24 rounded bg-white/[0.05]" />

              <div className="mt-5 h-3 w-full rounded bg-white/[0.06]" />
              <div className="mt-2 h-3 w-4/5 rounded bg-white/[0.06]" />

              <div className="mt-7 flex items-center justify-between border-t border-white/[0.07] pt-5">
                <div>
                  <div className="h-3 w-12 rounded bg-white/[0.05]" />
                  <div className="mt-2 h-4 w-10 rounded bg-white/[0.07]" />
                </div>

                <div className="h-10 w-24 rounded-xl bg-white/[0.07]" />
              </div>
            </article>
          ))}
        </section>

        {/* Architecture */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <div className="h-3 w-36 rounded bg-white/[0.06]" />
          <div className="mt-3 h-5 w-72 max-w-full rounded bg-white/[0.08]" />
          <div className="mt-3 h-3 w-full max-w-3xl rounded bg-white/[0.05]" />
          <div className="mt-2 h-3 w-4/5 max-w-2xl rounded bg-white/[0.05]" />
        </section>
      </div>
    </main>
  );
}

export default function AnalyticsLoading() {
  return (
    <main className="min-h-screen bg-[#06090F] px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl animate-pulse">
        {/* Header */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex-1">
              <div className="h-3 w-24 rounded-full bg-white/10" />

              <div className="mt-4 h-10 w-full max-w-2xl rounded-lg bg-white/10" />

              <div className="mt-4 h-4 w-full max-w-2xl rounded bg-white/[0.07]" />
              <div className="mt-2 h-4 w-2/3 max-w-xl rounded bg-white/[0.07]" />
            </div>

            <div className="h-10 w-36 rounded-xl bg-white/[0.07]" />
          </div>
        </section>

        {/* Metrics */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <article
              key={index}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
            >
              <div className="h-3 w-28 rounded bg-white/[0.07]" />

              <div className="mt-4 h-9 w-28 rounded bg-white/[0.08]" />

              <div className="mt-4 h-3 w-32 rounded bg-white/[0.06]" />
            </article>
          ))}
        </section>

        {/* Charts */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <article className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
            <div className="h-3 w-24 rounded bg-white/[0.06]" />
            <div className="mt-3 h-5 w-32 rounded bg-white/[0.08]" />

            <div className="mt-8 h-64 rounded-xl bg-white/[0.025]" />
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
            <div className="h-3 w-28 rounded bg-white/[0.06]" />
            <div className="mt-3 h-5 w-36 rounded bg-white/[0.08]" />

            <div className="mt-8 space-y-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index}>
                  <div className="flex justify-between">
                    <div className="h-3 w-24 rounded bg-white/[0.06]" />
                    <div className="h-3 w-10 rounded bg-white/[0.05]" />
                  </div>

                  <div className="mt-2 h-2 rounded-full bg-white/[0.06]" />
                </div>
              ))}
            </div>
          </article>
        </section>

        {/* Revenue */}
        <section className="mt-6 grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <article
              key={index}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-6"
            >
              <div className="h-3 w-28 rounded bg-white/[0.06]" />
              <div className="mt-4 h-9 w-32 rounded bg-white/[0.08]" />
              <div className="mt-3 h-3 w-full rounded bg-white/[0.05]" />
              <div className="mt-2 h-3 w-3/4 rounded bg-white/[0.05]" />
            </article>
          ))}
        </section>

        {/* Status */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="h-3 w-24 rounded bg-white/[0.06]" />
              <div className="mt-3 h-5 w-full max-w-md rounded bg-white/[0.08]" />
              <div className="mt-3 h-3 w-full max-w-2xl rounded bg-white/[0.05]" />
            </div>

            <div className="h-9 w-24 rounded-full bg-white/[0.06]" />
          </div>
        </section>
      </div>
    </main>
  );
}

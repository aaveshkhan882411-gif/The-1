export default function WebhooksLoading() {
  return (
    <main className="min-h-screen bg-[#06090F] px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl animate-pulse">
        {/* Header */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="h-3 w-24 rounded-full bg-white/10" />

          <div className="mt-4 h-10 w-80 rounded-lg bg-white/10" />

          <div className="mt-4 h-4 w-full max-w-2xl rounded bg-white/[0.07]" />
          <div className="mt-2 h-4 w-2/3 max-w-xl rounded bg-white/[0.07]" />

          <div className="mt-7 flex gap-3">
            <div className="h-16 w-32 rounded-xl bg-white/[0.06]" />
            <div className="h-16 w-24 rounded-xl bg-white/[0.06]" />
          </div>
        </section>

        {/* Webhook list */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
          <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-5 sm:px-6">
            <div>
              <div className="h-4 w-32 rounded bg-white/[0.08]" />
              <div className="mt-2 h-3 w-56 rounded bg-white/[0.06]" />
            </div>

            <div className="h-10 w-28 rounded-xl bg-white/[0.08]" />
          </div>

          {Array.from({ length: 3 }).map((_, index) => (
            <article
              key={index}
              className="border-b border-white/[0.06] p-5 last:border-b-0 sm:p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex gap-3">
                    <div className="h-4 w-32 rounded bg-white/[0.08]" />
                    <div className="h-5 w-28 rounded-full bg-white/[0.05]" />
                  </div>

                  <div className="mt-3 h-3 w-64 rounded bg-white/[0.06]" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-3 w-14 rounded bg-white/[0.06]" />
                  <div className="h-6 w-11 rounded-full bg-white/[0.07]" />
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Events */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <div className="h-3 w-32 rounded bg-white/[0.07]" />
          <div className="mt-3 h-5 w-64 rounded bg-white/[0.08]" />

          <div className="mt-5 flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-8 w-32 rounded-lg bg-white/[0.05]"
              />
            ))}
          </div>
        </section>

        {/* Security */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <div className="h-3 w-20 rounded bg-white/[0.07]" />
          <div className="mt-3 h-5 w-72 max-w-full rounded bg-white/[0.08]" />
          <div className="mt-3 h-3 w-full max-w-3xl rounded bg-white/[0.06]" />
          <div className="mt-2 h-3 w-4/5 max-w-2xl rounded bg-white/[0.06]" />
        </section>
      </div>
    </main>
  );
}

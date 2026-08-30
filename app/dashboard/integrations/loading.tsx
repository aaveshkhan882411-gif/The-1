export default function IntegrationsLoading() {
  return (
    <main className="min-h-screen bg-[#06090F] px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl animate-pulse">
        {/* Header */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="h-3 w-28 rounded-full bg-white/10" />

          <div className="mt-4 h-10 w-80 rounded-lg bg-white/10" />

          <div className="mt-4 h-4 w-full max-w-2xl rounded bg-white/[0.07]" />
          <div className="mt-2 h-4 w-2/3 max-w-xl rounded bg-white/[0.07]" />

          <div className="mt-7 flex gap-3">
            <div className="h-16 w-28 rounded-xl bg-white/[0.06]" />
            <div className="h-16 w-28 rounded-xl bg-white/[0.06]" />
          </div>
        </section>

        {/* Integration cards */}
        <section className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <article
              key={index}
              className="min-h-[260px] rounded-3xl border border-white/10 bg-white/[0.025] p-6"
            >
              <div className="flex items-start justify-between">
                <div className="h-11 w-11 rounded-xl bg-white/[0.07]" />
                <div className="h-6 w-20 rounded-full bg-white/[0.05]" />
              </div>

              <div className="mt-6 h-5 w-36 rounded bg-white/[0.08]" />

              <div className="mt-3 h-3 w-full rounded bg-white/[0.06]" />
              <div className="mt-2 h-3 w-4/5 rounded bg-white/[0.06]" />

              <div className="mt-7 h-11 w-full rounded-xl bg-white/[0.08]" />
            </article>
          ))}
        </section>

        {/* Security notice */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <div className="h-3 w-32 rounded bg-white/[0.07]" />
          <div className="mt-3 h-5 w-96 max-w-full rounded bg-white/[0.08]" />
          <div className="mt-3 h-3 w-full max-w-3xl rounded bg-white/[0.06]" />
          <div className="mt-2 h-3 w-4/5 max-w-2xl rounded bg-white/[0.06]" />
        </section>
      </div>
    </main>
  );
}

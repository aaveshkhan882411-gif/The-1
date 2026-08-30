export default function CRMLoading() {
  return (
    <main className="min-h-screen bg-[#06090F] px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl animate-pulse">
        {/* Header */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="h-3 w-48 rounded-full bg-white/10" />

          <div className="mt-5 h-10 w-3/4 max-w-2xl rounded-xl bg-white/10" />

          <div className="mt-4 h-4 w-full max-w-2xl rounded-full bg-white/[0.06]" />
          <div className="mt-2 h-4 w-2/3 max-w-xl rounded-full bg-white/[0.06]" />
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
            >
              <div className="h-3 w-28 rounded-full bg-white/10" />
              <div className="mt-3 h-9 w-24 rounded-xl bg-white/10" />
            </div>
          ))}
        </section>

        {/* Search + filters */}
        <section className="mt-6 flex gap-3">
          <div className="h-14 flex-1 rounded-2xl border border-white/10 bg-white/[0.025]" />
          <div className="hidden h-14 w-80 rounded-xl border border-white/10 bg-white/[0.025] lg:block" />
        </section>

        {/* CRM table */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
          <div className="border-b border-white/[0.07] p-6">
            <div className="h-4 w-40 rounded-full bg-white/10" />
            <div className="mt-3 h-3 w-72 max-w-full rounded-full bg-white/[0.06]" />
          </div>

          <div className="divide-y divide-white/[0.06]">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 px-6 py-6"
              >
                <div className="h-11 w-11 shrink-0 rounded-xl bg-white/[0.07]" />

                <div className="flex-1">
                  <div className="h-4 w-40 rounded-full bg-white/10" />
                  <div className="mt-3 h-3 w-64 max-w-full rounded-full bg-white/[0.06]" />
                  <div className="mt-2 h-2.5 w-36 rounded-full bg-white/[0.05]" />
                </div>

                <div className="hidden h-8 w-24 rounded-full bg-white/[0.06] sm:block" />
                <div className="hidden h-9 w-16 rounded-xl bg-white/[0.06] sm:block" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

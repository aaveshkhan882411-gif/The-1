export default function BillingLoading() {
  return (
    <main className="min-h-screen bg-[#06090F] px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl animate-pulse">
        {/* Header */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="h-3 w-28 rounded-full bg-white/10" />
          <div className="mt-4 h-10 w-80 rounded-lg bg-white/10" />
          <div className="mt-4 h-4 w-full max-w-2xl rounded bg-white/[0.07]" />
          <div className="mt-2 h-4 w-2/3 max-w-xl rounded bg-white/[0.07]" />

          <div className="mt-7 h-11 w-52 rounded-xl bg-white/[0.08]" />
        </section>

        {/* Current plan */}
        <section className="mt-6 h-28 rounded-2xl border border-white/10 bg-white/[0.025]" />

        {/* Pricing cards */}
        <section className="mt-6 grid gap-5 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="min-h-[520px] rounded-3xl border border-white/10 bg-white/[0.025] p-6"
            >
              <div className="h-3 w-20 rounded-full bg-white/[0.07]" />

              <div className="mt-5 h-10 w-36 rounded-lg bg-white/[0.08]" />

              <div className="mt-4 h-3 w-full rounded bg-white/[0.06]" />
              <div className="mt-2 h-3 w-4/5 rounded bg-white/[0.06]" />

              <div className="mt-8 space-y-3">
                <div className="h-20 rounded-xl bg-white/[0.05]" />
                <div className="h-20 rounded-xl bg-white/[0.05]" />
                <div className="h-20 rounded-xl bg-white/[0.05]" />
              </div>

              <div className="mt-8 h-11 w-full rounded-xl bg-white/[0.08]" />
            </div>
          ))}
        </section>

        {/* Membership */}
        <section className="mt-10">
          <div className="h-3 w-32 rounded-full bg-white/[0.07]" />
          <div className="mt-3 h-7 w-72 rounded-lg bg-white/[0.08]" />

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-44 rounded-2xl border border-white/10 bg-white/[0.025]"
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

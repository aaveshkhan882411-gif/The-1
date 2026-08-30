export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#06090F] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-8">
          <div className="h-3 w-28 rounded-full bg-white/10" />
          <div className="mt-4 h-10 w-72 rounded-lg bg-white/10" />
          <div className="mt-4 h-4 w-full max-w-2xl rounded bg-white/[0.07]" />
          <div className="mt-2 h-4 w-2/3 max-w-xl rounded bg-white/[0.07]" />

          <div className="mt-7 h-11 w-40 rounded-xl bg-white/10" />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 rounded-2xl border border-white/10 bg-white/[0.025]"
            />
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="h-96 rounded-2xl border border-white/10 bg-white/[0.025]" />
          <div className="h-96 rounded-2xl border border-white/10 bg-white/[0.025]" />
        </section>
      </div>
    </main>
  );
}

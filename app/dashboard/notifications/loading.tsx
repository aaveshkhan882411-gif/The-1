export default function NotificationsLoading() {
  return (
    <main className="min-h-screen bg-[#06090F] px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-4xl animate-pulse">
        {/* Header */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="h-3 w-28 rounded-full bg-white/10" />

          <div className="mt-4 h-10 w-64 rounded-lg bg-white/10" />

          <div className="mt-4 h-4 w-full max-w-2xl rounded bg-white/[0.07]" />
          <div className="mt-2 h-4 w-2/3 max-w-xl rounded bg-white/[0.07]" />

          <div className="mt-6 h-10 w-36 rounded-xl bg-white/[0.07]" />
        </section>

        {/* Notifications */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
          <div className="border-b border-white/[0.08] px-6 py-5">
            <div className="h-4 w-40 rounded bg-white/[0.08]" />
            <div className="mt-2 h-3 w-20 rounded bg-white/[0.06]" />
          </div>

          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex gap-4 border-b border-white/[0.06] p-5 last:border-b-0 sm:p-6"
            >
              <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-white/[0.08]" />

              <div className="flex-1">
                <div className="flex items-center justify-between gap-4">
                  <div className="h-4 w-40 rounded bg-white/[0.08]" />
                  <div className="h-3 w-16 rounded bg-white/[0.06]" />
                </div>

                <div className="mt-3 h-3 w-full max-w-xl rounded bg-white/[0.06]" />
                <div className="mt-2 h-3 w-2/3 max-w-md rounded bg-white/[0.06]" />

                <div className="mt-4 h-3 w-24 rounded bg-white/[0.06]" />
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

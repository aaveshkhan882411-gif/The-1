export default function SettingsLoading() {
  return (
    <main className="min-h-screen bg-[#06090F] px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-5xl animate-pulse">
        {/* Header */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="h-3 w-32 rounded-full bg-white/10" />
          <div className="mt-4 h-10 w-80 rounded-lg bg-white/10" />
          <div className="mt-4 h-4 w-full max-w-2xl rounded bg-white/[0.07]" />
          <div className="mt-2 h-4 w-2/3 max-w-xl rounded bg-white/[0.07]" />
        </section>

        {/* Settings sections */}
        <div className="mt-6 space-y-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <section
              key={index}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-6"
            >
              <div className="h-3 w-28 rounded-full bg-white/[0.07]" />

              <div className="mt-3 h-6 w-48 rounded-lg bg-white/[0.08]" />

              <div className="mt-5 space-y-4">
                <div className="h-11 w-full rounded-xl bg-white/[0.05]" />
                <div className="h-11 w-full rounded-xl bg-white/[0.05]" />
              </div>
            </section>
          ))}
        </div>

        {/* Save button */}
        <div className="mt-6 flex justify-end">
          <div className="h-11 w-32 rounded-xl bg-white/[0.08]" />
        </div>
      </div>
    </main>
  );
}

export default function Loading() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-[#06090F] text-white"
      aria-label="Loading GrowthAI"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full border border-white/10" />

          <div className="absolute inset-2 animate-pulse rounded-full border border-white/15" />

          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/[0.05] shadow-[0_0_50px_rgba(255,255,255,0.08)]">
            <span className="text-xs font-semibold tracking-[0.2em]">
              AI
            </span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm font-medium tracking-wide text-white/75">
            GrowthAI
          </p>

          <p className="mt-1 text-xs text-white/35">
            Initializing intelligent workforce...
          </p>
        </div>
      </div>
    </main>
  );
}

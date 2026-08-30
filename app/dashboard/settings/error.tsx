"use client";

import { useEffect } from "react";

interface SettingsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SettingsError({
  error,
  reset,
}: SettingsErrorProps) {
  useEffect(() => {
    console.error("GrowthAI settings error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#06090F] px-5 text-white">
      <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center shadow-2xl backdrop-blur-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
          <span className="text-xs font-semibold tracking-[0.18em]">
            SET
          </span>
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
          Workspace Settings
        </p>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          Settings could not load.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/40">
          Something interrupted your GrowthAI workspace settings.
          Your existing account configuration has not been changed
          by this error.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Try Again
        </button>
      </section>
    </main>
  );
}

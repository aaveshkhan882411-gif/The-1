"use client";

import * as React from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  React.useEffect(() => {
    console.error("GrowthAI application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#06090F] px-5 text-white">
      <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/[0.05]">
          <span className="text-sm font-semibold tracking-[0.2em]">
            AI
          </span>
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
          System interruption
        </p>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          Something went wrong.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/45">
          GrowthAI could not complete this request. You can retry the
          current experience without leaving the platform.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
        >
          Try Again
        </button>
      </section>
    </main>
  );
}

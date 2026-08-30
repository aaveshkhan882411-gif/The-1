"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    // Authentication will be connected to the GrowthAI
    // self-hosted authentication system in the next backend stage.
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#06090F] px-5 py-12 text-white">
      {/* Cinematic background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.035] blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#06090F_72%)]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight"
          >
            Growth<span className="text-white/40">AI</span>
          </Link>

          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/30">
            Intelligent Workforce
          </p>
        </div>

        {/* Login card */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-7 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-9">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/35">
              Secure Access
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Welcome back.
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/45">
              Sign in to access your GrowthAI workforce and business
              workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-white/70"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-white/25 focus:bg-white/[0.05]"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-white/70"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs text-white/40 transition hover:text-white/70"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 pr-20 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-white/25 focus:bg-white/[0.05]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-white/40 transition hover:text-white/75"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/65"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="h-12 w-full rounded-xl bg-white px-5 text-sm font-semibold text-black shadow-xl shadow-white/5 transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Login to GrowthAI
            </button>
          </form>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.08]" />
            <span className="text-xs text-white/25">OR</span>
            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>

          <Link
            href="/"
            className="flex h-11 w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] text-sm font-medium text-white/60 transition hover:bg-white/[0.06] hover:text-white"
          >
            Back to GrowthAI
          </Link>
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-white/25">
          Secure access to your GrowthAI business workspace.
        </p>
      </div>
    </main>
  );
}

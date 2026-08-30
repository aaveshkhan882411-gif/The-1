"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [autoFollowUp, setAutoFollowUp] = useState(true);
  const [language, setLanguage] = useState("English");

  return (
    <main className="min-h-screen bg-[#06090F] px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
            Workspace Settings
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            Control your GrowthAI workspace.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
            Manage your business information, AI workforce preferences,
            notifications, security, and connected workspace settings.
          </p>
        </section>

        <div className="mt-6 space-y-6">
          {/* Account */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-white/25">
              Account
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Account information
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs text-white/35">Name</span>
                <input
                  type="text"
                  placeholder="Your name"
                  className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[0.025] px-4 text-sm outline-none placeholder:text-white/20 focus:border-white/20"
                />
              </label>

              <label className="block">
                <span className="text-xs text-white/35">Email</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[0.025] px-4 text-sm outline-none placeholder:text-white/20 focus:border-white/20"
                />
              </label>
            </div>
          </section>

          {/* Business */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-white/25">
              Business
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Business profile
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs text-white/35">
                  Business name
                </span>

                <input
                  type="text"
                  placeholder="Your business"
                  className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[0.025] px-4 text-sm outline-none placeholder:text-white/20 focus:border-white/20"
                />
              </label>

              <label className="block">
                <span className="text-xs text-white/35">
                  Business type
                </span>

                <input
                  type="text"
                  placeholder="e.g. Real Estate"
                  className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[0.025] px-4 text-sm outline-none placeholder:text-white/20 focus:border-white/20"
                />
              </label>
            </div>
          </section>

          {/* AI workforce */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-white/25">
              AI Workforce
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Workforce preferences
            </h2>

            <div className="mt-5 space-y-3">
              <SettingRow
                title="Automatic lead follow-up"
                description="Allow your AI workforce to continue configured follow-up workflows."
                enabled={autoFollowUp}
                onChange={setAutoFollowUp}
              />

              <SettingRow
                title="Customer notifications"
                description="Receive important workspace and AI activity notifications."
                enabled={notifications}
                onChange={setNotifications}
              />
            </div>
          </section>

          {/* Language */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-white/25">
              Communication
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Preferred language
            </h2>

            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="mt-5 h-11 w-full rounded-xl border border-white/10 bg-[#0a0e16] px-4 text-sm text-white outline-none focus:border-white/20 sm:max-w-xs"
            >
              <option>English</option>
              <option>Hindi</option>
            </select>
          </section>

          {/* Website connection */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-white/25">
              Website Connection
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Connect your business website
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
              Your website connection and GrowthAI workforce integration
              will be configured here. The connection system will allow
              your AI employees to work with your approved business
              workflows.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                type="url"
                placeholder="https://yourwebsite.com"
                className="h-11 flex-1 rounded-xl border border-white/10 bg-white/[0.025] px-4 text-sm outline-none placeholder:text-white/20 focus:border-white/20"
              />

              <button
                type="button"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
              >
                Connect Website
              </button>
            </div>
          </section>

          {/* Security */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-white/25">
              Security
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Account security
            </h2>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/60 transition hover:bg-white/[0.07] hover:text-white"
              >
                Change Password
              </button>

              <button
                type="button"
                className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/60 transition hover:bg-white/[0.07] hover:text-white"
              >
                Manage Sessions
              </button>
            </div>
          </section>

          {/* Save */}
          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

interface SettingRowProps {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}

function SettingRow({
  title,
  description,
  enabled,
  onChange,
}: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-white/35">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        aria-pressed={enabled}
        className={[
          "relative h-6 w-11 shrink-0 rounded-full border transition",
          enabled
            ? "border-white/20 bg-white"
            : "border-white/10 bg-white/[0.05]",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 h-4 w-4 rounded-full transition",
            enabled
              ? "left-6 bg-black"
              : "left-1 bg-white/30",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#06090F] text-white">
      <nav className="border-b border-white/[0.08] bg-[#06090F]/80 backdrop-blur-xl">
        <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/dashboard"
            className="text-sm font-semibold tracking-tight"
          >
            Growth<span className="text-white/40">AI</span>
          </Link>

          <div className="flex items-center gap-5">
            <Link
              href="/dashboard"
              className="text-xs text-white/55 transition hover:text-white"
            >
              Overview
            </Link>

            <Link
              href="/agents"
              className="text-xs text-white/55 transition hover:text-white"
            >
              Agents
            </Link>

            <Link
              href="/pricing"
              className="text-xs text-white/55 transition hover:text-white"
            >
              Billing
            </Link>
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}

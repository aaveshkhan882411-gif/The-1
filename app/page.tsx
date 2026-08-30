import Link from "next/link";

const highlights = [
  {
    title: "AI Workforce",
    description:
      "Deploy specialized AI employees for sales, support, follow-up, appointments, CRM, and workflows.",
  },
  {
    title: "24/7 Lead Capture",
    description:
      "Capture and qualify customer conversations continuously without missing opportunities.",
  },
  {
    title: "One Intelligent System",
    description:
      "Connect your business website, customer conversations, agents, data, and workflows in one experience.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#06090F] text-white">
      {/* Cinematic background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-[-20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-white/[0.035] blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-white/[0.025] blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#06090F_75%)]" />
      </div>

      {/* Navigation */}
      <header className="relative z-20 border-b border-white/[0.08] bg-[#06090F]/70 backdrop-blur-xl">
        <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight"
            aria-label="GrowthAI home"
          >
            Growth<span className="text-white/45">AI</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm text-white/55 md:flex">
            <a
              href="#workforce"
              className="transition-colors hover:text-white"
            >
              Workforce
            </a>
            <a
              href="#examples"
              className="transition-colors hover:text-white"
            >
              Examples
            </a>
            <a
              href="#pricing"
              className="transition-colors hover:text-white"
            >
              Pricing
            </a>
          </div>

          <Link
            href="/login"
            className="rounded-lg border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/[0.1]"
          >
            Login
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center">
        <div className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/50 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
              Intelligent AI Workforce
            </div>

            <h1 className="text-balance text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-8xl">
              Your business.
              <br />
              <span className="text-white/40">Powered by AI.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-7 text-white/50 sm:text-lg">
              GrowthAI gives your business an intelligent workforce that
              captures leads, communicates with customers, automates
              repetitive work, and operates around the clock.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-black shadow-2xl shadow-white/10 transition-transform hover:-translate-y-0.5"
              >
                Enter GrowthAI
              </Link>

              <a
                href="#workforce"
                className="rounded-xl border border-white/10 bg-white/[0.035] px-7 py-3.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/[0.07] hover:text-white"
              >
                Explore Workforce
              </a>
            </div>
          </div>

          {/* AI system visual */}
          <div className="mx-auto mt-20 max-w-5xl">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-2 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-[#080b12] sm:min-h-[380px]">
                <div className="absolute h-44 w-44 rounded-full border border-white/10 sm:h-64 sm:w-64" />
                <div className="absolute h-28 w-28 rounded-full border border-white/15 sm:h-40 sm:w-40" />

                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/[0.07] shadow-[0_0_80px_rgba(255,255,255,0.08)]">
                  <span className="text-sm font-semibold tracking-widest">
                    AI
                  </span>
                </div>

                <div className="absolute left-[18%] top-[27%] rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white/50">
                  SALES
                </div>

                <div className="absolute right-[16%] top-[25%] rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white/50">
                  SUPPORT
                </div>

                <div className="absolute bottom-[22%] left-[25%] rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white/50">
                  CRM
                </div>

                <div className="absolute bottom-[20%] right-[23%] rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white/50">
                  WORKFLOW
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workforce */}
      <section
        id="workforce"
        className="relative z-10 border-t border-white/[0.06] py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              One workforce
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
              AI employees built around your business.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-all hover:-translate-y-1 hover:bg-white/[0.045]"
              >
                <h3 className="text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/45">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Examples */}
      <section
        id="examples"
        className="relative z-10 border-t border-white/[0.06] py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
            Examples
          </p>

          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
            See what an intelligent workforce can handle.
          </h2>

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <p className="text-xs uppercase tracking-widest text-white/35">
                Example 01
              </p>
              <h3 className="mt-3 text-xl font-semibold">
                Lead qualification
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/45">
                A customer starts a conversation, the AI understands the
                request, qualifies the lead, and moves the opportunity into
                the next workflow.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <p className="text-xs uppercase tracking-widest text-white/35">
                Example 02
              </p>
              <h3 className="mt-3 text-xl font-semibold">
                Automated follow-up
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/45">
                The AI can continue conversations, handle follow-ups, and
                coordinate appointments according to the business workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing placeholder */}
      <section
        id="pricing"
        className="relative z-10 border-t border-white/[0.06] py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
            GrowthAI
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
            Choose your AI workforce.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/45">
            Full plan comparison and secure checkout will be connected in
            the pricing system.
          </p>

          <Link
            href="/pricing"
            className="mt-8 inline-flex rounded-xl border border-white/10 bg-white/[0.05] px-6 py-3 text-sm font-medium transition-colors hover:bg-white/[0.09]"
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>GrowthAI</span>
          <span>Intelligent workforce infrastructure.</span>
        </div>
      </footer>
    </main>
  );
}

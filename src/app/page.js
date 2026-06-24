import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, color-mix(in srgb, var(--accent) 40%, transparent), transparent)",
        }}
      />

      <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[var(--accent)]">
            AI Prompt Marketplace
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
            Forge better prompts.
            <span className="block text-[var(--accent)]">Ship faster with AI.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
            Discover curated prompts for ChatGPT, Claude, Gemini, Midjourney, and
            more. Bookmark favorites, learn from top creators, and level up your
            workflow.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/prompts"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--accent)] px-8 text-sm font-semibold text-[var(--bg)] transition-opacity hover:opacity-90"
            >
              Browse Prompts
            </Link>
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-8 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)]/50"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

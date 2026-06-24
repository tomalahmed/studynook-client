import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { RiSparkling2Fill } from "react-icons/ri";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/prompts", label: "All Prompts" },
  { href: "/pricing", label: "Pricing" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)]/15 text-[var(--accent)]">
                <RiSparkling2Fill className="h-4 w-4" />
              </span>
              <span className="font-display text-lg font-bold text-[var(--text)]">
                PromptForge
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
              Discover, share, and master AI prompts for ChatGPT, Claude, Gemini,
              Midjourney, and more.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text)]">
              Explore
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text)]">
              Connect
            </h3>
            <div className="mt-4 flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                aria-label="X"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--border)] pt-6 text-center text-sm text-[var(--muted)]">
          &copy; {new Date().getFullYear()} PromptForge. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

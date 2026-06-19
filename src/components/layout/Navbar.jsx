import { Github, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "../toggle/ThemeToggle";
import { ViewToggle } from "../toggle/ViewToggle";
import { useGitHubStats } from "../../context/GitHubStatsContext";

const links = [
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { isOpen, setIsOpen } = useGitHubStats();

  return (
    <header className="nav-shell">
      <div className="flex items-center justify-between gap-4">
        <a href="#home" className="focus-ring flex items-center gap-3 rounded-xl">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 font-display text-lg font-bold text-ink-950">
            YK
          </span>
          <span className="font-display text-base font-bold text-[var(--heading)]">Yugant.dev</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="focus-ring rounded-full px-4 py-2 text-sm font-semibold text-[var(--muted-text)] transition hover:bg-[var(--hover-bg)] hover:text-[var(--heading)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => setIsOpen(true)}
            className={`focus-ring relative flex items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition ${
              isOpen
                ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-200"
                : "border-slate-800 bg-slate-950/60 text-slate-300 hover:text-white hover:border-slate-700"
            }`}
            type="button"
            aria-label="Open GitHub Analytics panel"
          >
            <Github size={14} />
            <span>GitHub Stats</span>
          </button>
          <ViewToggle />
          <ThemeToggle />
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="focus-ring grid h-11 w-11 place-items-center rounded-xl border border-[var(--line)] text-[var(--heading)] md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className={open ? "nav-mobile-menu nav-mobile-menu--open" : "nav-mobile-menu"} aria-hidden={!open} inert={open ? undefined : true}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-[var(--body-text)]"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setIsOpen(true);
              setOpen(false);
            }}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-800 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
            type="button"
          >
            <Github size={15} />
            GitHub Stats
          </button>
          <ViewToggle />
          <ThemeToggle />
      </div>
    </header>
  );
}

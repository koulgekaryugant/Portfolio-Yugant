import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "../toggle/ThemeToggle";
import { ViewToggle } from "../toggle/ViewToggle";

const links = [
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-1/2 top-4 z-50 w-[min(1120px,calc(100%-24px))] -translate-x-1/2 rounded-2xl border border-[var(--line)] bg-[var(--nav-bg)] px-4 py-3 shadow-premium backdrop-blur-xl">
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

      {open && (
        <div className="mt-4 grid gap-3 rounded-xl border border-[var(--line)] bg-[var(--panel-strong)] p-3 md:hidden">
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
          <ViewToggle />
          <ThemeToggle />
        </div>
      )}
    </header>
  );
}

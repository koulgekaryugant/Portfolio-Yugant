import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="group/theme relative">
      <span className="pointer-events-none absolute right-0 top-full mt-3 hidden w-40 rounded-lg border border-[var(--line)] bg-[var(--panel-strong)] px-3 py-2 text-xs text-[var(--muted-text)] shadow-soft group-hover/theme:block">
        Switch light or dark theme.
      </span>
      <button
        type="button"
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        aria-pressed={isDark}
        onClick={toggleTheme}
        className="theme-switch focus-ring"
      >
        <span className="theme-switch__track">
          <span className="theme-switch__stars" aria-hidden="true" />
          <span className="theme-switch__thumb">{isDark ? <Moon size={15} /> : <Sun size={15} />}</span>
        </span>
      </button>
    </div>
  );
}

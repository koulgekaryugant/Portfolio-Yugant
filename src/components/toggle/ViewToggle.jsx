import { Code2, UserRoundCheck } from "lucide-react";
import { useViewMode } from "../../context/ViewModeContext";

export function ViewToggle() {
  const { mode, setMode } = useViewMode();
  const isDeveloper = mode === "developer";

  return (
    <div className="group relative">
      <div
        className="absolute right-0 top-full mt-3 hidden w-56 rounded-lg border border-slate-700 bg-ink-900 px-3 py-2 text-xs text-slate-300 shadow-soft group-hover:block"
        role="tooltip"
      >
        Switch perspective for recruiters or engineers.
      </div>
      <div className="relative grid grid-cols-2 rounded-full border border-slate-700 bg-slate-950/70 p-1 shadow-inner">
        <span
          className={`absolute bottom-1 ml-1 top-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg transition-transform duration-300 ${
            isDeveloper ? "translate-x-full" : "translate-x-0"
          }`}
          aria-hidden="true"
        />
        <button
          type="button"
          aria-label="Switch to HR View"
          aria-pressed={!isDeveloper}
          onClick={() => setMode("hr")}
          className={`focus-ring relative z-10 inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-bold transition ${
            !isDeveloper ? "text-ink-950" : "text-slate-300 hover:text-white"
          }`}
        >
          <UserRoundCheck size={15} />
          HR Mode
        </button>
        <button
          type="button"
          aria-label="Switch to Developer View"
          aria-pressed={isDeveloper}
          onClick={() => setMode("developer")}
          className={`focus-ring relative z-10 inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-bold transition ${
            isDeveloper ? "text-ink-950" : "text-slate-300 hover:text-white"
          }`}
        >
          <Code2 size={15} />
          Developer
        </button>
      </div>
    </div>
  );
}

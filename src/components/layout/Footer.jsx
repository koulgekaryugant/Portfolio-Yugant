import { useViewMode } from "../../context/ViewModeContext";

export function Footer() {
  const { isHR } = useViewMode();
  return (
    <footer className="mx-auto w-[min(1120px,calc(100%-32px))] border-t border-slate-800 py-8 text-center text-sm text-slate-400">
      {isHR
        ? "© 2026 Yugant D Koulgekar — Open to full-time opportunities."
        : "© 2026 Still learning. Always building. — Yugant D Koulgekar"}
    </footer>
  );
}

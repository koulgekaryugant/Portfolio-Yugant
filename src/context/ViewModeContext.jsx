import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ViewModeContext = createContext(null);
const STORAGE_KEY = "portfolio-view-mode";

export function ViewModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") return "hr";
    return window.localStorage.getItem(STORAGE_KEY) || "hr";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.dataset.viewMode = mode;
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      isHR: mode === "hr",
      isDeveloper: mode === "developer",
      setMode
    }),
    [mode]
  );

  return <ViewModeContext.Provider value={value}>{children}</ViewModeContext.Provider>;
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error("useViewMode must be used inside ViewModeProvider");
  }
  return context;
}

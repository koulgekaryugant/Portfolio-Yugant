import { createContext, useContext, useEffect, useMemo, useState } from "react";

const GitHubStatsContext = createContext(null);
const STORAGE_KEY = "gh-analytics-collapsed";

export function GitHubStatsProvider({ children }) {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    // By default it should be open (collapsed === 'false' or not set)
    return window.sessionStorage.getItem(STORAGE_KEY) !== "true";
  });

  const value = useMemo(
    () => ({
      isOpen,
      setIsOpen: (val) => {
        setIsOpen(val);
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(STORAGE_KEY, val ? "false" : "true");
        }
      },
      toggleStats: () => {
        setIsOpen((current) => {
          const next = !current;
          if (typeof window !== "undefined") {
            window.sessionStorage.setItem(STORAGE_KEY, next ? "false" : "true");
          }
          return next;
        });
      }
    }),
    [isOpen]
  );

  return (
    <GitHubStatsContext.Provider value={value}>
      {children}
    </GitHubStatsContext.Provider>
  );
}

export function useGitHubStats() {
  const context = useContext(GitHubStatsContext);
  if (!context) {
    throw new Error("useGitHubStats must be used inside a GitHubStatsProvider");
  }
  return context;
}

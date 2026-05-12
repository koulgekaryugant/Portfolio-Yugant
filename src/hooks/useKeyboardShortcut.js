import { useEffect } from "react";

export function useKeyboardShortcut(callback) {
  useEffect(() => {
    function onKeyDown(event) {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "y") {
        event.preventDefault();
        callback();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [callback]);
}

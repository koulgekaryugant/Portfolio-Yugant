import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

export function useScrollReveal(options = { once: true, margin: "-80px" }) {
  const ref = useRef(null);
  const inView = useInView(ref, options);

  useEffect(() => {
    if (inView && ref.current) {
      ref.current.classList.add("mode-transition");
    }
  }, [inView]);

  return [ref, inView];
}

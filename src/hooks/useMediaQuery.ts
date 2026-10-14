import { useEffect, useState } from "react";

/** Whether a CSS media query matches, kept up to date as the window changes. */
export function useMediaQuery(query: string, initial = false): boolean {
  const [matches, setMatches] = useState(() => (typeof window === "undefined" || !window.matchMedia ? initial : window.matchMedia(query).matches));
  useEffect(() => {
    if (!window.matchMedia) return;
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener?.("change", update);
    return () => list.removeEventListener?.("change", update);
  }, [query]);
  return matches;
}

/** Autoplaying video only where it is welcome: larger screens, no reduced motion, no data saver. */
export function useAmbientVideo(): boolean {
  const wide = useMediaQuery("(min-width: 768px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const saveData = typeof navigator !== "undefined" && (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  return wide && !reduced && !saveData;
}

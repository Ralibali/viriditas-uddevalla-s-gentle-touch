import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/** New pages start at the top; anchors wait for lazy content and Back keeps browser restoration. */
export default function RouteScroll() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const initialKey = useRef(location.key);
  const initialUrl = useRef(`${location.pathname}${location.search}${location.hash}`);
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (location.key !== initialKey.current || `${location.pathname}${location.search}${location.hash}` !== initialUrl.current) hasNavigated.current = true;
    if (navigationType === "POP" && hasNavigated.current) return;

    if (!location.hash) {
      if (navigationType !== "POP") window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }

    let id = location.hash.slice(1);
    try { id = decodeURIComponent(id); } catch { /* A malformed fragment is still safe as an ID. */ }
    const revealAnchor = () => {
      const target = document.getElementById(id);
      if (!target?.getClientRects().length) return false;
      target.scrollIntoView({ block: "start", behavior: "instant" });
      return true;
    };
    if (revealAnchor()) return;

    // The next route may still be loading inside Suspense.
    const observer = new MutationObserver(() => {
      if (revealAnchor()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const timeout = window.setTimeout(() => observer.disconnect(), 10000);
    return () => { observer.disconnect(); window.clearTimeout(timeout); };
  }, [location.key, location.pathname, location.search, location.hash, navigationType]);

  return null;
}

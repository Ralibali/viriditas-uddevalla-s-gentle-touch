import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { COOKIE_SETTINGS_EVENT, readPrivacyConsent, storePrivacyConsent } from "@/lib/privacyConsent";
import { setAnalyticsConsent } from "@/lib/ga4Runtime";

const KEY = "viriditas_ga4_consent_v2";
const PRIVATE_PATHS = ["/admin", "/dashboard"];

/**
 * The statistics choice. Shown until the visitor has chosen, and again from
 * "Cookieinställningar" in the footer. Both answers are equally easy to give.
 */
export default function AnalyticsConsent() {
  const location = useLocation();
  const [open, setOpen] = useState(() => !readPrivacyConsent(KEY));
  const dialogRef = useRef<HTMLElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const reopen = () => {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpen(true);
    };
    window.addEventListener(COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (open && returnFocus.current) dialogRef.current?.focus();
  }, [open]);

  if (!open || PRIVATE_PATHS.some((path) => location.pathname.startsWith(path))) return null;

  const choose = (accepted: boolean) => {
    storePrivacyConsent(KEY, accepted);
    setAnalyticsConsent(accepted);
    setOpen(false);
    requestAnimationFrame(() => returnFocus.current?.focus());
  };

  return (
    <section
      ref={dialogRef}
      data-prerender="skip"
      role="dialog"
      aria-modal={false}
      aria-labelledby="analytics-consent-title"
      aria-describedby="analytics-consent-description"
      tabIndex={-1}
      className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-[70] mx-auto max-w-xl rounded-2xl border border-line bg-paper-raised p-5 text-ink shadow-[0_18px_50px_-20px_hsl(var(--ink)/0.45)] sm:inset-x-6 sm:p-6"
    >
      <h2 id="analytics-consent-title" className="font-display text-xl soft-type">
        Får vi räkna besöken?
      </h2>
      <p id="analytics-consent-description" className="mt-2 type-small text-ink/80">
        Med ditt samtycke använder vi Google Analytics 4 och statistikcookies för att se hur webbplatsen används. Du kan ändra ditt val när som helst under
        Cookieinställningar längst ned på sidan.{" "}
        <Link to="/integritet" className="link">
          Läs om integritet och cookies
        </Link>
        .
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button type="button" className="btn btn-quiet" onClick={() => choose(false)}>
          Endast nödvändiga
        </button>
        <button type="button" className="btn btn-quiet" onClick={() => choose(true)}>
          Tillåt statistik
        </button>
      </div>
    </section>
  );
}

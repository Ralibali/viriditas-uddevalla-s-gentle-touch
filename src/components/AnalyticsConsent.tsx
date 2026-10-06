import { readPrivacyConsent, storePrivacyConsent } from '@/lib/privacyConsent';
import { useEffect, useRef, useState } from 'react';
import { setAnalyticsConsent } from '@/lib/ga4Runtime';

const KEY = 'viriditas_ga4_consent_v2';

export default function AnalyticsConsent() {
  const [open, setOpen] = useState(() => !readPrivacyConsent(KEY));
  const dialogRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  const choose = (accepted: boolean) => {
    storePrivacyConsent(KEY, accepted);
    setAnalyticsConsent(accepted);
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  if (!open) {
    return (
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-controls="analytics-consent"
        aria-expanded={false}
        onClick={() => setOpen(true)}
        className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-2 z-[60] rounded-lg border bg-background px-3 py-2 text-xs shadow-sm md:bottom-2"
      >
        Cookieinställningar
      </button>
    );
  }

  return (
    <section
      ref={dialogRef}
      id="analytics-consent"
      role="dialog"
      aria-modal={false}
      aria-labelledby="analytics-consent-title"
      aria-describedby="analytics-consent-description"
      tabIndex={-1}
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 right-4 z-[70] mx-auto max-h-[calc(100dvh-2rem)] max-w-lg overflow-y-auto rounded-xl border bg-background p-4 text-foreground shadow-lg"
    >
      <h2 id="analytics-consent-title" className="font-semibold">Valfri statistik</h2>
      <p id="analytics-consent-description" className="my-2 text-sm">
        Med ditt samtycke använder vi Google Analytics 4 och statistikcookies för att förstå hur webbplatsen används. Du kan ändra ditt val via Cookieinställningar.{' '}
        <a href="/integritet" className="underline">Läs om integritet och cookies</a>.
      </p>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="min-h-11 flex-1 rounded border px-3 py-2" onClick={() => choose(false)}>Endast nödvändiga</button>
        <button type="button" className="min-h-11 flex-1 rounded border px-3 py-2" onClick={() => choose(true)}>Acceptera statistik</button>
      </div>
    </section>
  );
}

// Typesafe Plausible Analytics helper.
// Sends only low-cardinality, non-personal custom event data.
// Never send personal data, phone numbers, e-mail, booking details,
// free text or full external URLs with query parameters.

type AnalyticsEvent = "Booking Click" | "Phone Click" | "Contact Click";

/**
 * Allowed custom properties. Keep these low-cardinality so Plausible
 * breakdowns stay meaningful (e.g. "hero", "navbar", "treatment-60min").
 */
interface AnalyticsProps {
  placement?: string;
  treatment_category?: string;
}

type PlausibleFn = (
  event: string,
  options?: { props?: Record<string, string | number | boolean>; callback?: () => void }
) => void;

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

/** Strip anything that could be high-cardinality or sensitive from a prop value. */
const sanitize = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

const buildProps = (props?: AnalyticsProps): Record<string, string> | undefined => {
  if (!props) return undefined;
  const out: Record<string, string> = {};
  for (const [key, raw] of Object.entries(props)) {
    if (typeof raw === "string" && raw.length > 0) {
      out[key] = sanitize(raw);
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
};

/** Low-level typesafe event dispatch. Safe to call before Plausible loads. */
export const trackEvent = (event: AnalyticsEvent, props?: AnalyticsProps): void => {
  try {
    const built = buildProps(props);
    window.plausible?.(event, built ? { props: built } : undefined);
  } catch {
    // Analytics must never break the UI.
  }
};

export const trackBookingEvent = (placement: string, treatmentCategory?: string): void =>
  trackEvent("Booking Click", { placement, treatment_category: treatmentCategory });

export const trackPhoneEvent = (placement: string): void =>
  trackEvent("Phone Click", { placement });

export const trackContactEvent = (placement: string): void =>
  trackEvent("Contact Click", { placement });

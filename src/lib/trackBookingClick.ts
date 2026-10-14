import { hasTelemetryConsent, telemetryPath } from "@/lib/privacyTelemetry";
import { insertRow } from "@/lib/backend";
import { trackBookingEvent, trackContactEvent, trackPhoneEvent } from "@/lib/analytics";

type ClickType = "booking" | "phone" | "contact";

const trackClick = async (source: string, clickType: ClickType) => {
  if (!hasTelemetryConsent()) return;
  const path = telemetryPath();
  if (!path) return;
  try {
    await insertRow("booking_clicks", {
      source,
      click_type: clickType,
      page_url: window.location.origin + path,
    });
  } catch {
    // Statistics must never block the visitor.
  }
};

export const trackBookingClick = async (source: string, treatmentCategory?: string) => {
  trackBookingEvent(source, treatmentCategory);
  await trackClick(source, "booking");
};

export const trackPhoneClick = async (source: string) => {
  trackPhoneEvent(source);
  await trackClick(source, "phone");
};

export const trackContactClick = async (source: string) => {
  trackContactEvent(source);
  await trackClick(source, "contact");
};

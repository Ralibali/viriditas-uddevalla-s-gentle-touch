import { supabase } from "@/integrations/supabase/client";
import { trackBookingEvent, trackContactEvent, trackPhoneEvent } from "@/lib/analytics";

type ClickType = "booking" | "phone" | "contact";

const trackClick = async (source: string, clickType: ClickType) => {
  try {
    await supabase.from("booking_clicks").insert({
      source,
      click_type: clickType,
      page_url: window.location.href,
    });
  } catch (e) {
    // Silently fail – don't block the user
    console.error("Failed to track click:", e);
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

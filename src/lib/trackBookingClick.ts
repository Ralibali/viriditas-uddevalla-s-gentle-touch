import { supabase } from "@/integrations/supabase/client";

type ClickType = "booking" | "phone";

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

export const trackBookingClick = async (source: string) => {
  await trackClick(source, "booking");
};

export const trackPhoneClick = async (source: string) => {
  await trackClick(source, "phone");
};

import { supabase } from "@/integrations/supabase/client";

export const trackBookingClick = async (source: string) => {
  try {
    await supabase.from("booking_clicks").insert({
      source,
      page_url: window.location.href,
    });
  } catch (e) {
    // Silently fail – don't block the user
    console.error("Failed to track click:", e);
  }
};

import { useCallback } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { getPublicContentValue, getGlobalContentValue } from "@/lib/siteContentValues";

/** A single content source for the site and its admin editor. React renders all text safely. */
export function useSiteContent(routeId: string) {
  const { data: settings } = useSiteSettings();
  const c = useCallback((key: string, fallback: string) => {
    return getPublicContentValue(routeId, key, fallback, settings);
  }, [routeId, settings]);
  const g = useCallback((key: string) => getGlobalContentValue(key, settings), [settings]);
  return { c, g, settings };
}

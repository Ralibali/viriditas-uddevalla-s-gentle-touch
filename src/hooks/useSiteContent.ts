import { useCallback, useMemo } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { getContentFieldValue, getGlobalContentValue, type SiteContentField, type SiteContentRoute } from "@/lib/siteContentValues";

/**
 * Text, links and images for one page. Defaults live in the page's content module
 * (src/content), so the site and the administration always agree. React renders
 * every value as text, never as HTML.
 */
export function useSiteContent(route: SiteContentRoute) {
  const { data: settings, isSuccess } = useSiteSettings();
  const fields = useMemo(() => new Map<string, SiteContentField>(route.fields.map((field) => [field.key, field])), [route]);
  const c = useCallback(
    (key: string) => {
      const field = fields.get(key);
      if (!field) {
        if (import.meta.env.DEV) console.warn(`Innehållsfältet ${route.id}.${key} saknas i src/content.`);
        return "";
      }
      return getContentFieldValue(field, settings);
    },
    [fields, route.id, settings],
  );
  const g = useCallback((key: string) => getGlobalContentValue(key, settings), [settings]);
  /** Sections are shown unless explicitly hidden in the administration. */
  const show = useCallback((key: string) => c(key) !== "false", [c]);
  return { c, g, show, settings, ready: isSuccess };
}

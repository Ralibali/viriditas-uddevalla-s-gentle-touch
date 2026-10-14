import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { cmsAdminCall } from "@/lib/cmsAdmin";
import { getContentFieldValue, validateContentValue, type SiteContentField } from "@/lib/siteContentValues";

export type SaveResult = { ok: boolean; key?: string };

/**
 * Local edits of site settings. Unsaved edits survive a background refresh;
 * fields nobody touched follow the newest saved value.
 * `fields` must be a stable array (defined at module level).
 */
export function useContentDraft(fields: readonly SiteContentField[]) {
  const query = useSiteSettings();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [baseline, setBaseline] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<{ key: string; message: string } | null>(null);
  const baselineRef = useRef<Record<string, string> | null>(null);

  useEffect(() => {
    if (!query.data) return;
    const fresh = Object.fromEntries(fields.map((field) => [field.settingKey, getContentFieldValue(field, query.data)]));
    const previousBaseline = baselineRef.current;
    if (!previousBaseline) setValues(fresh);
    else setValues((previous) => Object.fromEntries(Object.entries(fresh).map(([key, value]) => [key, previous[key] !== previousBaseline[key] ? previous[key] : value])));
    baselineRef.current = fresh;
    setBaseline(fresh);
  }, [query.data, fields]);

  const changedKeys = useMemo(() => Object.keys(values).filter((key) => values[key] !== baseline[key]), [values, baseline]);
  const ready = Object.keys(baseline).length > 0;

  const set = (key: string, value: string) => {
    setError(null);
    setValues((previous) => ({ ...previous, [key]: value }));
  };
  const revert = (key: string) => set(key, baseline[key] ?? "");
  const discard = () => {
    setError(null);
    setValues(baseline);
  };

  async function save(successMessage: string): Promise<SaveResult> {
    const changes = changedKeys.map((key) => ({ key, value: values[key] }));
    for (const change of changes) {
      const field = fields.find((candidate) => candidate.settingKey === change.key);
      const message = field && validateContentValue(field, change.value);
      if (message) {
        setError({ key: change.key, message });
        toast.error(message);
        return { ok: false, key: change.key };
      }
    }
    if (!changes.length) return { ok: true };
    setSaving(true);
    try {
      await cmsAdminCall<{ success: boolean }>("update_settings", { settings: changes });
      const saved = Object.fromEntries(changes.map((change) => [change.key, change.value]));
      baselineRef.current = { ...(baselineRef.current ?? {}), ...saved };
      setBaseline((previous) => ({ ...previous, ...saved }));
      await queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success(successMessage);
      return { ok: true };
    } catch (failure) {
      toast.error(failure instanceof Error ? `Kunde inte spara: ${failure.message}` : "Kunde inte spara ändringarna.");
      return { ok: false };
    } finally {
      setSaving(false);
    }
  }

  return { query, values, baseline, changedKeys, saving, error, ready, set, revert, discard, save };
}

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { cmsAdminCall } from "@/lib/cmsAdmin";
import { GLOBAL_CONTENT_FIELDS, getContentFieldValue, validateContentValue } from "@/lib/siteContent";
import MediaInput from "./MediaInput";
import { toast } from "sonner";

export default function SettingsEditor({ onDirtyChange }: { onDirtyChange?: (dirty: boolean) => void }) {
  const query = useSiteSettings();
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [baseline, setBaseline] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const initialized = useRef(false);
  const groups = [...new Set(GLOBAL_CONTENT_FIELDS.map(field => field.group))];

  useEffect(() => {
    if (!query.data || initialized.current) return;
    const initial = Object.fromEntries(GLOBAL_CONTENT_FIELDS.map(field => [field.settingKey, getContentFieldValue(field, query.data)]));
    initialized.current = true;
    setValues(initial);
    setBaseline(initial);
  }, [query.data]);

  const changes = useMemo(() => GLOBAL_CONTENT_FIELDS.filter(field => values[field.settingKey] !== baseline[field.settingKey]).map(field => ({ key: field.settingKey, value: values[field.settingKey] })), [values, baseline]);
  const dirty = changes.length > 0;
  useEffect(() => { onDirtyChange?.(dirty); }, [dirty, onDirtyChange]);

  async function save() {
    setSaveError("");
    for (const change of changes) {
      const field = GLOBAL_CONTENT_FIELDS.find(field => field.settingKey === change.key);
      const message = field && validateContentValue(field, change.value);
      if (message) { setSaveError(message); return; }
    }
    if (!changes.length) return;
    setSaving(true);
    try {
      await cmsAdminCall("update_settings", { settings: changes });
      setBaseline(previous => ({ ...previous, ...Object.fromEntries(changes.map(change => [change.key, change.value])) }));
      await qc.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Inställningarna är sparade och visas på webbplatsen.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Kunde inte spara inställningarna.";
      setSaveError(message);
      toast.error(message);
    } finally { setSaving(false); }
  }

  if (query.isLoading || !initialized.current && !query.isError) return <p role="status" className="py-12 text-center text-muted-foreground font-body">Laddar inställningar…</p>;
  if (query.isError && !initialized.current) return <div role="alert" className="bg-card border border-border rounded-xl p-5 space-y-3 font-body text-sm"><p className="text-destructive">Inställningarna kunde inte hämtas: {query.error.message}</p><button onClick={() => query.refetch()} className="text-primary underline">Försök igen</button></div>;

  return <div className="space-y-6 font-body">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h2 className="text-xl font-display font-semibold">Gemensamma inställningar</h2><p className="text-muted-foreground text-sm mt-1">Kontaktuppgifter, bokningslänk och priser gäller hela webbplatsen. Sidornas texter och bilder finns under Innehåll.</p></div>
      <button type="button" onClick={save} disabled={saving || !dirty} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm disabled:opacity-50">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? "Sparar…" : dirty ? "Spara ändringar" : "Allt sparat"}</button>
    </div>
    {saveError && <p role="alert" className="rounded-xl border border-destructive/30 p-4 text-destructive text-sm">{saveError}</p>}
    {groups.map(group => <details key={group} open className="bg-card border border-border rounded-2xl">
      <summary className="px-5 py-4 font-display font-semibold cursor-pointer">{group}</summary>
      <div className="px-5 pb-5 pt-4 border-t border-border space-y-4">{GLOBAL_CONTENT_FIELDS.filter(field => field.group === group).map(field => {
        const id = `setting-${field.settingKey}`;
        const value = values[field.settingKey] ?? field.defaultValue;
        const change = (value: string) => { setSaveError(""); setValues(previous => ({ ...previous, [field.settingKey]: value })); };
        if (field.kind === "image") return <MediaInput key={field.settingKey} id={id} label={field.label} value={value} onChange={change} disabled={saving} />;
        return <div key={field.settingKey}>
          <label htmlFor={id} className="text-sm font-medium block mb-1">{field.label}</label>
          {field.kind === "longtext" ? <textarea id={id} value={value} onChange={event => change(event.target.value)} disabled={saving} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm resize-y min-h-24" /> : <input id={id} value={value} type={field.settingKey === "email" ? "email" : "text"} onChange={event => change(event.target.value)} disabled={saving} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm" />}
        </div>;
      })}</div>
    </details>)}
  </div>;
}

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Loader2, Save, Search } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { cmsAdminCall } from "@/lib/cmsAdmin";
import { GLOBAL_CONTENT_FIELDS, SITE_CONTENT_ROUTES, getContentFieldValue, validateContentValue, type SiteContentField } from "@/lib/siteContent";
import MediaInput from "./MediaInput";

interface ContentEditorProps { onDirtyChange?: (dirty: boolean) => void }
const ALL_FIELDS = [...GLOBAL_CONTENT_FIELDS, ...SITE_CONTENT_ROUTES.flatMap(route => route.fields)];

export default function ContentEditor({ onDirtyChange }: ContentEditorProps) {
  const query = useSiteSettings();
  const queryClient = useQueryClient();
  const [routeId, setRouteId] = useState("global");
  const [search, setSearch] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [baseline, setBaseline] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const initialized = useRef(false);
  const baselineRef = useRef<Record<string, string>>({});
  const [fieldError, setFieldError] = useState<{ key: string; message: string } | null>(null);

  useEffect(() => {
    if (!query.data) return;
    const fresh = Object.fromEntries(ALL_FIELDS.map(field => [field.settingKey, getContentFieldValue(field, query.data)]));
    const previousBaseline = baselineRef.current;
    if (!initialized.current) setValues(fresh);
    else setValues(previous => Object.fromEntries(Object.entries(fresh).map(([key, value]) => [key, previous[key] !== previousBaseline[key] ? previous[key] : value])));
    initialized.current = true;
    baselineRef.current = fresh;
    setBaseline(fresh);
  }, [query.data]);

  const changedKeys = useMemo(() => Object.keys(values).filter(key => values[key] !== baseline[key]), [values, baseline]);
  const dirty = changedKeys.length > 0;
  useEffect(() => { onDirtyChange?.(dirty); }, [dirty, onDirtyChange]);
  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  const route = SITE_CONTENT_ROUTES.find(route => route.id === routeId);
  const fields = routeId === "global" ? GLOBAL_CONTENT_FIELDS : route?.fields || [];
  const visibleFields = fields.filter(field => `${field.label} ${values[field.settingKey] || ""}`.toLocaleLowerCase("sv").includes(search.toLocaleLowerCase("sv")));
  const groups = [...new Set(visibleFields.map(field => field.group))];

  const change = (field: SiteContentField, value: string) => {
    setFieldError(null);
    setValues(previous => ({ ...previous, [field.settingKey]: value }));
  };

  const save = async () => {
    const changes = changedKeys.map(key => ({ key, value: values[key] }));
    for (const change of changes) {
      const field = ALL_FIELDS.find(field => field.settingKey === change.key);
      const message = field && validateContentValue(field, change.value);
      if (message) {
        const owner = SITE_CONTENT_ROUTES.find(route => route.fields.some(field => field.settingKey === change.key));
        setRouteId(GLOBAL_CONTENT_FIELDS.some(field => field.settingKey === change.key) ? "global" : owner?.id || routeId);
        setSearch("");
        setFieldError({ key: change.key, message });
        toast.error(message);
        return;
      }
    }
    if (!changes.length) return;
    setSaving(true);
    try {
      await cmsAdminCall<{ success: boolean }>("update_settings", { settings: changes });
      const saved = Object.fromEntries(changes.map(change => [change.key, change.value]));
      baselineRef.current = { ...baselineRef.current, ...saved };
      setBaseline(previous => ({ ...previous, ...saved }));
      await queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Ändringarna är sparade och visas på webbplatsen.");
    } catch (error) {
      toast.error(error instanceof Error ? `Kunde inte spara: ${error.message}` : "Kunde inte spara ändringarna.");
    } finally {
      setSaving(false);
    }
  };

  if (query.isLoading || !initialized.current && !query.isError) return <p className="py-12 text-center text-muted-foreground">Laddar webbplatsens innehåll…</p>;
  if (query.isError && !initialized.current) return <div role="alert" className="rounded-2xl border border-destructive/30 p-6"><p>Webbplatsens innehåll kunde inte hämtas.</p><button className="mt-3 underline" onClick={() => void query.refetch()}>Försök igen</button></div>;

  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h2 className="text-xl font-display font-semibold">Webbplatsens innehåll</h2><p className="mt-1 text-sm text-muted-foreground">Redigera texter, bilder, länkar och sökinformation på samtliga sidor.</p></div>
      <button type="button" onClick={() => void save()} disabled={saving || !dirty} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saving ? "Sparar…" : dirty ? `Spara ${changedKeys.length} ändring${changedKeys.length === 1 ? "" : "ar"}` : "Allt sparat"}
      </button>
    </div>
    <div className="grid gap-4 rounded-2xl border border-border bg-card p-5 md:grid-cols-2">
      <div><label htmlFor="content-route" className="mb-1 block text-sm font-medium">Välj del av webbplatsen</label><select id="content-route" value={routeId} onChange={event => { setRouteId(event.target.value); setSearch(""); }} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"><option value="global">Gemensamt – kontakt, bokning och priser</option>{SITE_CONTENT_ROUTES.map(route => <option key={route.id} value={route.id}>{route.label}</option>)}</select></div>
      <div><label htmlFor="content-search" className="mb-1 block text-sm font-medium">Hitta text eller bild</label><div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><input id="content-search" value={search} onChange={event => setSearch(event.target.value)} className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm" placeholder="Sök i den valda sidan…" /></div></div>
      <p className="text-xs text-muted-foreground md:col-span-2">Gemensamma bokningslänkar och kontaktuppgifter gäller hela webbplatsen. Grundtexternas priser följer prisinställningarna tills du själv ändrar den texten.</p>
      {route && <a href={route.path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">Visa sidan <ExternalLink className="h-3.5 w-3.5" /></a>}
    </div>
    {fieldError && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{fieldError.message}</p>}
    {!visibleFields.length && <p className="py-8 text-center text-muted-foreground">Inga fält matchar din sökning.</p>}
    {groups.map(group => <details key={`${routeId}-${group}`} open className="rounded-2xl border border-border bg-card">
      <summary className="cursor-pointer px-5 py-4 font-display font-semibold">{group}</summary>
      <div className="space-y-5 border-t border-border p-5">{visibleFields.filter(field => field.group === group).map(field => {
        const id = `content-${field.settingKey.replace(/[^a-z0-9_-]/gi, "-")}`;
        const value = values[field.settingKey] ?? getContentFieldValue(field, query.data);
        if (field.kind === "toggle") return <label key={field.key} htmlFor={id} className="flex items-center gap-3 rounded-lg border border-border p-3"><input id={id} type="checkbox" checked={value !== "false"} disabled={saving} onChange={event => change(field, event.target.checked ? "true" : "false")} className="h-4 w-4 accent-primary" /><span className="text-sm font-medium">{field.label}</span></label>;
        if (field.kind === "image") return <MediaInput key={field.key} id={id} label={field.label} value={value} onChange={value => change(field, value)} disabled={saving} />;
        return <div key={field.key}>
          <label htmlFor={id} className="mb-1 block text-sm font-medium">{field.label}</label>
          {field.kind === "longtext" ? <textarea id={id} value={value} disabled={saving} onChange={event => change(field, event.target.value)} className="min-h-28 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm" aria-invalid={fieldError?.key === field.settingKey} /> : <input id={id} value={value} disabled={saving} onChange={event => change(field, event.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm" aria-invalid={fieldError?.key === field.settingKey} />}
          {field.kind === "video" && <p className="mt-1 text-xs text-muted-foreground">Ange en https-adress till filmfilen eller en sökväg på webbplatsen.</p>}
        </div>;
      })}</div>
    </details>)}
  </div>;
}

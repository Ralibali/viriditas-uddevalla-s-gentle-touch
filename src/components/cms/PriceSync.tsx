import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import { useOverview, useRunJob, useSyncedTreatments } from "@/hooks/useAdmin";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { cmsAdminCall } from "@/lib/cmsAdmin";
import { formatDateTime } from "@/lib/adminTypes";
import { matchTreatment, priceText } from "@/lib/priceSync";
import { getGlobalContentValue, treatmentPriceNumber } from "@/lib/siteContentValues";

const MINUTES = [30, 45, 60, 80] as const;

export default function PriceSync() {
  const qc = useQueryClient();
  const { data: settings } = useSiteSettings();
  const treatments = useSyncedTreatments();
  const overview = useOverview();
  const fetchNow = useRunJob("sync-treatments");
  const [saving, setSaving] = useState(false);
  const rows = MINUTES.map((minutes) => {
    const site = getGlobalContentValue(`treatment_${minutes}_price`, settings);
    const match = matchTreatment(treatments.data ?? [], minutes);
    const differs = !!match && Number(treatmentPriceNumber(site)) !== match.price_sek;
    return { minutes, site, match, differs };
  });
  const changes = rows.filter((row) => row.differs && row.match?.price_sek != null);
  const others = (treatments.data ?? []).filter((treatment) => !rows.some((row) => row.match?.service_ref === treatment.service_ref));
  const lastRun = overview.data?.jobs?.["sync-treatments"];

  async function applyBokadirektPrices() {
    if (!changes.length) return;
    if (!window.confirm(`Uppdatera ${changes.length} ${changes.length === 1 ? "pris" : "priser"} på webbplatsen till samma som i Bokadirekt?`)) return;
    setSaving(true);
    try {
      await cmsAdminCall("update_settings", { settings: changes.map((row) => ({ key: `treatment_${row.minutes}_price`, value: priceText(row.match!.price_sek!) })) });
      await qc.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Priserna på webbplatsen är uppdaterade.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Priserna kunde inte sparas.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-semibold">Priser</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Jämför priserna på webbplatsen med behandlingarna i Bokadirekt. Priserna på webbplatsen används i prislistan, i texterna och i informationen till Google.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void applyBokadirektPrices()}
          disabled={!changes.length || saving}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
          {saving ? "Sparar…" : "Använd Bokadirekts priser"}
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">
          Senast hämtat från Bokadirekt: <strong>{formatDateTime(lastRun?.last_finished_at ?? treatments.data?.[0]?.last_synced_at)}</strong>
          {lastRun?.last_result?.success === false && <span className="block text-destructive">Senaste försöket misslyckades: {lastRun.last_result.error}</span>}
        </p>
        <button
          type="button"
          disabled={fetchNow.isPending}
          onClick={() => fetchNow.mutate(undefined, { onSuccess: () => toast.success("Behandlingarna är hämtade."), onError: (error) => toast.error(error.message) })}
          className="rounded-xl px-4 py-2 flex items-center justify-center gap-2 border border-border text-sm hover:bg-muted disabled:opacity-50"
        >
          {fetchNow.isPending ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <RefreshCw className="w-4 h-4" aria-hidden="true" />}
          {fetchNow.isPending ? "Hämtar…" : "Hämta från Bokadirekt nu"}
        </button>
      </div>

      {treatments.isError && (
        <p role="alert" className="text-sm text-destructive">
          {treatments.error.message}
        </p>
      )}

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Priser på webbplatsen och i Bokadirekt">
          <table className="w-full min-w-[30rem] text-sm">
            <caption className="sr-only">Klassisk massage: pris på webbplatsen och i Bokadirekt</caption>
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="py-2 text-muted-foreground font-medium">Klassisk massage</th>
                <th scope="col" className="py-2 text-muted-foreground font-medium">Webbplatsen</th>
                <th scope="col" className="py-2 text-muted-foreground font-medium">Bokadirekt</th>
                <th scope="col" className="py-2 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.minutes} className="border-b border-border/50">
                  <th scope="row" className="py-3 text-left font-normal">
                    {row.minutes} min
                  </th>
                  <td className="py-3">{row.site}</td>
                  <td className="py-3">{row.match?.price_sek != null ? priceText(row.match.price_sek) : "Hittades inte"}</td>
                  <td className="py-3">
                    {!row.match ? (
                      <span className="text-muted-foreground">Ingen jämförelse</span>
                    ) : row.differs ? (
                      <span className="font-medium text-destructive">Skiljer sig</span>
                    ) : (
                      <span className="font-medium text-primary">Stämmer</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!changes.length && treatments.data && <p className="mt-4 text-sm text-muted-foreground">Priserna stämmer med Bokadirekt.</p>}
      </div>

      {others.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="font-display font-semibold mb-3">Övriga behandlingar i Bokadirekt</h3>
          <ul className="divide-y divide-border text-sm">
            {others.map((treatment) => (
              <li key={treatment.service_ref} className="flex justify-between gap-4 py-2.5">
                <span>
                  {treatment.title}
                  {treatment.duration_minutes ? `, ${treatment.duration_minutes} min` : ""}
                </span>
                <span>{treatment.price_sek != null ? priceText(treatment.price_sek) : "–"}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

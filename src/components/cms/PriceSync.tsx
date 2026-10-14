import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useOverview, useRunJob, useSyncedTreatments } from "@/hooks/useAdmin";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { cmsAdminCall } from "@/lib/cmsAdmin";
import { formatDateTime } from "@/lib/adminTypes";
import { matchTreatment, priceText } from "@/lib/priceSync";
import { getGlobalContentValue, TREATMENT_MINUTES, treatmentPriceNumber } from "@/lib/siteContentValues";

export default function PriceSync() {
  const qc = useQueryClient();
  const { data: settings } = useSiteSettings();
  const treatments = useSyncedTreatments();
  const overview = useOverview();
  const fetchNow = useRunJob("sync-treatments");
  const [saving, setSaving] = useState(false);
  const rows = TREATMENT_MINUTES.map((minutes) => {
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
    <div className="space-y-8">
      <div>
        <p className="max-w-2xl text-moss">
          Jämför priserna på webbplatsen med behandlingarna i Bokadirekt. Priserna på webbplatsen används i prislistan, i texter och för Google.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-paper-raised p-5 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Senast hämtat från Bokadirekt: <strong>{formatDateTime(lastRun?.last_finished_at ?? treatments.data?.[0]?.last_synced_at)}</strong>
          {lastRun?.last_result?.success === false && <span className="block text-destructive">Senaste försöket misslyckades: {lastRun.last_result.error}</span>}
        </p>
        <button
          type="button"
          disabled={fetchNow.isPending}
          onClick={() => fetchNow.mutate(undefined, { onSuccess: () => toast.success("Behandlingarna är hämtade."), onError: (error) => toast.error(error.message) })}
          className="btn btn-quiet min-h-11 disabled:opacity-50"
        >
          {fetchNow.isPending ? "Hämtar…" : "Hämta från Bokadirekt nu"}
        </button>
      </div>

      {treatments.isError && (
        <p role="alert" className="font-semibold text-destructive">
          {treatments.error.message}
        </p>
      )}

      <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Priser på webbplatsen och i Bokadirekt">
        <table className="w-full min-w-[32rem] text-left">
          <caption className="sr-only">Klassisk massage: pris på webbplatsen och i Bokadirekt</caption>
          <thead>
            <tr className="border-b-2 border-ink">
              <th scope="col" className="py-3 pr-4 font-semibold">Klassisk massage</th>
              <th scope="col" className="py-3 pr-4 font-semibold">Webbplatsen</th>
              <th scope="col" className="py-3 pr-4 font-semibold">Bokadirekt</th>
              <th scope="col" className="py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.minutes} className="border-b border-line">
                <th scope="row" className="py-3 pr-4 font-normal">
                  {row.minutes} min
                </th>
                <td className="py-3 pr-4">{row.site}</td>
                <td className="py-3 pr-4">{row.match?.price_sek != null ? priceText(row.match.price_sek) : "Hittades inte"}</td>
                <td className="py-3">
                  {!row.match ? (
                    <span className="text-moss">Ingen jämförelse</span>
                  ) : row.differs ? (
                    <span className="font-semibold text-destructive">Skiljer sig</span>
                  ) : (
                    <span className="font-semibold text-primary">Stämmer</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={() => void applyBokadirektPrices()} disabled={!changes.length || saving} className="btn btn-primary disabled:opacity-50">
          {saving ? "Sparar…" : "Använd Bokadirekts priser"}
        </button>
        {!changes.length && treatments.data && <p className="text-moss">Priserna stämmer med Bokadirekt.</p>}
      </div>

      {others.length > 0 && (
        <div>
          <h2 className="font-display text-xl soft-type">Övriga behandlingar i Bokadirekt</h2>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {others.map((treatment) => (
              <li key={treatment.service_ref} className="flex justify-between gap-4 py-3">
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

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cmsAdminCall } from "@/lib/cmsAdmin";
import { summarizeClicks, type BookingClick } from "@/lib/bookingStats";

const PERIODS = [7, 30, 90] as const;
type Period = (typeof PERIODS)[number];
const SOURCE_PREVIEW = 8;

const dayLabel = new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "short", timeZone: "UTC" });
const formatDay = (date: string) => dayLabel.format(new Date(`${date}T12:00:00Z`)).replace(".", "");

function changeText(current: number, previous: number): string {
  const change = current - previous;
  if (change === 0) return "Lika många som perioden innan";
  return `${change > 0 ? "+" : "−"}${Math.abs(change)} mot perioden innan`;
}

function Tile({ label, value, detail, compact = false }: { label: string; value: string; detail?: string; compact?: boolean }) {
  return (
    <div className="min-w-0 rounded-2xl border border-line bg-paper-raised p-5">
      <p className="type-small text-moss">{label}</p>
      <p className={`mt-2 break-words font-display text-ink ${compact ? "text-2xl leading-tight" : "text-4xl leading-none"}`}>{value}</p>
      {detail && <p className="mt-2 type-small text-ink/70">{detail}</p>}
    </div>
  );
}

export default function BookingStatistics() {
  const [period, setPeriod] = useState<Period>(30);
  const [allSources, setAllSources] = useState(false);
  const clicks = useQuery({
    queryKey: ["booking-clicks-dashboard"],
    queryFn: () => cmsAdminCall<BookingClick[]>("get_booking_clicks"),
    retry: false,
  });
  const summary = useMemo(() => summarizeClicks(clicks.data ?? [], period), [clicks.data, period]);

  if (clicks.isError) {
    return (
      <div role="alert" className="rounded-2xl border border-destructive/30 bg-paper-raised p-6">
        <p className="font-semibold text-destructive">Statistiken kunde inte hämtas: {clicks.error.message}</p>
        <button type="button" onClick={() => void clicks.refetch()} className="link mt-3">
          Försök igen
        </button>
      </div>
    );
  }
  if (clicks.isLoading) return <p role="status" className="py-12 text-moss">Hämtar statistiken…</p>;

  const total = summary.booking + summary.contact;
  const max = Math.max(1, ...summary.days.map((day) => day.count));
  const busiest = summary.days.reduce((best, day) => (day.count > best.count ? day : best), summary.days[0]);
  const sources = allSources ? summary.sources : summary.sources.slice(0, SOURCE_PREVIEW);
  const topSource = summary.sources[0]?.value ?? 1;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className="max-w-2xl text-moss">
          Klick på boka, ring och mejla på webbplatsen. Bokningarna och betalningarna finns i Bokadirekt. Besökare som tackar nej till statistik räknas inte.
        </p>
        <div role="group" aria-label="Period" className="flex rounded-full border border-line bg-paper-raised p-1">
          {PERIODS.map((days) => (
            <button
              key={days}
              type="button"
              aria-pressed={period === days}
              onClick={() => setPeriod(days)}
              className={`min-h-10 rounded-full px-4 text-sm font-semibold transition-colors ${period === days ? "bg-primary text-primary-foreground" : "text-ink/75 hover:text-ink"}`}
            >
              {days} dagar
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Tile label="Klick på boka" value={String(summary.booking)} detail={changeText(summary.booking, summary.previousBooking)} />
        <Tile label="Samtal och mejl" value={String(summary.contact)} detail={changeText(summary.contact, summary.previousContact)} />
        <Tile label="I dag" value={String(summary.today)} detail="Räknat i svensk tid" />
        <Tile label="Flest klick" compact={!!summary.sources[0]} value={summary.sources[0]?.name ?? "–"} detail={summary.sources[0] ? `${summary.sources[0].value} av ${total} klick` : undefined} />
      </div>

      <section aria-labelledby="stats-days">
        <h2 id="stats-days" className="font-display text-xl soft-type">
          Klick per dag
        </h2>
        {total === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-line p-8 text-center text-moss">Inga klick under de senaste {period} dagarna.</p>
        ) : (
          <>
            <div
              role="img"
              aria-label={`Klick per dag de senaste ${period} dagarna, totalt ${total}. Flest klick ${formatDay(busiest.date)}: ${busiest.count}.`}
              className="mt-4 rounded-2xl border border-line bg-paper-raised px-4 pb-3 pt-6 sm:px-6"
            >
              <div className="flex h-44 items-end gap-[3px] border-b border-ink/30">
                {summary.days.map((day) => (
                  <div key={day.date} className="flex h-full min-w-0 flex-1 items-end" title={`${formatDay(day.date)}: ${day.count} klick`}>
                    <div
                      className={`w-full rounded-t-[3px] ${day.count ? "bg-primary" : "bg-line"}`}
                      style={{ height: day.count ? `${Math.max(4, (day.count / max) * 100)}%` : "2px" }}
                    />
                  </div>
                ))}
              </div>
              {period === 7 ? (
                <div aria-hidden="true" className="mt-2 flex gap-[3px] text-xs text-moss">
                  {summary.days.map((day) => (
                    <span key={day.date} className="min-w-0 flex-1 text-center">
                      {formatDay(day.date)}
                    </span>
                  ))}
                </div>
              ) : (
                <div aria-hidden="true" className="mt-2 flex justify-between text-xs text-moss">
                  <span>{formatDay(summary.days[0].date)}</span>
                  <span>{formatDay(summary.days[Math.floor(summary.days.length / 2)].date)}</span>
                  <span>{formatDay(summary.days[summary.days.length - 1].date)}</span>
                </div>
              )}
              <p aria-hidden="true" className="mt-3 type-small text-moss">
                Högsta stapeln: {max} klick
              </p>
            </div>
            <details className="mt-3">
              <summary className="cursor-pointer font-semibold text-primary">Visa siffrorna dag för dag</summary>
              <table className="mt-3 w-full max-w-sm text-left">
                <caption className="sr-only">Klick per dag</caption>
                <thead>
                  <tr className="border-b border-ink">
                    <th scope="col" className="py-2 font-semibold">
                      Dag
                    </th>
                    <th scope="col" className="py-2 text-right font-semibold">
                      Klick
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...summary.days].reverse().map((day) => (
                    <tr key={day.date} className="border-b border-line">
                      <td className="py-1.5">{formatDay(day.date)}</td>
                      <td className="py-1.5 text-right">{day.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          </>
        )}
      </section>

      {summary.sources.length > 0 && (
        <section aria-labelledby="stats-sources">
          <h2 id="stats-sources" className="font-display text-xl soft-type">
            Var på webbplatsen klickar besökarna?
          </h2>
          <ol className="mt-4 divide-y divide-line border-y border-line">
            {sources.map((source) => (
              <li key={source.source} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-2 py-3 sm:grid-cols-[minmax(0,20rem)_minmax(0,1fr)_3.5rem]">
                <span className="min-w-0 break-words">{source.name}</span>
                <span aria-hidden="true" className="col-span-2 row-start-2 h-2.5 overflow-hidden rounded-full bg-paper-deep sm:col-span-1 sm:col-start-2 sm:row-start-1">
                  <span className="block h-full rounded-full bg-primary" style={{ width: `${(source.value / topSource) * 100}%` }} />
                </span>
                <span className="text-right font-semibold tabular-nums sm:col-start-3 sm:row-start-1">
                  {source.value}
                  <span className="sr-only"> klick</span>
                </span>
              </li>
            ))}
          </ol>
          {summary.sources.length > SOURCE_PREVIEW && (
            <button type="button" onClick={() => setAllSources((open) => !open)} className="link mt-4">
              {allSources ? "Visa färre" : `Visa alla ${summary.sources.length} platser`}
            </button>
          )}
        </section>
      )}
    </div>
  );
}

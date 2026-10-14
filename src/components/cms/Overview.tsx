import { ExternalLink } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useOverview, type AdminTab } from "@/hooks/useAdmin";
import { getGlobalContentValue } from "@/lib/siteContentValues";
import { formatDateTime } from "@/lib/adminTypes";
import { formatRating } from "@/lib/format";

function Tile({ label, value, detail, onClick }: { label: string; value: string; detail?: string; onClick?: () => void }) {
  const body = (
    <>
      <span className="block type-small text-moss">{label}</span>
      <span className="mt-2 block font-display text-4xl leading-none text-ink">{value}</span>
      {detail && <span className="mt-2 block type-small text-ink/70">{detail}</span>}
    </>
  );
  return onClick ? (
    <button type="button" onClick={onClick} className="rounded-2xl border border-line bg-paper-raised p-5 text-left transition-colors hover:border-primary">
      {body}
    </button>
  ) : (
    <div className="rounded-2xl border border-line bg-paper-raised p-5">{body}</div>
  );
}

export default function Overview({ onNavigate }: { onNavigate: (tab: AdminTab) => void }) {
  const overview = useOverview();
  const { data: settings } = useSiteSettings();
  const data = overview.data;

  if (overview.isLoading) return <p role="status" className="py-12 text-moss">Hämtar översikten…</p>;
  if (overview.isError)
    return (
      <div role="alert" className="rounded-2xl border border-destructive/30 bg-paper-raised p-6">
        <p className="font-semibold text-destructive">Översikten kunde inte hämtas: {overview.error.message}</p>
        <button type="button" onClick={() => void overview.refetch()} className="link mt-3">
          Försök igen
        </button>
      </div>
    );

  const clicks = data?.booking_clicks;
  const change = clicks?.last_7_days != null && clicks.previous_7_days != null ? clicks.last_7_days - clicks.previous_7_days : null;
  const reviewsRun = data?.jobs?.["scrape-reviews"];
  const daysSinceReviews = reviewsRun?.last_finished_at ? (Date.now() - new Date(reviewsRun.last_finished_at).getTime()) / 86_400_000 : Infinity;

  const todo: { text: string; action?: { label: string; tab: AdminTab } }[] = [];
  if (!data?.messages) todo.push({ text: "Meddelanden från formulären är inte aktiverade. Den senaste databasuppdateringen behöver köras." });
  else if (data.messages.new > 0) todo.push({ text: `${data.messages.new} ${data.messages.new === 1 ? "nytt meddelande väntar" : "nya meddelanden väntar"} på svar.`, action: { label: "Öppna meddelanden", tab: "messages" } });
  if (daysSinceReviews > 7) todo.push({ text: "Omdömena från Bokadirekt har inte hämtats på en vecka.", action: { label: "Gå till omdömen", tab: "reviews" } });
  if (!getGlobalContentValue("google_review_url", settings)) todo.push({ text: "Lägg till en länk där kunder kan lämna omdöme på Google. Fler Google-omdömen hjälper i kartsöket.", action: { label: "Öppna inställningar", tab: "settings" } });
  if (!getGlobalContentValue("phone", settings)) todo.push({ text: "Inget telefonnummer visas. Lägg till ett om du vill att kunder ska kunna ringa.", action: { label: "Öppna inställningar", tab: "settings" } });

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Tile
          label="Nya meddelanden"
          value={data?.messages ? String(data.messages.new) : "–"}
          detail={data?.messages ? `${data.messages.gift_cards_new} presentkort, ${data.messages.total} totalt` : "Inte aktiverat"}
          onClick={() => onNavigate("messages")}
        />
        <Tile
          label="Klick på boka, 7 dagar"
          value={clicks?.last_7_days != null ? String(clicks.last_7_days) : "–"}
          detail={change == null ? undefined : change === 0 ? "Samma som veckan innan" : `${change > 0 ? "+" : ""}${change} mot veckan innan`}
          onClick={() => onNavigate("stats")}
        />
        <Tile
          label="Betyg på Bokadirekt"
          value={data?.reviews?.rating ? formatRating(data.reviews.rating) : "–"}
          detail={data?.reviews?.count ? `${data.reviews.count} omdömen` : undefined}
          onClick={() => onNavigate("reviews")}
        />
        <Tile
          label="Publicerade artiklar"
          value={data?.pages ? String(data.pages.published) : "–"}
          detail={data?.pages ? `${data.pages.drafts} utkast` : undefined}
          onClick={() => onNavigate("pages")}
        />
      </div>

      <section aria-labelledby="todo-title">
        <h2 id="todo-title" className="type-h3">
          Att göra
        </h2>
        {todo.length === 0 ? (
          <p className="mt-3 text-moss">Allt är i ordning.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {todo.map((item) => (
              <li key={item.text} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                <span>{item.text}</span>
                {item.action && (
                  <button type="button" onClick={() => onNavigate(item.action!.tab)} className="link shrink-0 text-left">
                    {item.action.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="sync-title" className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 id="sync-title" className="type-h3">
            Hämtat från Bokadirekt
          </h2>
          <dl className="mt-4 divide-y divide-line border-y border-line">
            <div className="flex justify-between gap-4 py-3">
              <dt>Omdömen</dt>
              <dd className="text-right text-ink/75">{formatDateTime(data?.jobs?.["scrape-reviews"]?.last_finished_at)}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt>Behandlingar och priser</dt>
              <dd className="text-right text-ink/75">{formatDateTime(data?.jobs?.["sync-treatments"]?.last_finished_at)}</dd>
            </div>
          </dl>
        </div>
        <div>
          <h2 className="type-h3">Genvägar</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {[
              { label: "Visa webbplatsen", href: "/" },
              { label: "Bokningar i Bokadirekt", href: getGlobalContentValue("booking_url", settings) },
              { label: "Google Search Console", href: "https://search.google.com/search-console" },
              { label: "Google Företagsprofil", href: "https://business.google.com/" },
            ].map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 py-3 hover:text-primary">
                  {link.label}
                  <ExternalLink aria-hidden="true" className="h-4 w-4" />
                  <span className="sr-only"> (öppnas i ny flik)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

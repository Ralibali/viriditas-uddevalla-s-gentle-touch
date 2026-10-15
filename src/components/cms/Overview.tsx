import type { ElementType } from "react";
import { ExternalLink, FileText, Inbox, MousePointerClick, Star } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useOverview, type AdminTab } from "@/hooks/useAdmin";
import { getGlobalContentValue } from "@/lib/siteContentValues";
import { formatDateTime } from "@/lib/adminTypes";
import { formatRating } from "@/lib/format";

interface TileProps {
  label: string;
  value: string;
  detail?: string;
  icon: ElementType;
  onClick: () => void;
}

function Tile({ label, value, detail, icon: Icon, onClick }: TileProps) {
  return (
    <button type="button" onClick={onClick} className="min-w-0 bg-card border border-border rounded-2xl p-5 shadow-sm text-left transition-colors hover:border-primary/50">
      <span className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
        <span className="text-muted-foreground text-xs font-body">{label}</span>
      </span>
      <span className="block break-words text-2xl font-display font-bold text-foreground">{value}</span>
      {detail && <span className="mt-1 block text-xs text-muted-foreground font-body">{detail}</span>}
    </button>
  );
}

export default function Overview({ onNavigate }: { onNavigate: (tab: AdminTab) => void }) {
  const overview = useOverview();
  const { data: settings } = useSiteSettings();
  const data = overview.data;

  if (overview.isLoading) return <p role="status" className="py-12 text-center text-muted-foreground font-body">Hämtar översikten…</p>;
  if (overview.isError) {
    return (
      <div role="alert" className="bg-card border border-border rounded-2xl p-6 space-y-3 font-body">
        <p className="text-destructive">Översikten kunde inte hämtas: {overview.error.message}</p>
        <button type="button" onClick={() => void overview.refetch()} className="text-primary underline">
          Försök igen
        </button>
      </div>
    );
  }

  const clicks = data?.booking_clicks;
  const change = clicks?.last_7_days != null && clicks.previous_7_days != null ? clicks.last_7_days - clicks.previous_7_days : null;
  const reviewsRun = data?.jobs?.["scrape-reviews"];
  const daysSinceReviews = reviewsRun?.last_finished_at ? (Date.now() - new Date(reviewsRun.last_finished_at).getTime()) / 86_400_000 : Infinity;
  const hasMessages = (data?.messages?.total ?? 0) > 0;

  const todo: { text: string; action?: { label: string; tab: AdminTab } }[] = [];
  if (data?.messages && data.messages.new > 0) {
    todo.push({ text: `${data.messages.new} ${data.messages.new === 1 ? "nytt meddelande väntar" : "nya meddelanden väntar"} på svar.`, action: { label: "Öppna meddelanden", tab: "messages" } });
  }
  if (daysSinceReviews > 7) todo.push({ text: "Omdömena från Bokadirekt har inte hämtats på en vecka.", action: { label: "Gå till omdömen", tab: "reviews" } });

  return (
    <div className="space-y-8 font-body">
      <div>
        <h2 className="text-xl font-display font-semibold">Översikt</h2>
        <p className="mt-1 text-sm text-muted-foreground">Det viktigaste just nu. Klicka på en ruta för att gå vidare.</p>
      </div>

      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${hasMessages ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        {hasMessages && (
          <Tile
            label="Nya meddelanden"
            value={String(data?.messages?.new ?? 0)}
            detail={`${data?.messages?.total ?? 0} totalt`}
            icon={Inbox}
            onClick={() => onNavigate("messages")}
          />
        )}
        <Tile
          label="Klick på boka, senaste 7 dagarna"
          value={clicks?.last_7_days != null ? String(clicks.last_7_days) : "–"}
          detail={change == null ? undefined : change === 0 ? "Samma som veckan innan" : `${change > 0 ? "+" : ""}${change} jämfört med veckan innan`}
          icon={MousePointerClick}
          onClick={() => onNavigate("stats")}
        />
        <Tile
          label="Betyg på Bokadirekt"
          value={data?.reviews?.rating ? formatRating(data.reviews.rating) : "–"}
          detail={data?.reviews?.count ? `${data.reviews.count} omdömen` : undefined}
          icon={Star}
          onClick={() => onNavigate("reviews")}
        />
        <Tile
          label="Publicerade sidor"
          value={data?.pages ? String(data.pages.published) : "–"}
          detail={data?.pages ? `${data.pages.drafts} utkast` : undefined}
          icon={FileText}
          onClick={() => onNavigate("pages")}
        />
      </div>

      <section aria-labelledby="todo-title" className="bg-card border border-border rounded-2xl p-5 sm:p-6">
        <h3 id="todo-title" className="font-display font-semibold">
          Att göra
        </h3>
        {todo.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Allt är i ordning.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {todo.map((item) => (
              <li key={item.text} className="flex flex-col gap-2 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <span>{item.text}</span>
                {item.action && (
                  <button type="button" onClick={() => onNavigate(item.action!.tab)} className="shrink-0 text-left font-medium text-primary hover:underline">
                    {item.action.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section aria-labelledby="sync-title" className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <h3 id="sync-title" className="font-display font-semibold">
            Senast hämtat från Bokadirekt
          </h3>
          <dl className="mt-3 divide-y divide-border text-sm">
            <div className="flex justify-between gap-4 py-2.5">
              <dt>Omdömen</dt>
              <dd className="text-right text-muted-foreground">{formatDateTime(data?.jobs?.["scrape-reviews"]?.last_finished_at)}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2.5">
              <dt>Behandlingar och priser</dt>
              <dd className="text-right text-muted-foreground">{formatDateTime(data?.jobs?.["sync-treatments"]?.last_finished_at)}</dd>
            </div>
          </dl>
        </section>
        <section aria-labelledby="links-title" className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <h3 id="links-title" className="font-display font-semibold">
            Genvägar
          </h3>
          <ul className="mt-3 divide-y divide-border text-sm">
            {[
              { label: "Bokningssidan hos Bokadirekt", href: getGlobalContentValue("booking_url", settings) },
              { label: "Google Search Console", href: "https://search.google.com/search-console" },
              { label: "Google Företagsprofil", href: "https://business.google.com/" },
            ].map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 py-2.5 hover:text-primary">
                  {link.label}
                  <ExternalLink aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only"> (öppnas i ny flik)</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

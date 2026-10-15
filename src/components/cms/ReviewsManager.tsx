import { Loader2, RefreshCw, Star } from "lucide-react";
import { toast } from "sonner";
import { useAdminReviews, useOverview, useRunJob, useUpdateReview } from "@/hooks/useAdmin";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { formatDateTime } from "@/lib/adminTypes";
import { formatRating } from "@/lib/format";

function Stars({ rating, size = "w-4 h-4" }: { rating: number; size?: string }) {
  return (
    <span className="flex" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className={`${size} ${index < Math.round(rating) ? "text-amber-500 fill-amber-500" : "text-border"}`} />
      ))}
    </span>
  );
}

export default function ReviewsManager() {
  const reviews = useAdminReviews();
  const overview = useOverview();
  const update = useUpdateReview();
  const fetchNow = useRunJob("scrape-reviews");
  const { data: settings } = useSiteSettings();
  const lastRun = overview.data?.jobs?.["scrape-reviews"];
  const rating = Number(settings?.review_rating_value);
  const count = Number(settings?.review_count);

  const refresh = () =>
    fetchNow.mutate(undefined, {
      onSuccess: (result) => toast.success(`Omdömena är uppdaterade${typeof result?.count === "number" ? ` (${result.count} hämtade)` : ""}.`),
      onError: (error) => toast.error(error.message),
    });

  const change = (id: string, patch: { is_hidden?: boolean; is_featured?: boolean }) =>
    update.mutate({ id, ...patch }, { onError: (error) => toast.error(`Kunde inte spara: ${error.message}`) });

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-semibold">Omdömen</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Omdömena hämtas från Bokadirekt. Välj vilka som visas på webbplatsen och vilka som ska visas först. Dolda omdömen påverkar inte betyget hos Bokadirekt.
          </p>
        </div>
        {rating > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-3xl font-display font-bold">{formatRating(rating)}</span>
            <span>
              <Stars rating={rating} />
              {count > 0 && <span className="block text-xs text-muted-foreground">{count} omdömen</span>}
            </span>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">
          Senast hämtat: <strong>{formatDateTime(lastRun?.last_finished_at)}</strong>
          {lastRun?.last_result?.success === false && <span className="block text-destructive">Senaste försöket misslyckades: {lastRun.last_result.error}</span>}
        </p>
        <button type="button" onClick={refresh} disabled={fetchNow.isPending} className="rounded-xl px-4 py-2 flex items-center justify-center gap-2 border border-border text-sm hover:bg-muted disabled:opacity-50">
          {fetchNow.isPending ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <RefreshCw className="w-4 h-4" aria-hidden="true" />}
          {fetchNow.isPending ? "Hämtar…" : "Hämta nya omdömen nu"}
        </button>
      </div>

      {reviews.isLoading && <p role="status" className="py-8 text-center text-muted-foreground">Hämtar omdömen…</p>}
      {reviews.isError && (
        <div role="alert" className="bg-card border border-border rounded-2xl p-5 space-y-3 text-sm">
          <p className="text-destructive">{reviews.error.message}</p>
          <button type="button" onClick={() => void reviews.refetch()} className="text-primary underline">
            Försök igen
          </button>
        </div>
      )}
      {reviews.data?.length === 0 && <p className="py-8 text-center text-muted-foreground">Inga omdömen har hämtats ännu.</p>}

      {!!reviews.data?.length && (
        <ul className="space-y-3">
          {reviews.data.map((review) => (
            <li key={review.id} className="bg-card border border-border rounded-xl p-4 grid gap-4 md:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={review.is_hidden ? "opacity-40" : undefined}>
                    <Stars rating={review.rating} />
                  </span>
                  <span className="sr-only">{review.rating} av 5 stjärnor</span>
                  <span className="font-medium">{review.reviewer_name}</span>
                  <span className="text-xs text-muted-foreground">{review.review_date}</span>
                  {review.is_featured && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Visas först</span>}
                  {review.is_hidden && <span className="text-xs bg-muted text-foreground px-2 py-0.5 rounded-full">Dolt på webbplatsen</span>}
                </div>
                {review.review_text ? (
                  <p className={`mt-2 max-w-prose whitespace-pre-line text-sm ${review.is_hidden ? "text-muted-foreground" : "text-foreground"}`}>{review.review_text}</p>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">Betyg utan text</p>
                )}
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm md:flex-col">
                <label className="flex min-h-10 cursor-pointer items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 accent-primary" checked={!review.is_hidden} onChange={(event) => change(review.id, { is_hidden: !event.target.checked })} />
                  Visa på webbplatsen
                </label>
                <label className="flex min-h-10 cursor-pointer items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 accent-primary" checked={!!review.is_featured} onChange={(event) => change(review.id, { is_featured: event.target.checked })} />
                  Visa först
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

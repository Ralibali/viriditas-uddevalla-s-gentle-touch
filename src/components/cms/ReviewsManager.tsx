import { toast } from "sonner";
import { useAdminReviews, useOverview, useRunJob, useUpdateReview } from "@/hooks/useAdmin";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { formatDateTime } from "@/lib/adminTypes";
import { formatRating } from "@/lib/format";
import Stars from "@/components/site/Stars";

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
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="max-w-2xl text-moss">
            Omdömena hämtas från Bokadirekt. Välj vilka som visas på webbplatsen och vilka som ska framhävas först. Dolda omdömen påverkar inte betyget hos Bokadirekt.
          </p>
        </div>
        {rating > 0 && (
          <div className="flex items-center gap-3">
            <span className="font-display text-4xl leading-none">{formatRating(rating)}</span>
            <span>
              <Stars rating={rating} />
              <span className="block type-small text-moss">{count > 0 ? `${count} omdömen` : ""}</span>
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-paper-raised p-5 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Senast hämtat: <strong>{formatDateTime(lastRun?.last_finished_at)}</strong>
          {lastRun?.last_result?.success === false && <span className="block text-destructive">Senaste försöket misslyckades: {lastRun.last_result.error}</span>}
        </p>
        <button type="button" onClick={refresh} disabled={fetchNow.isPending} className="btn btn-quiet min-h-11 disabled:opacity-50">
          {fetchNow.isPending ? "Hämtar…" : "Hämta nya omdömen nu"}
        </button>
      </div>

      {reviews.isLoading && <p role="status" className="text-moss">Hämtar omdömen…</p>}
      {reviews.isError && (
        <div role="alert" className="rounded-2xl border border-destructive/30 bg-paper-raised p-6">
          <p className="font-semibold text-destructive">{reviews.error.message}</p>
          <button type="button" onClick={() => void reviews.refetch()} className="link mt-3">
            Försök igen
          </button>
        </div>
      )}
      {reviews.data?.length === 0 && <p className="text-moss">Inga omdömen har hämtats ännu.</p>}

      <ul className="divide-y divide-line border-y border-line">
        {reviews.data?.map((review) => (
          <li key={review.id} className="grid gap-4 py-5 md:grid-cols-[1fr_auto]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={review.is_hidden ? "opacity-40" : undefined}>
                  <Stars rating={review.rating} />
                </span>
                <span className="sr-only">{review.rating} av 5 stjärnor</span>
                <span className="font-semibold">{review.reviewer_name}</span>
                <span className="type-small text-moss">{review.review_date}</span>
                {review.is_featured && <span className="rounded-full bg-sprout px-2.5 py-0.5 text-xs font-semibold">Framhävt</span>}
                {review.is_hidden && <span className="rounded-full bg-paper-deep px-2.5 py-0.5 text-xs font-semibold text-ink">Dolt på webbplatsen</span>}
              </div>
              {review.review_text ? <p className={`mt-2 max-w-prose whitespace-pre-line ${review.is_hidden ? "text-moss" : "text-ink/85"}`}>{review.review_text}</p> : <p className="mt-2 type-small text-moss">Betyg utan text</p>}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 md:flex-col">
              <label className="flex min-h-11 cursor-pointer items-center gap-3">
                <input type="checkbox" className="h-5 w-5 accent-[hsl(var(--primary))]" checked={!review.is_hidden} onChange={(event) => change(review.id, { is_hidden: !event.target.checked })} />
                Visa på webbplatsen
              </label>
              <label className="flex min-h-11 cursor-pointer items-center gap-3">
                <input type="checkbox" className="h-5 w-5 accent-[hsl(var(--primary))]" checked={!!review.is_featured} onChange={(event) => change(review.id, { is_featured: event.target.checked })} />
                Framhäv först
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

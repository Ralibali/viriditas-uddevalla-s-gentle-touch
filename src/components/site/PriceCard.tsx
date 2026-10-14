import { useSiteSettings } from "@/hooks/useSiteSettings";
import { getGlobalContentValue, TREATMENT_MINUTES } from "@/lib/siteContentValues";
import BookingLink from "./BookingLink";

/** Prices and the booking button beside long texts, always from the shared settings. */
export default function PriceCard({ source }: { source: string }) {
  const { data: settings } = useSiteSettings();
  const g = (key: string) => getGlobalContentValue(key, settings);
  return (
    <div className="rounded-media bg-paper-raised p-6 lg:sticky lg:top-28">
      <p className="font-display text-2xl text-ink soft-type">Klassisk massage</p>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {TREATMENT_MINUTES.map((minutes) => (
          <li key={minutes} className="flex items-baseline justify-between py-3">
            <span className="text-ink/80">{minutes} min</span>
            <span className="font-display text-xl text-ink">{g(`treatment_${minutes}_price`)}</span>
          </li>
        ))}
      </ul>
      <BookingLink source={source} className="btn btn-primary mt-6 w-full" />
      <p className="mt-4 type-small text-moss">{g("address")}</p>
    </div>
  );
}

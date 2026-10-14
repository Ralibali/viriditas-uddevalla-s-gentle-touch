import type { SyncedTreatment } from "@/lib/adminTypes";

/** The Bokadirekt treatment that corresponds to "klassisk massage" of a given length. */
export function matchTreatment(treatments: SyncedTreatment[], minutes: number): SyncedTreatment | undefined {
  const sameLength = treatments.filter((treatment) => treatment.duration_minutes === minutes && treatment.price_sek != null);
  return sameLength.find((treatment) => /klassisk/i.test(treatment.title)) ?? (sameLength.length === 1 ? sameLength[0] : undefined);
}

/** 1250 → "1 250 kr", the way prices are written on the site. */
export const priceText = (value: number) => `${value.toLocaleString("sv-SE").replace(/[\u00a0\u202f]/g, " ")} kr`;

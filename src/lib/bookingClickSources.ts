/** Readable names for the `source` recorded with each booking or contact click. */
const SOURCE_LABELS: Record<string, string> = {
  hero: "Startsidan – överst",
  "sticky-mobile": "Startsidan – fast knapp på mobilen",
  navbar: "Huvudmenyn",
  "navbar-mobile": "Mobilmenyn",
  "cta-after-about": "Startsidan – efter presentationen",
  "cta-after-reviews": "Startsidan – efter kundomdömen",
  "cta-before-footer": "Startsidan – bokningsrutan längst ned",
  "reviews-all": "Startsidan – alla omdömen",
  "recovery-highlight": "Återhämtningsmassage – presentation",
  "recovery-social-proof": "Återhämtningsmassage – omdömen",
  "treatment-recovery": "Prislistan – återhämtningsmassage",
  "treatment-": "Återhämtningsmassage",
  "contact-hours-schedule-link": "Öppettider – lediga tider",
  "contact-hours-schedule": "Öppettider – lediga tider",
  kontakt: "Kontakt",
  "kontakt-phone": "Kontakt – telefon",
  footer: "Sidfoten",
  "article-sticky": "Artikel – fast knapp på mobilen",
  "404": "Sidan som saknas",
  // Older identifiers without a position were placed at the bottom of the page.
  "om-andreas": "Om Andreas – längst ned",
  "klassisk-massage": "Klassisk massage – längst ned",
  "okänd": "Okänd källa",
};

const PAGE_LABELS: Record<string, string> = {
  "om-andreas": "Om Andreas",
  "klassisk-massage": "Klassisk massage",
  avslappningsmassage: "Avslappningsmassage",
  nackspanning: "Nackspänning",
  friskvard: "Friskvårdsbidrag",
  ljungskile: "Massage Ljungskile",
};

const POSITION_LABELS: Record<string, string> = {
  top: "överst",
  mid: "mitten",
  bottom: "längst ned",
  prices: "prislistan",
  sticky: "fast knapp på mobilen",
};

export function bookingClickSourceLabel(source: string): string {
  if (SOURCE_LABELS[source]) return SOURCE_LABELS[source];
  const treatment = /^treatment-(30|45|60|80)\s*min$/.exec(source);
  if (treatment) return `Massage ${treatment[1]} minuter`;
  const positioned = /^(.+)-(top|mid|bottom|prices|sticky)$/.exec(source);
  if (positioned && PAGE_LABELS[positioned[1]]) return `${PAGE_LABELS[positioned[1]]} – ${POSITION_LABELS[positioned[2]]}`;
  const article = /^artikel-(.+)$/.exec(source);
  if (article) return `Artikel: ${article[1]}`;
  return source;
}

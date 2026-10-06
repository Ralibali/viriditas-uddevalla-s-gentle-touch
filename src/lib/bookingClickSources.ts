const SOURCE_LABELS: Record<string, string> = {
  hero: "Startsidan – överst",
  "sticky-mobile": "Fast bokningsknapp på mobilen",
  navbar: "Huvudmenyn",
  "navbar-mobile": "Mobilmenyn",
  "cta-after-about": "Efter presentationen",
  "cta-after-reviews": "Efter kundomdömen",
  "cta-before-footer": "Bokningsrutan längst ned",
  "recovery-highlight": "Återhämtningsmassage – presentation",
  "recovery-social-proof": "Återhämtningsmassage – omdömen",
  "treatment-": "Återhämtningsmassage",
  "contact-hours-schedule-link": "Öppettider – lediga tider",
  "contact-hours-schedule": "Öppettider – lediga tider",
  kontakt: "Kontakt",
  footer: "Sidfoten",
  "kontakt-phone": "Kontakt – telefon",
  "om-andreas-mid": "Om Andreas – mitten",
  "om-andreas": "Om Andreas – längst ned",
  "klassisk-massage-mid": "Klassisk massage – mitten",
  "klassisk-massage": "Klassisk massage – längst ned",
  "avslappningsmassage-top": "Avslappningsmassage – överst",
  "avslappningsmassage-bottom": "Avslappningsmassage – längst ned",
  "nackspanning-top": "Nackspänning – överst",
  "nackspanning-bottom": "Nackspänning – längst ned",
  "friskvard-top": "Friskvårdsbidrag – överst",
  "friskvard-bottom": "Friskvårdsbidrag – längst ned",
  "ljungskile-top": "Massage Ljungskile – överst",
  "ljungskile-bottom": "Massage Ljungskile – längst ned",
  "okänd": "Okänd källa",
};

export function bookingClickSourceLabel(source: string): string {
  if (SOURCE_LABELS[source]) return SOURCE_LABELS[source];
  const treatment = /^treatment-(30|45|60|80)\s*min$/.exec(source);
  return treatment ? `Massage ${treatment[1]} minuter` : source;
}

export interface BookingSourceSummary { source: string; name: string; value: number }

/** The pie groups smaller sources; the original breakdown remains intact for the table. */
export function bookingClickPieSources(sources: BookingSourceSummary[]): BookingSourceSummary[] {
  if (sources.length <= 6) return sources.slice();
  return [...sources.slice(0, 6), { source: "__pie_other__", name: "Övriga", value: sources.slice(6).reduce((sum, source) => sum + source.value, 0) }];
}

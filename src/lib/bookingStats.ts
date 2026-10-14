import { bookingClickSourceLabel } from "./bookingClickSources";

export type BookingClick = { source: string | null; clicked_at: string; click_type?: string | null };

export interface ClickSummary {
  booking: number;
  contact: number;
  previousBooking: number;
  previousContact: number;
  today: number;
  /** One entry per calendar day in Swedish time, oldest first. */
  days: { date: string; count: number }[];
  /** Click sources within the period, most clicked first. */
  sources: { source: string; name: string; value: number }[];
}

const swedishDay = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", year: "numeric", month: "2-digit", day: "2-digit" });

function shiftDay(day: string, offset: number): string {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

const isContact = (click: BookingClick) => click.click_type === "phone" || click.click_type === "contact";

/** Counts clicks for the last `days` days (today included) and for the same number of days before. */
export function summarizeClicks(clicks: readonly BookingClick[], days: number, now = new Date()): ClickSummary {
  const today = swedishDay.format(now);
  const first = shiftDay(today, -(days - 1));
  const previousFirst = shiftDay(first, -days);
  const perDay = new Map<string, number>();
  for (let offset = 0; offset < days; offset++) perDay.set(shiftDay(first, offset), 0);
  const perSource = new Map<string, number>();
  const summary = { booking: 0, contact: 0, previousBooking: 0, previousContact: 0, today: 0 };

  for (const click of clicks) {
    const time = new Date(click.clicked_at);
    if (Number.isNaN(time.getTime())) continue;
    const day = swedishDay.format(time);
    if (day >= previousFirst && day < first) {
      if (isContact(click)) summary.previousContact++;
      else summary.previousBooking++;
      continue;
    }
    if (!perDay.has(day)) continue;
    perDay.set(day, (perDay.get(day) ?? 0) + 1);
    if (day === today) summary.today++;
    if (isContact(click)) summary.contact++;
    else summary.booking++;
    const source = click.source || "okänd";
    perSource.set(source, (perSource.get(source) ?? 0) + 1);
  }

  return {
    ...summary,
    days: [...perDay].map(([date, count]) => ({ date, count })),
    sources: [...perSource]
      .map(([source, value]) => ({ source, name: bookingClickSourceLabel(source), value }))
      .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name, "sv")),
  };
}

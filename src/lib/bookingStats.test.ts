import { describe, expect, it } from "vitest";
import { summarizeClicks, type BookingClick } from "./bookingStats";

// 14 October 2026, 10:00 in Sweden.
const now = new Date("2026-10-14T08:00:00Z");
const click = (clicked_at: string, source: string | null = "hero", click_type: string | null = "booking"): BookingClick => ({ clicked_at, source, click_type });

describe("booking click summary", () => {
  it("counts days in Swedish time, today included", () => {
    const summary = summarizeClicks(
      [
        click("2026-10-13T22:30:00Z"), // 00:30 on 14 October in Sweden
        click("2026-10-13T21:30:00Z"), // 23:30 on 13 October in Sweden
        click("2026-10-08T10:00:00Z"),
      ],
      7,
      now,
    );
    expect(summary.days).toHaveLength(7);
    expect(summary.days[0]).toEqual({ date: "2026-10-08", count: 1 });
    expect(summary.days.at(-2)).toEqual({ date: "2026-10-13", count: 1 });
    expect(summary.days.at(-1)).toEqual({ date: "2026-10-14", count: 1 });
    expect(summary.today).toBe(1);
  });

  it("separates calls and e-mail from booking clicks and compares with the period before", () => {
    const summary = summarizeClicks(
      [
        click("2026-10-14T07:00:00Z", "hero"),
        click("2026-10-12T07:00:00Z", "kontakt-phone", "phone"),
        click("2026-10-11T07:00:00Z", "footer", "contact"),
        click("2026-10-10T07:00:00Z", null, null),
        click("2026-10-05T07:00:00Z", "hero"),
        click("2026-10-02T07:00:00Z", "kontakt-phone", "phone"),
        click("2026-09-20T07:00:00Z", "hero"),
      ],
      7,
      now,
    );
    expect(summary.booking).toBe(2);
    expect(summary.contact).toBe(2);
    expect(summary.previousBooking).toBe(1);
    expect(summary.previousContact).toBe(1);
  });

  it("ranks sources with readable names and keeps unknown ones", () => {
    const summary = summarizeClicks(
      [click("2026-10-14T07:00:00Z", "navbar"), click("2026-10-13T07:00:00Z", "hero"), click("2026-10-12T07:00:00Z", "hero"), click("2026-10-12T08:00:00Z", null)],
      30,
      now,
    );
    expect(summary.sources).toEqual([
      { source: "hero", name: "Startsidan – överst", value: 2 },
      { source: "navbar", name: "Huvudmenyn", value: 1 },
      { source: "okänd", name: "Okänd källa", value: 1 },
    ]);
  });

  it("ignores clicks outside the period and broken dates", () => {
    const summary = summarizeClicks([click("2026-10-20T07:00:00Z"), click("inte ett datum"), click("2025-01-01T07:00:00Z")], 30, now);
    expect(summary.booking + summary.contact + summary.previousBooking + summary.previousContact).toBe(0);
    expect(summary.sources).toEqual([]);
  });
});

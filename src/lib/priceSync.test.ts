import { describe, expect, it } from "vitest";
import { matchTreatment, priceText } from "./priceSync";

const row = (title: string, duration_minutes: number | null, price_sek: number | null) => ({ service_ref: title + duration_minutes, title, duration_minutes, price_sek, description: null, last_synced_at: "2026-10-01T00:00:00Z" });

describe("price comparison with Bokadirekt", () => {
  it("prefers classic massage of the same length", () => {
    const treatments = [row("Återhämtningsmassage", 60, 500), row("Klassisk massage", 60, 720), row("Klassisk massage", 30, 450)];
    expect(matchTreatment(treatments, 60)?.price_sek).toBe(720);
    expect(matchTreatment(treatments, 30)?.price_sek).toBe(450);
  });

  it("does not guess between several unrelated treatments", () => {
    expect(matchTreatment([row("Ryggmassage", 45, 600), row("Huvudmassage", 45, 550)], 45)).toBeUndefined();
    expect(matchTreatment([row("Massage", 80, 998)], 80)?.price_sek).toBe(998);
    expect(matchTreatment([row("Klassisk massage", 80, null)], 80)).toBeUndefined();
  });

  it("writes prices like the site does", () => {
    expect(priceText(720)).toBe("720 kr");
    expect(priceText(1250)).toBe("1 250 kr");
  });
});

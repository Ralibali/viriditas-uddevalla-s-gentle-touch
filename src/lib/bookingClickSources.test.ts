import { describe, expect, it } from "vitest";
import { bookingClickPieSources, bookingClickSourceLabel } from "./bookingClickSources";

describe("booking statistics display", () => {
  it("uses Swedish names for known sources and preserves unknown source names", () => {
    expect(bookingClickSourceLabel("hero")).toBe("Startsidan – överst");
    expect(bookingClickSourceLabel("navbar")).toBe("Huvudmenyn");
    expect(bookingClickSourceLabel("footer")).toBe("Sidfoten");
    expect(bookingClickSourceLabel("kontakt-phone")).toBe("Kontakt – telefon");
    expect(bookingClickSourceLabel("sticky-mobile")).toBe("Fast bokningsknapp på mobilen");
    expect(bookingClickSourceLabel("treatment-60 min")).toBe("Massage 60 minuter");
    expect(bookingClickSourceLabel("kundens-egna-kalla")).toBe("kundens-egna-kalla");
  });

  it("groups the pie into six sources and Övriga without changing totals or raw identities", () => {
    const sources = Array.from({ length: 26 }, (_, index) => ({ source: `source-${index}`, name: `Källa ${index}`, value: 26 - index }));
    const original = structuredClone(sources);
    const pie = bookingClickPieSources(sources);
    expect(pie).toHaveLength(7);
    expect(pie.slice(0, 6)).toEqual(sources.slice(0, 6));
    expect(pie[6].name).toBe("Övriga");
    expect(pie.reduce((sum, source) => sum + source.value, 0)).toBe(sources.reduce((sum, source) => sum + source.value, 0));
    expect(sources).toEqual(original);
  });

  it("keeps small and empty breakdowns intact", () => {
    const source = { source: "hero", name: "Startsidan – överst", value: 2 };
    expect(bookingClickPieSources([source])).toEqual([source]);
    expect(bookingClickPieSources([])).toEqual([]);
  });
});

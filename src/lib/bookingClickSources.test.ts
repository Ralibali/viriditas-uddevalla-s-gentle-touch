import { describe, expect, it } from "vitest";
import { bookingClickSourceLabel } from "./bookingClickSources";

describe("booking statistics display", () => {
  it("uses Swedish names for known sources and preserves unknown source names", () => {
    expect(bookingClickSourceLabel("hero")).toBe("Startsidan – överst");
    expect(bookingClickSourceLabel("navbar")).toBe("Huvudmenyn");
    expect(bookingClickSourceLabel("footer")).toBe("Sidfoten");
    expect(bookingClickSourceLabel("kontakt-phone")).toBe("Kontakt – telefon");
    expect(bookingClickSourceLabel("sticky-mobile")).toBe("Startsidan – fast knapp på mobilen");
    expect(bookingClickSourceLabel("treatment-60 min")).toBe("Massage 60 minuter");
    expect(bookingClickSourceLabel("kundens-egna-kalla")).toBe("kundens-egna-kalla");
  });

  it("names every position on the treatment pages, old and new", () => {
    expect(bookingClickSourceLabel("klassisk-massage-prices")).toBe("Klassisk massage – prislistan");
    expect(bookingClickSourceLabel("nackspanning-sticky")).toBe("Nackspänning – fast knapp på mobilen");
    expect(bookingClickSourceLabel("om-andreas-top")).toBe("Om Andreas – överst");
    expect(bookingClickSourceLabel("om-andreas")).toBe("Om Andreas – längst ned");
    expect(bookingClickSourceLabel("ljungskile-bottom")).toBe("Massage Ljungskile – längst ned");
    expect(bookingClickSourceLabel("artikel-massage-vs-kiropraktor")).toBe("Artikel: massage-vs-kiropraktor");
    expect(bookingClickSourceLabel("okand-sida-top")).toBe("okand-sida-top");
  });
});

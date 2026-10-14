import { describe, expect, it } from "vitest";
import { formatRating, splitPriceFact } from "./format";

describe("display formatting", () => {
  it("writes ratings with a decimal comma", () => {
    expect(formatRating(4.8)).toBe("4,8");
    expect(formatRating(5)).toBe("5,0");
  });

  it("splits a price phrase into value and label, and keeps other wording intact", () => {
    expect(splitPriceFact("Från 450 kr")).toEqual({ value: "450 kr", label: "Från" });
    expect(splitPriceFact("Från 1 250 kr")).toEqual({ value: "1 250 kr", label: "Från" });
    expect(splitPriceFact("Prisvärd massage")).toEqual({ value: "Prisvärd massage", label: "" });
  });
});

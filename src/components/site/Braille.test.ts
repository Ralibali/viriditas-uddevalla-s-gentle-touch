import { describe, expect, it } from "vitest";
import { brailleDots, toBraille } from "./Braille";

describe("braille signature", () => {
  it("spells viriditas with the correct Unicode braille letters", () => {
    expect(toBraille("Viriditas")).toBe("⠧⠊⠗⠊⠙⠊⠞⠁⠎");
  });

  it("places dots 1–3 in the left column and 4–6 in the right, row by row", () => {
    // v = dots 1, 2, 3 and 6
    expect(brailleDots("v")).toEqual([true, false, true, false, true, true]);
    // i = dots 2 and 4
    expect(brailleDots("i")).toEqual([false, true, true, false, false, false]);
    // å = dots 1 and 6
    expect(brailleDots("å")).toEqual([true, false, false, false, false, true]);
  });
});

import { describe, expect, it } from "vitest";
import { formatRating } from "./format";

describe("display formatting", () => {
  it("writes ratings with a decimal comma", () => {
    expect(formatRating(4.8)).toBe("4,8");
    expect(formatRating(5)).toBe("5,0");
  });
});

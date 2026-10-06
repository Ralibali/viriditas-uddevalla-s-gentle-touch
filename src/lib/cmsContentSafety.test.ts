import { describe, expect, it } from "vitest";
import { headingLevel, pageSlug, safeContentUrl, validPageSlug } from "./cmsContentSafety";

describe("CMS content safety", () => {
  it("rejects executable URLs, hidden control characters and protocol-relative redirects", () => {
    for (const url of ["javascript:alert(1)", "data:text/html,<script>alert(1)</script>", "vbscript:msgbox(1)", "http://example.com", "//evil.example", "/\\evil.example", "java\nscript:alert(1)", "https://user:password@example.com"]) {
      expect(safeContentUrl(url)).toBeUndefined();
      expect(safeContentUrl(url, true)).toBeUndefined();
    }
  });

  it("permits booking, local navigation and contact links but keeps media to web URLs", () => {
    for (const url of ["https://www.bokadirekt.se/places/viriditas", "/p/artikel", "#kontakt", "mailto:info@example.com", "tel:+4612345"]) {
      expect(safeContentUrl(url)).toBe(url);
    }
    expect(safeContentUrl("/images/massage.jpg", true)).toBe("/images/massage.jpg");
    expect(safeContentUrl("mailto:info@example.com", true)).toBeUndefined();
  });

  it("preserves heading semantics when select inputs store levels as strings", () => {
    expect(headingLevel("1")).toBe(1);
    expect(headingLevel("2")).toBe(2);
    expect(headingLevel("3")).toBe(3);
    expect(headingLevel("script")).toBe(2);
  });

  it("creates valid Swedish page addresses and rejects path traversal and malformed slugs", () => {
    const slug = pageSlug("Återhämtning & välmående i Uddevalla");
    expect(slug).toBe("aterhamtning-valmaende-i-uddevalla");
    expect(validPageSlug(slug)).toBe(true);
    for (const value of ["../admin", "foo/bar", "foo--bar", "-foo", "foo-", "", "a".repeat(101)]) {
      expect(validPageSlug(value)).toBe(false);
    }
  });
});

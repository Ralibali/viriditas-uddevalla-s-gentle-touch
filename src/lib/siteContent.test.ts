import { describe, expect, it } from "vitest";
import { SITE_CONTENT_ROUTES, getContentFieldValue, getGlobalContentValue, isSafeContentUrl, treatmentPriceNumber, validateContentValue, GLOBAL_CONTENT_FIELDS, serializeStructuredData, getPublicContentValue } from "./siteContent";

const home = SITE_CONTENT_ROUTES.find(route => route.id === "home")!;
const footer = SITE_CONTENT_ROUTES.find(route => route.id === "footer")!;

describe("customer-controlled website content", () => {
  it("keeps the lightweight public resolver consistent with every admin content field", () => {
    const shared = { business_name: "Kundens massage", email: "kund@example.se", address: "Storgatan 8", treatment_30_price: "525 kr" };
    for (const route of SITE_CONTENT_ROUTES) {
      for (const field of route.fields) {
        expect(getPublicContentValue(route.id, field.key, field.defaultValue, shared)).toBe(getContentFieldValue(field, shared));
        const value = field.kind === "toggle" ? "false" : ["link", "image", "video"].includes(field.kind) ? "https://example.se/innehall" : "Kundens nya text";
        const settings = { ...shared, [field.settingKey]: value };
        expect(getPublicContentValue(route.id, field.key, field.defaultValue, settings)).toBe(getContentFieldValue(field, settings));
      }
    }
  });

  it("uses shared booking and contact details throughout the public site", () => {
    const settings = { booking_url: "https://booking.example/massage", email: "kund@example.se", address: "Storgatan 8, Uddevalla", business_name: "Ny massage" };
    expect(getGlobalContentValue("booking_url", settings)).toBe(settings.booking_url);
    expect(getGlobalContentValue("map_embed_url", settings)).toContain(encodeURIComponent(settings.address));
    expect(getContentFieldValue(footer.fields.find(field => field.settingKey === "address")!, settings)).toBe(settings.address);
    expect(getContentFieldValue(home.fields.find(field => field.key === "seo_002")!, settings)).toContain(settings.business_name);
  });

  it("updates default text and SEO from treatment prices, while respecting explicit text edits", () => {
    const field = home.fields.find(field => field.key === "seo_002")!;
    expect(getContentFieldValue(field, { treatment_30_price: "525 kr" })).toContain("525 kr");
    expect(getContentFieldValue(field, { treatment_30_price: "525 kr", [field.settingKey]: "Massage efter dina önskemål." })).toBe("Massage efter dina önskemål.");
    expect(treatmentPriceNumber("1 250,50 kr")).toBe("1250.50");
  });

  it("allows intentionally empty text and hiding sections", () => {
    const field = home.fields.find(field => field.key === "hero_subtitle")!;
    expect(getContentFieldValue(field, { [field.settingKey]: "" })).toBe("");
    const reviews = home.fields.find(field => field.key === "show_reviews")!;
    expect(getContentFieldValue(reviews, {})).toBe("true");
    expect(getContentFieldValue(reviews, { [reviews.settingKey]: "false" })).toBe("false");
  });

  it("rejects executable, credential-bearing and disguised URL schemes", () => {
    for (const value of ["javascript:alert(1)", "data:text/html,<script>", "//evil.example", "https://user:password@example.se/", "https:\\evil.example", "\njavascript:alert(1)"]) expect(isSafeContentUrl(value)).toBe(false);
    expect(isSafeContentUrl("/bilder/massage.jpg", true)).toBe(true);
    expect(isSafeContentUrl("https://images.example.se/massage.webp", true)).toBe(true);
    const booking = GLOBAL_CONTENT_FIELDS.find(field => field.key === "booking_url")!;
    expect(validateContentValue(booking, "javascript:alert(1)")).toBeTruthy();
    expect(getGlobalContentValue("booking_url", { booking_url: "javascript:alert(1)" })).toBe(booking.defaultValue);
  });

  it("escapes script delimiters in editable structured data", () => {
    const data = { name: "</script><script>alert(1)</script>" };
    const serialized = serializeStructuredData(data);
    expect(serialized).not.toContain("<");
    expect(JSON.parse(serialized)).toEqual(data);
  });

  it("only accepts Google Maps as an embedded map source", () => {
    const map = GLOBAL_CONTENT_FIELDS.find(field => field.key === "map_embed_url")!;
    expect(validateContentValue(map, "https://evil.example/frame")).toBeTruthy();
    expect(validateContentValue(map, "https://www.google.com/maps?q=Uddevalla&output=embed")).toBeNull();
  });
});

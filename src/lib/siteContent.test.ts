import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SITE_CONTENT_ROUTES, getContentFieldValue, getGlobalContentValue, isSafeContentUrl, treatmentPriceNumber, validateContentValue, GLOBAL_CONTENT_FIELDS, serializeStructuredData } from "./siteContent";
import type { LandingBlock, LandingPageSpec } from "@/content/landing";
import { classicPage } from "@/content/classic";
import { relaxationPage } from "@/content/relaxation";
import { neckPage } from "@/content/neck";
import { wellnessPage } from "@/content/wellness";
import { ljungskilePage } from "@/content/ljungskile";

const route = (id: string) => SITE_CONTENT_ROUTES.find((item) => item.id === id)!;
const home = route("home");
const globalKeys = new Set(GLOBAL_CONTENT_FIELDS.map((field) => field.settingKey));

function landingKeys(spec: LandingPageSpec): string[] {
  const fromBlock = (block: LandingBlock): string[] => {
    switch (block.type) {
      case "heading":
      case "paragraph":
        return [block.key];
      case "list":
        return block.keys;
      case "steps":
        return block.items.flatMap((item) => [item.title, item.text]);
      case "terms":
        return block.items.flatMap((item) => [item.term, item.text]);
      case "links":
        return block.parts.flatMap((part) => ("link" in part ? [part.link, part.text] : [part.text]));
      case "callout":
        return [block.title, block.text];
      case "partner":
        return [block.image, block.alt, block.before, block.name, block.after];
    }
  };
  return [
    spec.seo.title,
    spec.seo.description,
    spec.hero.title,
    spec.hero.lead,
    ...spec.blocks.flatMap(fromBlock),
    ...(spec.faq ? [spec.faq.heading, ...spec.faq.items.flat()] : []),
    spec.closing.heading,
    ...(spec.aboutLink ? [spec.aboutLink.link, spec.aboutLink.text] : []),
    spec.schema.name,
    ...spec.schema.areaServed.map((area) => area.key),
    ...spec.schema.offers.map((offer) => offer.name),
    spec.schema.breadcrumbHome,
    spec.schema.breadcrumbPage,
  ];
}

describe("content catalogue", () => {
  it("gives every field a unique key, a label and a valid default", () => {
    for (const item of SITE_CONTENT_ROUTES) {
      const keys = item.fields.map((field) => field.key);
      expect(new Set(keys).size, `${item.id} has duplicate keys`).toBe(keys.length);
      for (const field of item.fields) {
        expect(field.label, `${item.id}.${field.key}`).toBeTruthy();
        expect(field.group, `${item.id}.${field.key}`).toBeTruthy();
        expect(validateContentValue(field, field.defaultValue), `${item.id}.${field.key} default`).toBeNull();
      }
    }
  });

  it("never lets two pages write to the same setting by accident", () => {
    const owners = new Map<string, string>();
    for (const item of SITE_CONTENT_ROUTES) {
      for (const field of item.fields) {
        if (globalKeys.has(field.settingKey)) continue;
        const owner = owners.get(field.settingKey);
        expect(owner === undefined || owner === item.id, `${field.settingKey} is used by ${owner} and ${item.id}`).toBe(true);
        owners.set(field.settingKey, item.id);
      }
    }
  });

  it("defines every key the landing pages render", () => {
    for (const spec of [classicPage, relaxationPage, neckPage, wellnessPage, ljungskilePage]) {
      const defined = new Set(spec.content.fields.map((field) => field.key));
      const used = landingKeys(spec);
      expect(used.filter((key) => !defined.has(key)), spec.path).toEqual([]);
      // Every editable field is shown somewhere on the page.
      expect([...defined].filter((key) => !used.includes(key)), spec.path).toEqual([]);
    }
  });

  it("defines every literal key the hand-built pages read", () => {
    const pages: Record<string, string> = {
      "Index.tsx": "home",
      "OmAndreas.tsx": "about",
      "Privacy.tsx": "privacy",
      "Articles.tsx": "articles",
      "DynamicPage.tsx": "articles",
    };
    const components: Record<string, string> = { "Navbar.tsx": "navigation", "Footer.tsx": "footer" };
    const check = (file: string, id: string) => {
      const source = readFileSync(file, "utf8");
      const used = [...source.matchAll(/\b(?:c|show)\("([a-z0-9_]+)"\)/g)].map((match) => match[1]);
      const defined = new Set(route(id).fields.map((field) => field.key));
      expect(used.filter((key) => !defined.has(key)), file).toEqual([]);
    };
    for (const [file, id] of Object.entries(pages)) check(join("src/pages", file), id);
    for (const [file, id] of Object.entries(components)) check(join("src/components/site", file), id);
    expect(readdirSync("src/pages")).toContain("Index.tsx");
  });
});

describe("customer-controlled website content", () => {
  it("uses shared booking and contact details throughout the site", () => {
    const settings = { booking_url: "https://booking.example/massage", email: "kund@example.se", address: "Storgatan 8, Uddevalla", business_name: "Ny massage" };
    expect(getGlobalContentValue("booking_url", settings)).toBe(settings.booking_url);
    expect(getGlobalContentValue("map_embed_url", settings)).toContain(encodeURIComponent(settings.address));
    const footerAddress = route("footer").fields.find((field) => field.settingKey === "address")!;
    expect(getContentFieldValue(footerAddress, settings)).toBe(settings.address);
    expect(getContentFieldValue(home.fields.find((field) => field.key === "seo_002")!, settings)).toContain(settings.business_name);
  });

  it("updates default text and SEO from treatment prices, while respecting explicit text edits", () => {
    const field = home.fields.find((item) => item.key === "seo_002")!;
    expect(getContentFieldValue(field, { treatment_30_price: "525 kr" })).toContain("525 kr");
    expect(getContentFieldValue(field, { treatment_30_price: "525 kr", [field.settingKey]: "Massage efter dina önskemål." })).toBe("Massage efter dina önskemål.");
    expect(treatmentPriceNumber("1 250,50 kr")).toBe("1250.50");
  });

  it("allows intentionally empty text and hiding sections", () => {
    const subtitle = home.fields.find((field) => field.key === "hero_subtitle")!;
    expect(getContentFieldValue(subtitle, { [subtitle.settingKey]: "" })).toBe("");
    const reviews = home.fields.find((field) => field.key === "show_reviews")!;
    expect(getContentFieldValue(reviews, {})).toBe("true");
    expect(getContentFieldValue(reviews, { [reviews.settingKey]: "false" })).toBe("false");
  });

  it("keeps image paths untouched when names change", () => {
    const portrait = home.fields.find((field) => field.key === "image_002")!;
    expect(getContentFieldValue(portrait, { business_name: "Annat namn" })).toBe(portrait.defaultValue);
  });

  it("rejects executable, credential-bearing and disguised URL schemes", () => {
    for (const value of ["javascript:alert(1)", "data:text/html,<script>", "//evil.example", "https://user:password@example.se/", "https:\\evil.example", "\njavascript:alert(1)"]) expect(isSafeContentUrl(value)).toBe(false);
    expect(isSafeContentUrl("/bilder/massage.jpg", true)).toBe(true);
    expect(isSafeContentUrl("https://images.example.se/massage.webp", true)).toBe(true);
    const booking = GLOBAL_CONTENT_FIELDS.find((field) => field.key === "booking_url")!;
    expect(validateContentValue(booking, "javascript:alert(1)")).toBeTruthy();
    expect(getGlobalContentValue("booking_url", { booking_url: "javascript:alert(1)" })).toBe(booking.defaultValue);
  });

  it("validates the new contact settings", () => {
    const phone = GLOBAL_CONTENT_FIELDS.find((field) => field.key === "phone")!;
    const postal = GLOBAL_CONTENT_FIELDS.find((field) => field.key === "postal_code")!;
    expect(validateContentValue(phone, "070-123 45 67")).toBeNull();
    expect(validateContentValue(phone, "ring mig")).toBeTruthy();
    expect(validateContentValue(postal, "451 30")).toBeNull();
    expect(validateContentValue(postal, "Uddevalla")).toBeTruthy();
  });

  it("escapes script delimiters in editable structured data", () => {
    const data = { name: "</script><script>alert(1)</script>" };
    const serialized = serializeStructuredData(data);
    expect(serialized).not.toContain("<");
    expect(JSON.parse(serialized)).toEqual(data);
  });

  it("only accepts Google Maps as an embedded map source", () => {
    const map = GLOBAL_CONTENT_FIELDS.find((field) => field.key === "map_embed_url")!;
    expect(validateContentValue(map, "https://evil.example/frame")).toBeTruthy();
    expect(validateContentValue(map, "https://www.google.com/maps?q=Uddevalla&output=embed")).toBeNull();
  });
});

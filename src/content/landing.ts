import type { SiteContentRoute } from "@/lib/siteContentValues";

/** Inline text with links: text parts and link parts refer to content keys. */
export type InlinePart = { text: string } | { link: string; text: string };

/** The body of a landing page, rendered in order. Every string is a content key. */
export type LandingBlock =
  | { type: "heading"; key: string }
  | { type: "paragraph"; key: string }
  | { type: "list"; keys: string[] }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "terms"; items: { term: string; text: string }[] }
  | { type: "links"; parts: InlinePart[]; end?: string }
  | { type: "callout"; title: string; text: string; source: string }
  | { type: "partner"; image: string; alt: string; before: string; name: string; after: string };

export interface LandingPageSpec {
  content: SiteContentRoute;
  path: string;
  seo: { title: string; description: string };
  hero: { title: string; lead: string; source: string };
  blocks: LandingBlock[];
  faq?: { heading: string; items: [question: string, answer: string][] };
  closing: { heading: string; source: string };
  aboutLink?: { link: string; text: string };
  schema: {
    name: string;
    serviceType: string;
    areaServed: { type: "City" | "AdministrativeArea"; key: string }[];
    offers: { minutes: 30 | 45 | 60 | 80; name: string }[];
    breadcrumbHome: string;
    breadcrumbPage: string;
  };
}

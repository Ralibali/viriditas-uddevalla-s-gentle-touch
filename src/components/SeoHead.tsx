import { useEffect } from "react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { safeContentUrl } from "@/lib/cmsContentSafety";
import { serializeStructuredData, treatmentPriceNumber } from "@/lib/siteContentValues";

const SITE_URL = "https://viriditasmassage.se";
const DEFAULT_OG_IMAGE = "https://viriditasmassage.se/og-image.jpg";

export interface SeoHeadProps {
  /** Page title – will be used as-is (no automatic " | Viriditas" suffix). */
  title: string;
  /** Meta description (max ~160 chars). */
  description: string;
  /** Path of the page, e.g. "/om-andreas". Defaults to current pathname. */
  path?: string;
  /** Whether this page should be indexed by search engines. */
  noindex?: boolean;
  /** Open Graph / Twitter image URL. Falls back to a brand image. */
  image?: string;
  /** og:type – defaults to "website". */
  ogType?: string;
}

/**
 * Sets <title>, meta description, canonical, robots and social meta tags
 * for the current page. Use one of these per route. Public routes also
 * render shared business data from the same settings as the visible site.
 *
 * NOTE: Because the project is a client-rendered SPA, search engines that
 * execute JS will pick this up but the *initial* HTML still serves the
 * defaults from index.html. Keep page titles and descriptions in sync.
 */
export const SeoHead = ({
  title,
  description,
  path,
  noindex = false,
  image,
  ogType = "website",
}: SeoHeadProps) => {
  const { c, g } = useSiteContent("home");
  const resolvedImage = safeContentUrl(image || g("og_image"), true) || DEFAULT_OG_IMAGE;
  const businessName = g("business_name");
  const ownerName = g("owner_name");
  useEffect(() => {
    if (typeof document === "undefined") return;

    const url = `${SITE_URL}${path ?? window.location.pathname}`;

    document.title = title;

    setMeta("name", "title", title);
    setMeta("name", "author", ownerName);
    setMeta("name", "description", description);
    setMeta(
      "name",
      "robots",
      noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    );
    setMeta("name", "googlebot", noindex ? "noindex, nofollow" : "index, follow");

    setLinkRel("canonical", url);

    // Open Graph
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:site_name", businessName);
    setMeta("property", "og:image", resolvedImage);
    setMeta("property", "og:image:alt", title);
    if (resolvedImage !== DEFAULT_OG_IMAGE) {
      document.querySelector('meta[property="og:image:width"]')?.remove();
      document.querySelector('meta[property="og:image:height"]')?.remove();
    }

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", resolvedImage);
  }, [title, description, path, noindex, resolvedImage, ogType, businessName, ownerName]);

  if (noindex) return null;

  const offers = [30, 45, 60, 80].map((minutes) => ({
    "@type": "Offer",
    price: treatmentPriceNumber(g(`treatment_${minutes}_price`)),
    priceCurrency: "SEK",
    url: g("booking_url"),
    itemOffered: {
      "@type": "Service",
      name: `${c(`treatment_${minutes}_title`, "Klassisk massage")} ${minutes} min`,
    },
  }));
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HealthAndBeautyBusiness",
        "@id": `${SITE_URL}/#business`,
        name: businessName,
        url: SITE_URL,
        description: g("footer_text"),
        email: g("email"),
        address: g("address"),
        image: resolvedImage,
        hasMap: g("maps_url"),
        currenciesAccepted: "SEK",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Behandlingar",
          itemListElement: offers,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: businessName,
        url: SITE_URL,
        inLanguage: "sv-SE",
        publisher: { "@id": `${SITE_URL}/#business` },
      },
    ],
  };

  return <script data-site-schema="business" type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(schema) }} />;
};

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setLinkRel(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default SeoHead;

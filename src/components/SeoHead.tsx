import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { safeContentUrl } from "@/lib/cmsContentSafety";
import { getGlobalContentValue, TREATMENT_MINUTES, treatmentPriceNumber } from "@/lib/siteContentValues";
import JsonLd, { SITE_URL } from "@/components/site/JsonLd";

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export interface SeoHeadProps {
  /** Page title – used as-is. */
  title: string;
  /** Meta description (about 150–160 characters). */
  description: string;
  /** Path of the page, e.g. "/om-andreas". Defaults to the current pathname. */
  path?: string;
  noindex?: boolean;
  /** Open Graph image URL. Falls back to the shared image from the administration. */
  image?: string;
  ogType?: string;
}

/** "Uddevalla Folkets Hus, Göteborgsvägen 11B" → place name and street address. */
export function splitAddress(address: string): { place?: string; street: string } {
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) return { street: address.trim() };
  const streetIndex = parts.findIndex((part) => /\d/.test(part));
  if (streetIndex <= 0) return { street: parts.join(", ") };
  return { place: parts.slice(0, streetIndex).join(", "), street: parts.slice(streetIndex).join(", ") };
}

/**
 * Title, description, canonical, robots and social tags for the current page,
 * plus the business's structured data on public pages. Prerendering captures
 * the result, so search engines see it without running JavaScript.
 */
export const SeoHead = ({ title, description, path, noindex = false, image, ogType = "website" }: SeoHeadProps) => {
  const { data: settings } = useSiteSettings();
  const g = (key: string) => getGlobalContentValue(key, settings);
  const resolvedImage = safeContentUrl(image || g("og_image"), true) || DEFAULT_OG_IMAGE;
  const absoluteImage = resolvedImage.startsWith("/") ? `${SITE_URL}${resolvedImage}` : resolvedImage;
  const businessName = g("business_name");
  const ownerName = g("owner_name");

  useEffect(() => {
    const url = `${SITE_URL}${path ?? window.location.pathname}`;
    document.title = title;
    setMeta("name", "description", description);
    setMeta("name", "author", ownerName);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setLinkRel("canonical", url);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:site_name", businessName);
    setMeta("property", "og:image", absoluteImage);
    setMeta("property", "og:image:alt", title);
    if (absoluteImage !== DEFAULT_OG_IMAGE) {
      document.querySelector('meta[property="og:image:width"]')?.remove();
      document.querySelector('meta[property="og:image:height"]')?.remove();
    }
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", absoluteImage);
  }, [title, description, path, noindex, absoluteImage, ogType, businessName, ownerName]);

  if (noindex) return null;

  const prices = TREATMENT_MINUTES.map((minutes) => Number(treatmentPriceNumber(g(`treatment_${minutes}_price`)))).filter(Number.isFinite);
  const { place, street } = splitAddress(g("address"));
  const rating = Number(settings?.review_rating_value);
  const reviewCount = Number(settings?.review_count);
  const phone = g("phone");
  const postalCode = g("postal_code");

  const business: Record<string, unknown> = {
    "@type": "HealthAndBeautyBusiness",
    "@id": `${SITE_URL}/#business`,
    name: businessName,
    url: `${SITE_URL}/`,
    description: g("footer_text"),
    email: g("email"),
    ...(phone ? { telephone: phone } : {}),
    image: absoluteImage,
    logo: `${SITE_URL}/icon-512.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: street,
      addressLocality: g("city"),
      ...(postalCode ? { postalCode } : {}),
      addressRegion: "Västra Götalands län",
      addressCountry: "SE",
    },
    ...(place ? { location: { "@type": "Place", name: place } } : {}),
    geo: { "@type": "GeoCoordinates", latitude: 58.3495, longitude: 11.9338 },
    hasMap: g("maps_url"),
    ...(prices.length ? { priceRange: `${Math.min(...prices)}–${Math.max(...prices)} kr` } : {}),
    currenciesAccepted: "SEK",
    sameAs: [g("booking_url")],
    employee: { "@type": "Person", name: ownerName, jobTitle: "Diplomerad massageterapeut" },
    ...(rating > 0 && reviewCount > 0
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: rating.toFixed(1), reviewCount: String(reviewCount), bestRating: "5" } }
      : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Behandlingar",
      itemListElement: TREATMENT_MINUTES.map((minutes) => ({
        "@type": "Offer",
        price: treatmentPriceNumber(g(`treatment_${minutes}_price`)),
        priceCurrency: "SEK",
        url: g("booking_url"),
        itemOffered: { "@type": "Service", name: `Klassisk massage ${minutes} min` },
      })),
    },
  };

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          business,
          { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: businessName, url: `${SITE_URL}/`, inLanguage: "sv-SE", publisher: { "@id": `${SITE_URL}/#business` } },
        ],
      }}
    />
  );
};

function setMeta(attr: "name" | "property", key: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", value);
}

function setLinkRel(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

export default SeoHead;

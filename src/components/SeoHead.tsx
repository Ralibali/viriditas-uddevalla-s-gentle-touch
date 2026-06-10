import { useEffect } from "react";

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
 * for the current page. Use one of these per route. The component is
 * intentionally render-free so it can sit anywhere in the tree.
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
  image = DEFAULT_OG_IMAGE,
  ogType = "website",
}: SeoHeadProps) => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const url = `${SITE_URL}${path ?? window.location.pathname}`;

    document.title = title;

    setMeta("name", "description", description);
    setMeta(
      "name",
      "robots",
      noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    );

    setLinkRel("canonical", url);

    // Open Graph
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:image", image);

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);
  }, [title, description, path, noindex, image, ogType]);

  return null;
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

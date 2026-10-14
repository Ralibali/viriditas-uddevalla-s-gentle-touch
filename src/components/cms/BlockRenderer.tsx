import type { ContentBlock } from "@/types/cms";
import { headingLevel, safeContentUrl } from "@/lib/cmsContentSafety";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { getGlobalContentValue } from "@/lib/siteContentValues";
import { trackBookingClick } from "@/lib/trackBookingClick";
import Faq from "@/components/site/Faq";

type BlockData = Record<string, unknown>;
const text = (value: unknown) => (typeof value === "string" ? value : "");

/** Renders one block from a page built in the administration. Text is always rendered as text. */
export function BlockRenderer({ block }: { block: ContentBlock }) {
  const { data: settings } = useSiteSettings();
  const data = (block.data ?? {}) as BlockData;

  switch (block.type) {
    case "heading": {
      const level = headingLevel(data.level);
      const Tag = `h${level}` as "h1" | "h2" | "h3";
      return <Tag className={level === 1 ? "type-h1" : undefined}>{text(data.text)}</Tag>;
    }

    case "paragraph":
      return <p className="whitespace-pre-line">{text(data.text)}</p>;

    case "image": {
      const src = safeContentUrl(data.src, true);
      if (!src) return null;
      return (
        <figure>
          <img
            src={src}
            alt={text(data.alt)}
            loading="lazy"
            decoding="async"
            className="w-full object-cover"
            style={typeof data.maxHeight === "number" || typeof data.maxHeight === "string" ? { maxHeight: data.maxHeight } : undefined}
          />
          {text(data.caption) && <figcaption className="mt-2 type-small text-moss">{text(data.caption)}</figcaption>}
        </figure>
      );
    }

    case "video": {
      const src = safeContentUrl(data.src, true);
      if (!src) return null;
      return (
        <video controls playsInline preload="metadata" aria-label={text(data.alt) || "Film"} className="w-full rounded-media">
          <source src={src} />
        </video>
      );
    }

    case "cta_button": {
      const bookingUrl = getGlobalContentValue("booking_url", settings);
      const url = safeContentUrl(!data.url || data.url === getGlobalContentValue("booking_url") ? bookingUrl : data.url) ?? bookingUrl;
      const external = data.external !== false && !url.startsWith("/") && !url.startsWith("#");
      return (
        <p>
          <a
            href={url}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            onClick={() => typeof data.trackSource === "string" && data.trackSource && void trackBookingClick(data.trackSource)}
            className={`btn btn-lg ${data.variant === "inverted" ? "btn-quiet" : "btn-primary"}`}
          >
            {text(data.text) || getGlobalContentValue("booking_label", settings)}
            {external && <span className="sr-only"> (öppnas i ny flik)</span>}
          </a>
        </p>
      );
    }

    case "list": {
      const items = Array.isArray(data.items) ? data.items.filter((item): item is string => typeof item === "string" && item.trim() !== "") : [];
      return (
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }

    case "quote":
      return (
        <figure>
          <blockquote>
            <p>”{text(data.text)}”</p>
          </blockquote>
          {text(data.author) && <figcaption className="mt-2 type-small text-moss">{text(data.author)}</figcaption>}
        </figure>
      );

    case "divider":
      return <hr className="border-line" />;

    case "faq": {
      const items = (Array.isArray(data.items) ? data.items : []) as { question?: unknown; answer?: unknown }[];
      return <Faq items={items.map((item) => ({ question: text(item.question), answer: text(item.answer) }))} />;
    }

    default:
      return null;
  }
}

export function PageBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="article">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}

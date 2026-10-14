import { Fragment } from "react";
import type { InlinePart, LandingBlock, LandingPageSpec } from "@/content/landing";
import { useSiteContent } from "@/hooks/useSiteContent";
import { treatmentPriceNumber } from "@/lib/siteContentValues";
import SeoHead from "@/components/SeoHead";
import SiteLayout from "./SiteLayout";
import PageIntro from "./PageIntro";
import PriceCard from "./PriceCard";
import BookingLink from "./BookingLink";
import SmartLink from "./SmartLink";
import Faq from "./Faq";
import JsonLd, { breadcrumbs, faqPage, SITE_URL } from "./JsonLd";

type Text = (key: string) => string;

function Inline({ parts, end, c }: { parts: InlinePart[]; end?: string; c: Text }) {
  return (
    <p>
      {parts.map((part, index) => {
        const next = parts[index + 1];
        if ("link" in part) {
          return (
            <SmartLink key={index} to={c(part.link)} className="link">
              {c(part.text)}
            </SmartLink>
          );
        }
        // Text before a link needs a space; text after a link brings its own punctuation.
        return <Fragment key={index}>{c(part.text) + (next && "link" in next ? " " : "")}</Fragment>;
      })}
      {end}
    </p>
  );
}

function Block({ block, c }: { block: LandingBlock; c: Text }) {
  switch (block.type) {
    case "heading":
      return <h2>{c(block.key).trim()}</h2>;
    case "paragraph":
      return <p className="whitespace-pre-line">{c(block.key)}</p>;
    case "list":
      return (
        <ul>
          {block.keys.map((key) => (
            <li key={key}>{c(key)}</li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol>
          {block.items.map((item) => (
            <li key={item.title}>
              <strong className="font-semibold text-ink">{c(item.title)}</strong>
              {c(item.text)}
            </li>
          ))}
        </ol>
      );
    case "terms":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item.term}>
              <strong className="block font-semibold text-ink">{c(item.term)}</strong>
              {c(item.text).trim()}
            </li>
          ))}
        </ul>
      );
    case "links":
      return <Inline parts={block.parts} end={block.end} c={c} />;
    case "callout":
      return (
        <div className="rounded-media bg-paper-raised p-6 sm:p-8">
          <p className="font-display text-2xl text-ink soft-type">{c(block.title)}</p>
          <p className="mt-2 text-ink/80">{c(block.text)}</p>
          <div className="mt-5">
            <BookingLink source={block.source} />
          </div>
        </div>
      );
    case "partner":
      return (
        <div className="flex flex-col gap-5 rounded-media border border-line p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex h-16 w-32 shrink-0 items-center justify-center rounded-xl bg-white px-4">
            <img src={c(block.image)} alt={c(block.alt)} width={140} height={44} loading="lazy" className="h-auto w-full" />
          </div>
          <p className="text-ink/85">
            {c(block.before)}
            <strong className="font-semibold text-ink">{c(block.name)}</strong>
            {c(block.after)}
          </p>
        </div>
      );
  }
}

/** One template for the service and area pages, filled from their content module. */
export default function LandingPage({ spec }: { spec: LandingPageSpec }) {
  const { c, g } = useSiteContent(spec.content);
  const faqItems = spec.faq?.items.map(([question, answer]) => ({ question: c(question), answer: c(answer) })) ?? [];
  const pageName = c(spec.schema.breadcrumbPage);
  const homeName = c(spec.schema.breadcrumbHome);

  return (
    <SiteLayout stickyBooking={`${spec.hero.source.replace(/-top$/, "")}-sticky`}>
      <SeoHead title={c(spec.seo.title)} description={c(spec.seo.description)} path={spec.path} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: c(spec.schema.name),
          serviceType: spec.schema.serviceType,
          provider: { "@type": "HealthAndBeautyBusiness", "@id": `${SITE_URL}/#business`, name: g("business_name"), url: `${SITE_URL}/` },
          areaServed: spec.schema.areaServed.map((area) => ({ "@type": area.type, name: c(area.key) })),
          url: `${SITE_URL}${spec.path}`,
          offers: spec.schema.offers.map((offer) => ({
            "@type": "Offer",
            price: treatmentPriceNumber(g(`treatment_${offer.minutes}_price`)),
            priceCurrency: "SEK",
            name: c(offer.name),
          })),
        }}
      />
      {faqItems.length > 0 && <JsonLd data={faqPage(faqItems)} />}
      <JsonLd
        data={breadcrumbs([
          { name: homeName, path: "/" },
          { name: pageName, path: spec.path },
        ])}
      />

      <PageIntro crumbs={{ home: homeName, current: pageName }} title={c(spec.hero.title)} lead={c(spec.hero.lead)}>
        <BookingLink source={spec.hero.source} className="btn btn-primary btn-lg" />
      </PageIntro>

      <section className="rule-top pb-20 pt-12 md:pb-28 md:pt-16">
        <div className="page-gutter grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="article lg:col-span-7">
            {spec.blocks.map((block, index) => (
              <Block key={index} block={block} c={c} />
            ))}
          </div>
          <aside aria-label="Priser och bokning" className="lg:col-span-4 lg:col-start-9">
            <PriceCard source={`${spec.hero.source.replace(/-top$/, "")}-prices`} />
          </aside>
        </div>
      </section>

      {faqItems.length > 0 && spec.faq && (
        <section aria-labelledby="landing-faq" className="section bg-paper-raised">
          <div className="page-gutter grid gap-10 lg:grid-cols-12 lg:gap-16">
            <h2 id="landing-faq" className="type-h2 lg:col-span-4">
              {c(spec.faq.heading)}
            </h2>
            <div className="lg:col-span-8">
              <Faq items={faqItems} />
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="landing-closing" className="section">
        <div className="page-gutter flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="landing-closing" className="type-h1 max-w-2xl">
              {c(spec.closing.heading)}
            </h2>
            {spec.aboutLink && (
              <p className="mt-5">
                <SmartLink to={c(spec.aboutLink.link)} className="link">
                  {c(spec.aboutLink.text).trim()}
                </SmartLink>
              </p>
            )}
          </div>
          <BookingLink source={spec.closing.source} className="btn btn-primary btn-lg shrink-0" />
        </div>
      </section>
    </SiteLayout>
  );
}

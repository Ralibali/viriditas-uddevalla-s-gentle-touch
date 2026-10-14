import { useParams, Link } from "react-router-dom";
import { articlesContent } from "@/content/articles";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useSitePage, useSitePages } from "@/hooks/useSitePages";
import { headingLevel } from "@/lib/cmsContentSafety";
import { PageBlocks } from "@/components/cms/BlockRenderer";
import SeoHead from "@/components/SeoHead";
import SiteLayout from "@/components/site/SiteLayout";
import PageIntro from "@/components/site/PageIntro";
import BookingLink from "@/components/site/BookingLink";
import JsonLd, { breadcrumbs, SITE_URL } from "@/components/site/JsonLd";
import type { ContentBlock } from "@/types/cms";

const dateFormat = new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "long", year: "numeric" });

function readingMinutes(blocks: ContentBlock[]): number {
  const words = blocks
    .map((block) => {
      const data = block.data ?? {};
      const items = Array.isArray(data.items) ? data.items.map((item: unknown) => (typeof item === "string" ? item : JSON.stringify(item))).join(" ") : "";
      return `${data.text ?? ""} ${items}`;
    })
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const DynamicPage = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: page, isLoading, isError, refetch } = useSitePage(slug);
  const { data: pages } = useSitePages();
  const { c, g } = useSiteContent(articlesContent);

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="page-gutter pb-24 pt-40" aria-busy="true">
          <p role="status" className="text-moss">
            Laddar artikeln…
          </p>
        </div>
      </SiteLayout>
    );
  }

  if (isError || !page) {
    return (
      <SiteLayout>
        <SeoHead title={isError ? "Sidan kunde inte laddas | Viriditas" : "Sidan hittades inte | Viriditas"} description="Sidan du letar efter finns inte." noindex />
        <div className="page-gutter pb-24 pt-40">
          <h1 className="type-h1">{isError ? "Sidan kunde inte laddas" : "Sidan finns inte längre"}</h1>
          <p className="mt-4 max-w-prose type-lead text-ink/80">
            {isError ? "Anslutningen bröts. Försök igen om en stund." : "Den kan ha flyttats eller tagits bort. Kunskapsbanken har alla publicerade artiklar."}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {isError ? (
              <button type="button" onClick={() => void refetch()} className="btn btn-primary">
                Försök igen
              </button>
            ) : (
              <Link to="/kunskapsbank" className="btn btn-primary">
                Till kunskapsbanken
              </Link>
            )}
            <Link to="/" className="btn btn-quiet">
              Till startsidan
            </Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  // A first H1 block is the article's title; the page renders it once, as the page heading.
  const [first, ...rest] = page.content;
  const titleBlock = first?.type === "heading" && headingLevel(first.data?.level) === 1 ? first : null;
  const title = (titleBlock?.data?.text as string | undefined) || page.title;
  const blocks = titleBlock ? rest : page.content;
  const description = page.meta_description || `${page.title} – läs mer hos ${g("business_name")}, massage i Uddevalla.`;
  const more = (pages ?? []).filter((other) => other.slug !== page.slug).slice(0, 3);
  const updated = new Date(page.updated_at);

  return (
    <SiteLayout stickyBooking="article-sticky">
      <SeoHead title={`${page.title} | ${g("business_name")}`} description={description} path={`/p/${page.slug}`} ogType="article" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description,
          datePublished: page.created_at,
          dateModified: page.updated_at,
          inLanguage: "sv-SE",
          mainEntityOfPage: `${SITE_URL}/p/${page.slug}`,
          author: { "@type": "Person", name: g("owner_name") },
          publisher: { "@id": `${SITE_URL}/#business` },
        }}
      />
      <JsonLd
        data={breadcrumbs([
          { name: "Hem", path: "/" },
          { name: c("text_001"), path: "/kunskapsbank" },
          { name: page.nav_label || page.title, path: `/p/${page.slug}` },
        ])}
      />

      <PageIntro
        crumbs={{ home: "Hem", parent: { label: c("text_001"), to: "/kunskapsbank" }, current: page.nav_label || page.title }}
        title={title}
        meta={
          <>
            {c("text_005")} <time dateTime={page.updated_at}>{Number.isNaN(updated.getTime()) ? "" : dateFormat.format(updated)}</time>
            <span aria-hidden="true" className="px-2">
              /
            </span>
            {readingMinutes(page.content)} min läsning
          </>
        }
      />

      <article className="rule-top pb-16 pt-12 md:pb-24 md:pt-16">
        <div className="page-gutter">
          <PageBlocks blocks={blocks} />
        </div>
      </article>

      <section aria-labelledby="article-booking" className="bg-primary text-primary-foreground">
        <div className="page-gutter flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between md:py-14">
          <div>
            <h2 id="article-booking" className="type-h3 text-primary-foreground">
              {c("text_007")}
            </h2>
            <p className="mt-2 text-primary-foreground/80">{c("text_008")}</p>
          </div>
          <BookingLink source={`artikel-${page.slug}`.slice(0, 80)} className="btn btn-on-dark btn-lg shrink-0" />
        </div>
      </section>

      {more.length > 0 && (
        <section aria-labelledby="more-articles" className="section">
          <div className="page-gutter">
            <h2 id="more-articles" className="type-h2">
              {c("text_006")}
            </h2>
            <ul className="mt-10 grid gap-x-10 border-t border-line md:grid-cols-3">
              {more.map((other) => (
                <li key={other.id} className="border-b border-line py-6 md:border-b-0">
                  <Link to={`/p/${other.slug}`} className="group block">
                    <span className="type-h3 block font-display text-ink group-hover:text-primary">{other.title}</span>
                    {other.meta_description && <span className="mt-2 block type-small text-ink/70">{other.meta_description}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </SiteLayout>
  );
};

export default DynamicPage;

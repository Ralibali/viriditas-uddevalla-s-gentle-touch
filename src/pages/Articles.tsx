import { Link } from "react-router-dom";
import { articlesContent } from "@/content/articles";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useSitePages } from "@/hooks/useSitePages";
import SeoHead from "@/components/SeoHead";
import SiteLayout from "@/components/site/SiteLayout";
import PageIntro from "@/components/site/PageIntro";
import JsonLd, { breadcrumbs, SITE_URL } from "@/components/site/JsonLd";

const dateFormat = new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "long", year: "numeric" });

export default function Articles() {
  const { c } = useSiteContent(articlesContent);
  const { data: pages, isLoading, isError, refetch } = useSitePages();
  const articles = pages ?? [];

  return (
    <SiteLayout>
      <SeoHead title={c("seo_001")} description={c("seo_002")} path="/kunskapsbank" />
      <JsonLd data={breadcrumbs([{ name: "Hem", path: "/" }, { name: c("text_001"), path: "/kunskapsbank" }])} />
      {articles.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: articles.map((page, index) => ({ "@type": "ListItem", position: index + 1, url: `${SITE_URL}/p/${page.slug}`, name: page.title })),
          }}
        />
      )}

      <PageIntro crumbs={{ home: "Hem", current: c("text_001") }} title={c("text_001")} lead={c("text_002")} />

      <section className="rule-top pb-24 pt-4">
        <div className="page-gutter">
          {isLoading && (
            <p role="status" className="py-10 text-moss">
              Laddar artiklar…
            </p>
          )}
          {isError && (
            <div role="alert" className="py-10">
              <p>Artiklarna kunde inte hämtas.</p>
              <button type="button" onClick={() => void refetch()} className="link mt-3">
                Försök igen
              </button>
            </div>
          )}
          {!isLoading && !isError && articles.length === 0 && <p className="py-10 text-moss">{c("text_003")}</p>}
          <ul>
            {articles.map((page) => {
              const updated = new Date(page.updated_at);
              return (
                <li key={page.id} className="grid gap-3 border-b border-line py-8 md:grid-cols-12 md:gap-8">
                  <p className="type-small text-moss md:col-span-3 md:pt-2">
                    <time dateTime={page.updated_at}>{Number.isNaN(updated.getTime()) ? "" : dateFormat.format(updated)}</time>
                  </p>
                  <div className="md:col-span-9">
                    <h2 className="type-h3">
                      <Link to={`/p/${page.slug}`} className="hover:text-primary">
                        {page.title}
                      </Link>
                    </h2>
                    {page.meta_description && <p className="mt-3 max-w-prose text-ink/75">{page.meta_description}</p>}
                    <Link to={`/p/${page.slug}`} className="link mt-4 inline-block" aria-label={`${c("text_004")}: ${page.title}`}>
                      {c("text_004")}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}

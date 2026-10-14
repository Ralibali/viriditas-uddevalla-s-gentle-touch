import { aboutContent } from "@/content/about";
import { useSiteContent } from "@/hooks/useSiteContent";
import SeoHead from "@/components/SeoHead";
import SiteLayout from "@/components/site/SiteLayout";
import PageIntro from "@/components/site/PageIntro";
import BookingLink from "@/components/site/BookingLink";
import SmartLink from "@/components/site/SmartLink";
import JsonLd, { breadcrumbs, SITE_URL } from "@/components/site/JsonLd";

const OmAndreas = () => {
  const { c, g } = useSiteContent(aboutContent);
  const background = [c("text_013"), c("text_014"), c("text_015")].filter(Boolean);

  return (
    <SiteLayout stickyBooking="om-andreas-sticky">
      <SeoHead title={c("seo_001")} description={c("seo_002")} path="/om-andreas" ogType="profile" />
      <JsonLd data={breadcrumbs([{ name: c("seo_003"), path: "/" }, { name: c("seo_004"), path: "/om-andreas" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: g("owner_name"),
          jobTitle: c("seo_005"),
          image: c("image_001").startsWith("/") ? `${SITE_URL}${c("image_001")}` : c("image_001"),
          worksFor: { "@type": "HealthAndBeautyBusiness", "@id": `${SITE_URL}/#business`, name: g("business_name"), url: `${SITE_URL}/` },
          workLocation: {
            "@type": "Place",
            name: c("seo_006"),
            address: { "@type": "PostalAddress", streetAddress: c("seo_007"), addressLocality: c("seo_008"), addressCountry: "SE" },
          },
        }}
      />

      <PageIntro
        crumbs={{ home: c("seo_003"), current: c("seo_004") }}
        title={c("text_001")}
        lead={c("text_002")}
        aside={
          <img
            src={c("image_001")}
            alt={c("text_009")}
            width={900}
            height={1200}
            {...{ fetchpriority: "high" }}
            className="aspect-[4/5] w-full rounded-media object-cover object-top"
          />
        }
      >
        <BookingLink source="om-andreas-top" className="btn btn-primary btn-lg" />
      </PageIntro>

      <section className="section rule-top">
        <div className="page-gutter grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <p className="max-w-prose type-lead text-ink/90">{c("text_003")}</p>
            {c("text_010") && (
              <figure className="my-12">
                <blockquote>
                  <p className="font-display text-[clamp(2.25rem,1.6rem+3vw,4rem)] leading-[1.02] text-primary soft-type" style={{ fontWeight: 380 }}>
                    ”{c("text_010")}”
                  </p>
                </blockquote>
                <figcaption className="mt-3 text-moss">{g("owner_name")}</figcaption>
              </figure>
            )}
            <p className="max-w-prose text-ink/85">{c("text_004")}</p>

            {background.length > 0 && (
              <div className="mt-14">
                <h2 className="type-h3">{c("text_012")}</h2>
                <ul className="mt-5 divide-y divide-line border-y border-line">
                  {background.map((item) => (
                    <li key={item} className="py-4">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <figure className="md:col-span-5">
            <img src={c("image_002")} alt={c("text_011")} width={900} height={1200} loading="lazy" decoding="async" className="aspect-[3/4] w-full rounded-media object-cover" />
            {c("text_011") && <figcaption className="mt-3 type-small text-moss">{c("text_011")}</figcaption>}
          </figure>
        </div>
      </section>

      <section aria-labelledby="about-closing" className="bg-primary text-primary-foreground">
        <div className="page-gutter flex flex-col items-start gap-8 py-16 md:flex-row md:items-end md:justify-between md:py-20">
          <div>
            <h2 id="about-closing" className="type-h2 text-primary-foreground">
              {c("text_005")}
            </h2>
            <p className="mt-3 max-w-prose text-primary-foreground/80">{c("text_006")}</p>
            <p className="mt-6">
              <SmartLink to={c("link_001")} className="font-semibold text-primary-foreground underline decoration-primary-foreground/40 decoration-2 underline-offset-4 hover:decoration-primary-foreground">
                {c("text_008")}
              </SmartLink>
            </p>
          </div>
          <BookingLink source="om-andreas" className="btn btn-on-dark btn-lg shrink-0">
            {c("text_007") || undefined}
          </BookingLink>
        </div>
      </section>
    </SiteLayout>
  );
};

export default OmAndreas;

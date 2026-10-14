import { privacyContent } from "@/content/privacy";
import { useSiteContent } from "@/hooks/useSiteContent";
import { openCookieSettings } from "@/lib/privacyConsent";
import SeoHead from "@/components/SeoHead";
import SiteLayout from "@/components/site/SiteLayout";
import PageIntro from "@/components/site/PageIntro";
import SmartLink from "@/components/site/SmartLink";

export default function Privacy() {
  const { c, g } = useSiteContent(privacyContent);

  return (
    <SiteLayout>
      <SeoHead title={c("seo_title")} description={c("seo_description")} path="/integritet" />
      <PageIntro crumbs={{ home: c("text_001"), current: c("text_002") }} title={c("text_002")} lead={c("text_003")} />

      <section className="rule-top pb-24 pt-12 md:pt-16">
        <div className="page-gutter">
          <div className="article">
            <h2>{c("text_004")}</h2>
            <p>
              {c("text_005")}
              <a href={`mailto:${g("email")}`}>{g("email")}</a>
              {c("text_006")}
            </p>

            <h2>{c("text_007")}</h2>
            <p>{c("text_008")}</p>
            <p>{c("text_021")}</p>

            <h2>{c("text_022")}</h2>
            <p>{c("text_023")}</p>
            <p>{c("text_024")}</p>

            <h2>{c("text_010")}</h2>
            <p>
              {c("text_011")}
              <SmartLink to={c("link_002")}>{c("text_012")}</SmartLink>.
            </p>
            <p>
              {c("text_013")}
              <code className="rounded bg-paper-deep px-1.5 py-0.5 text-[0.9em]">{c("text_014")}</code>
              {c("text_015")}
            </p>
            <p>
              <button type="button" onClick={openCookieSettings} className="btn btn-quiet">
                Ändra ditt val om statistik
              </button>
            </p>
            <p>{c("text_016")}</p>

            <h2>{c("text_017")}</h2>
            <p>{c("text_018")}</p>
            <p>
              {c("text_019")}
              <SmartLink to={c("link_003")}>{c("text_020")}</SmartLink>.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

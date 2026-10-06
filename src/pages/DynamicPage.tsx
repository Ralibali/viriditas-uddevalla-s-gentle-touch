import { useParams, Link } from "react-router-dom";
import { useSitePage } from "@/hooks/useSitePages";
import { PageBlocks } from "@/components/cms/BlockRenderer";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SeoHead from "@/components/SeoHead";
import { headingLevel } from "@/lib/cmsContentSafety";

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading, isError, refetch } = useSitePage(slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar alwaysSolid />
        <main className="pt-32 pb-20 px-6 text-center" aria-busy="true">
          <p role="status" className="text-muted-foreground font-body">Laddar...</p>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <SeoHead title="Sidan kunde inte laddas | Viriditas" description="Försök ladda sidan igen." noindex />
        <Navbar alwaysSolid />
        <main className="pt-32 pb-20 px-6 text-center">
          <h1 className="text-3xl font-display mb-4">Sidan kunde inte laddas</h1>
          <p role="alert" className="text-muted-foreground mb-6">Anslutningen misslyckades. Försök igen om en stund.</p>
          <button type="button" onClick={() => refetch()} className="rounded-full bg-primary px-6 py-3 text-primary-foreground">Försök igen</button>
        </main>
        <Footer />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-background">
        <SeoHead
          title="Sidan hittades inte | Viriditas"
          description="Sidan du letar efter finns inte längre."
          noindex
        />
        <Navbar alwaysSolid />
        <main className="pt-32 pb-20 px-6 text-center">
          <h1 className="text-4xl font-display font-semibold text-foreground mb-4">404</h1>
          <p className="text-muted-foreground font-body">Sidan hittades inte.</p>
          <Link to="/" className="text-primary font-body mt-4 inline-block hover:underline">← Tillbaka till startsidan</Link>
        </main>
      </div>
    );
  }

  const description =
    page.meta_description ||
    `${page.title} – läs mer hos Viriditas, klassisk massage i Uddevalla.`;

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={`${page.title} | Viriditas`}
        description={description}
        path={`/p/${page.slug}`}
      />
      <Navbar alwaysSolid />
      <main className="pt-32 pb-20 px-6" id="main-content">
        <article className="max-w-3xl mx-auto">
          {!page.content.some((block) => block.type === "heading" && headingLevel(block.data.level) === 1) && (
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-8 leading-tight">{page.title}</h1>
          )}
          <PageBlocks blocks={page.content} />
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default DynamicPage;

import { useParams, Link } from "react-router-dom";
import { useSitePage } from "@/hooks/useSitePages";
import { PageBlocks } from "@/components/cms/BlockRenderer";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SeoHead from "@/components/SeoHead";

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading } = useSitePage(slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 px-6 text-center">
          <p className="text-muted-foreground font-body">Laddar...</p>
        </div>
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
        <Navbar />
        <div className="pt-32 pb-20 px-6 text-center">
          <h1 className="text-4xl font-display font-semibold text-foreground mb-4">404</h1>
          <p className="text-muted-foreground font-body">Sidan hittades inte.</p>
          <Link to="/" className="text-primary font-body mt-4 inline-block hover:underline">← Tillbaka till startsidan</Link>
        </div>
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
      <Navbar />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <PageBlocks blocks={page.content} />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DynamicPage;

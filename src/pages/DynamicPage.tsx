import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSitePage } from "@/hooks/useSitePages";
import { PageBlocks } from "@/components/cms/BlockRenderer";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { MapPin, Phone } from "lucide-react";

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading } = useSitePage(slug || "");

  useEffect(() => {
    if (page) {
      document.title = page.title + " | Viriditas";
      const meta = document.querySelector('meta[name="description"]');
      if (meta && page.meta_description) {
        meta.setAttribute("content", page.meta_description);
      }
    }
  }, [page]);

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
        <Navbar />
        <div className="pt-32 pb-20 px-6 text-center">
          <h1 className="text-4xl font-display font-semibold text-foreground mb-4">404</h1>
          <p className="text-muted-foreground font-body">Sidan hittades inte.</p>
          <Link to="/" className="text-primary font-body mt-4 inline-block hover:underline">← Tillbaka till startsidan</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <PageBlocks blocks={page.content} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border bg-foreground text-primary-foreground">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="font-display text-2xl font-semibold mb-4">Viriditas</h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">
                Klassisk massage i Uddevalla. Diplomerad massageterapeut med passion för välmående.
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-4">Snabblänkar</h4>
              <div className="space-y-2">
                <Link to="/" className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">Hem</Link>
                <Link to="/om-andreas" className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">Om Andreas</Link>
                <Link to="/klassisk-massage" className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">Klassisk massage</Link>
              </div>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-4">Kontakt</h4>
              <div className="space-y-3 text-sm text-primary-foreground/70">
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Norra Drottninggatan 2, Uddevalla</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> 076-317 78 97</p>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-8 text-center">
            <p className="text-primary-foreground/50 text-sm">
              &copy; {new Date().getFullYear()} Viriditas – Andreas Håman. Alla rättigheter förbehållna.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DynamicPage;

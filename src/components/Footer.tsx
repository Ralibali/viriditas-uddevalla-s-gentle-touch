import { MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useSitePages } from "@/hooks/useSitePages";
import { trackPhoneClick } from "@/lib/trackBookingClick";

const Footer = () => {
  const { data: pages } = useSitePages();
  const published = (pages || []).filter((p) => p.is_published);

  return (
    <footer className="py-16 px-6 border-t border-border bg-foreground text-primary-foreground">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-display font-semibold text-2xl mb-4">Viriditas</h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Klassisk massage i Uddevalla. Diplomerad massageterapeut och certifierad massör enligt Branschrådet Svensk Massage med passion för välmående.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Snabblänkar</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">Hem</Link>
              <Link to="/om-andreas" className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">Om Andreas</Link>
              <Link to="/klassisk-massage" className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">Klassisk massage</Link>
              <Link to="/avslappningsmassage-uddevalla" className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">Avslappningsmassage</Link>
              <Link to="/massage-mot-nackspanning" className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">Massage mot nackspänning</Link>
              <Link to="/friskvardsbidrag-massage-uddevalla" className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">Friskvårdsbidrag</Link>
              <Link to="/massage-ljungskile" className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">Massage Ljungskile</Link>
              <a
                href="https://www.bokadirekt.se/places/viriditas-massage-136924"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors"
              >
                Boka online
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Kunskapsbank</h4>
            <div className="space-y-2">
              {published.length > 0 ? (
                published.map((p) => (
                  <Link
                    key={p.id}
                    to={`/p/${p.slug}`}
                    className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors"
                  >
                    {p.nav_label || p.title}
                  </Link>
                ))
              ) : (
                <p className="text-primary-foreground/50 text-sm">Artiklar publiceras snart.</p>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Kontakt</h4>
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" /> Uddevalla Folkets Hus, Göteborgsvägen 11B
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a
                  href="tel:+46763177897"
                  onClick={() => trackPhoneClick("footer")}
                  className="hover:text-primary-foreground transition-colors"
                >
                  076-317 78 97
                </a>
              </p>
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
  );
};

export default Footer;

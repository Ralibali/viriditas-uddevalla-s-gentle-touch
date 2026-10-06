import { useSiteContent } from "@/hooks/useSiteContent";
import { MapPin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useSitePages } from "@/hooks/useSitePages";
import { trackContactClick } from "@/lib/trackBookingClick";

const Footer = () => {
  const { c, g } = useSiteContent("footer");

  const { data: pages } = useSitePages();
  const published = (pages || []).filter((p) => p.is_published);

  return (
    <footer className="py-16 px-6 border-t border-border bg-foreground text-primary-foreground">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-display font-semibold text-2xl mb-4">{g("business_name")}</h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">{c("text_001", "Klassisk massage i Uddevalla. Diplomerad massageterapeut och certifierad massör enligt Branschrådet Svensk Massage med passion för välmående.")}</p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">{c("text_002", "Snabblänkar")}</h4>
            <div className="space-y-2">
              <Link to={c("link_001", "/")} className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">{c("text_003", "Hem")}</Link>
              <Link to={c("link_002", "/om-andreas")} className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">{c("text_004", "Om Andreas")}</Link>
              <Link to={c("link_003", "/klassisk-massage")} className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">{c("text_005", "Klassisk massage")}</Link>
              <Link to={c("link_004", "/avslappningsmassage-uddevalla")} className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">{c("text_006", "Avslappningsmassage")}</Link>
              <Link to={c("link_005", "/massage-mot-nackspanning")} className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">{c("text_007", "Massage mot nackspänning")}</Link>
              <Link to={c("link_006", "/friskvardsbidrag-massage-uddevalla")} className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">{c("text_008", "Friskvårdsbidrag")}</Link>
              <Link to={c("link_007", "/massage-ljungskile")} className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">{c("text_009", "Massage Ljungskile")}</Link>
              <a
                href={g("booking_url")}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors"
              >{c("text_010", "Boka online")}</a>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">{c("text_011", "Kunskapsbank")}</h4>
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
                <p className="text-primary-foreground/50 text-sm">{c("text_012", "Artiklar publiceras snart.")}</p>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">{c("text_013", "Kontakt")}</h4>
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />{c("text_014", " Uddevalla Folkets Hus, Göteborgsvägen 11B")}</p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a
                  href={`mailto:${g("email")}`}
                  onClick={() => trackContactClick("footer-email")}
                  className="hover:text-primary-foreground transition-colors"
                >{g("email")}</a>
              </p>
            </div>
          </div>
        </div>
        <Link to={c("link_008", "/integritet")} className="block text-sm underline mb-6">{c("text_015", "Integritet och cookies")}</Link>
        <div className="border-t border-primary-foreground/20 pt-8 text-center">
          <p className="text-primary-foreground/50 text-sm">
            &copy; {new Date().getFullYear()}{c("text_016", " Viriditas – Andreas Håman. Alla rättigheter förbehållna.")}</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

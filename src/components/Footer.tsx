import { MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
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
            <a
              href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors"
            >
              Boka online
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4">Kontakt</h4>
          <div className="space-y-3 text-sm text-primary-foreground/70">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" /> Uddevalla Folkets Hus, Göteborgsvägen 11B
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 flex-shrink-0" /> 076-317 78 97
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

export default Footer;

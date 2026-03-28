import { useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { trackBookingClick } from "@/lib/trackBookingClick";
import Navbar from "@/components/Navbar";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const OmAndreas = () => {
  useEffect(() => {
    document.title = "Om Andreas Håman – Diplomerad Massageterapeut Uddevalla | Viriditas";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "Andreas Håman är diplomerad massageterapeut i Uddevalla med bakgrund inom vården. Hans unika känslighet gör varje massagebehandling hos Viriditas exceptionell.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Hem",
                "item": "https://viriditasmassage.se/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Om Andreas",
                "item": "https://viriditasmassage.se/om-andreas"
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Andreas Håman",
            "jobTitle": "Diplomerad Massageterapeut",
            "worksFor": {
              "@type": "HealthAndBeautyBusiness",
              "name": "Viriditas",
              "url": "https://viriditasmassage.se"
            },
            "workLocation": {
              "@type": "Place",
              "name": "Hälsokraft",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Norra Drottninggatan 2",
                "addressLocality": "Uddevalla",
                "postalCode": "451 30",
                "addressCountry": "SE"
              }
            }
          })
        }}
      />
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-8 leading-tight"
          >
            Andreas Håman – Diplomerad Massageterapeut i Uddevalla
          </motion.h1>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="space-y-6 text-lg text-muted-foreground leading-relaxed font-body"
          >
            <p>
              Andreas Håman är diplomerad massageterapeut med bakgrund inom vården. Hans resa till massageyrket är ovanlig – och det är just det som gör hans behandlingar unika.
            </p>
            <p>
              Andreas har en synnedsättning som skärpt hans övriga sinnen på ett sätt som är svårt att förklara men lätt att känna. Varje behandling är djupt uppmärksam. Han lyssnar med händerna.
            </p>
            <p>
              Han praktiserar på Hälsokraft, Norra Drottninggatan 2 i Uddevalla, och erbjuder klassisk massage anpassad efter varje persons unika behov – oavsett om du söker avkoppling, smärtlindring eller återhämtning.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-16"
          >
            <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
              Boka din tid
            </h2>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("om-andreas")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-body font-medium text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
            >
              Boka tid <Calendar className="w-5 h-5" />
            </motion.a>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="mt-12"
          >
            <Link
              to="/klassisk-massage"
              className="inline-flex items-center gap-2 text-primary font-body font-medium hover:underline"
            >
              Läs mer om klassisk massage <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
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
                <a href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule" target="_blank" rel="noopener noreferrer" className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">Boka online</a>
              </div>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-4">Kontakt</h4>
              <div className="space-y-3 text-sm text-primary-foreground/70">
                <p>Norra Drottninggatan 2, Uddevalla</p>
                <p>076-317 78 97</p>
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

export default OmAndreas;

import { serializeStructuredData } from "@/lib/siteContentValues";
import { useSiteContent } from "@/hooks/useSiteContent";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { trackBookingClick } from "@/lib/trackBookingClick";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SeoHead from "@/components/SeoHead";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const OmAndreas = () => {
  const { c, g } = useSiteContent("about");

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={c("seo_001", "Om Andreas Håman | Certifierad massör i Uddevalla")}
        description={c("seo_002", "Andreas Håman – diplomerad massageterapeut och certifierad massör enligt Branschrådet Svensk Massage i Uddevalla. Lär känna mannen bakom Viriditas.")}
        path="/om-andreas"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": c("seo_003", "Hem"),
                "item": "https://viriditasmassage.se/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": c("seo_004", "Om Andreas"),
                "item": "https://viriditasmassage.se/om-andreas"
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": g("owner_name"),
            "jobTitle": c("seo_005", "Certifierad massör"),
            "worksFor": {
              "@type": "HealthAndBeautyBusiness",
              "name": g("business_name"),
              "url": "https://viriditasmassage.se"
            },
            "workLocation": {
              "@type": "Place",
              "name": c("seo_006", "Uddevalla Folkets Hus"),
              "address": {
                "@type": "PostalAddress",
                "streetAddress": c("seo_007", "Göteborgsvägen 11B"),
                "addressLocality": c("seo_008", "Uddevalla"),
                "addressCountry": "SE"
              }
            }
          })
        }}
      />
      <Navbar alwaysSolid />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-8 leading-tight"
          >{c("text_001", "Andreas Håman – Certifierad massör i Uddevalla")}</motion.h1>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="space-y-6 text-lg text-muted-foreground leading-relaxed font-body"
          >
            <p>{c("text_002", "Andreas Håman är diplomerad massageterapeut och certifierad massör enligt Branschrådet Svensk Massage med bakgrund inom vården. Hans resa till massageyrket är ovanlig – och det är just det som gör hans behandlingar unika.")}</p>
            <p>{c("text_003", "Andreas har en synnedsättning som skärpt hans övriga sinnen på ett sätt som är svårt att förklara men lätt att känna. Varje behandling är djupt uppmärksam. Han lyssnar med händerna.")}</p>
            <p>{c("text_004", "Han praktiserar i Uddevalla Folkets Hus, Göteborgsvägen 11B, och erbjuder klassisk massage och återhämtningsmassage – anpassade efter varje persons unika behov, oavsett om du söker avkoppling, smärtlindring eller återhämtning.")}</p>
          </motion.div>

          {/* Mid-content CTA */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1.5}
            className="mt-12 bg-primary/5 border border-primary/20 rounded-3xl p-8 text-center"
          >
            <p className="text-foreground font-display font-semibold text-xl mb-2">{c("text_005", "Nyfiken på hur det känns?")}</p>
            <p className="text-muted-foreground font-body mb-4">{c("text_006", "Boka din första behandling och upplev skillnaden.")}</p>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={g("booking_url")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("om-andreas-mid")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-body font-medium shadow-lg shadow-primary/20 hover:shadow-xl transition-shadow"
            >{g("booking_label")}<Calendar className="w-5 h-5" />
            </motion.a>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-16"
          >
            <h2 className="text-3xl font-display font-semibold text-foreground mb-6">{c("text_007", "Boka din tid")}</h2>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={g("booking_url")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("om-andreas")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-body font-medium text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
            >{g("booking_label")}<Calendar className="w-5 h-5" />
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
              to={c("link_001", "/klassisk-massage")}
              className="inline-flex items-center gap-2 text-primary font-body font-medium hover:underline"
            >{c("text_008", "Läs mer om klassisk massage ")}<ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OmAndreas;

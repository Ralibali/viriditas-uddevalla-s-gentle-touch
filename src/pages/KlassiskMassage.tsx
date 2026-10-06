import { treatmentPriceNumber, serializeStructuredData } from "@/lib/siteContentValues";
import { useSiteContent } from "@/hooks/useSiteContent";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, MapPin } from "lucide-react";
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

const KlassiskMassage = () => {
  const { c, g } = useSiteContent("classic");

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={c("seo_001", "Klassisk massage Uddevalla – från 450 kr | Viriditas")}
        description={c("seo_002", "Klassisk massage i Uddevalla från 450 kr. Certifierad massageterapeut i Uddevalla Folkets Hus, Göteborgsvägen 11B. Boka online enkelt via Bokadirekt.")}
        path="/klassisk-massage"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": c("seo_003", "Klassisk massage"),
            "serviceType": "Klassisk massage",
            "provider": {
              "@type": "HealthAndBeautyBusiness",
              "name": g("business_name"),
              "url": "https://viriditasmassage.se",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": c("seo_004", "Göteborgsvägen 11B (Uddevalla Folkets Hus)"),
                "addressLocality": c("seo_005", "Uddevalla"),
                "addressCountry": "SE",
              },
            },
            "areaServed": [
              { "@type": "City", "name": c("seo_005", "Uddevalla") },
              { "@type": "AdministrativeArea", "name": c("seo_006", "Bohuslän") },
            ],
            "url": "https://viriditasmassage.se/klassisk-massage",
            "offers": [
              { "@type": "Offer", "price": treatmentPriceNumber(g("treatment_30_price")), "priceCurrency": "SEK", "name": c("seo_007", "30 min") },
              { "@type": "Offer", "price": treatmentPriceNumber(g("treatment_80_price")), "priceCurrency": "SEK", "name": c("seo_008", "80 min") },
              { "@type": "Offer", "price": treatmentPriceNumber(g("treatment_45_price")), "priceCurrency": "SEK", "name": c("seo_009", "45 min") },
              { "@type": "Offer", "price": treatmentPriceNumber(g("treatment_60_price")), "priceCurrency": "SEK", "name": c("seo_010", "60 min") },
            ],
          }),
        }}
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
                "name": c("seo_011", "Hem"),
                "item": "https://viriditasmassage.se/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": c("seo_012", "Klassisk Massage"),
                "item": "https://viriditasmassage.se/klassisk-massage"
              }
            ]
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
          >{c("text_001", "Klassisk Massage i Uddevalla – Vad är det och vad kostar det?")}</motion.h1>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="space-y-6 text-lg text-muted-foreground leading-relaxed font-body"
          >
            <p>{c("text_002", "Klassisk massage är Sveriges vanligaste massageform och en av de mest välbeforskade behandlingsmetoderna för stress, muskelspänningar och återhämtning.")}</p>
            <p>{c("text_003", "Hos Viriditas i Uddevalla erbjuder vi klassisk massage i fyra längder:")}</p>
            <ul className="list-disc list-inside space-y-2 text-foreground font-medium">
              <li>{c("text_004", "30 minuter – 450 kr")}</li>
              <li>{c("text_005", "45 minuter – 595 kr")}</li>
              <li>{c("text_006", "60 minuter – 720 kr")}</li>
              <li>{c("text_007", "80 minuter – 998 kr")}</li>
            </ul>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-12 space-y-6"
          >
            <h2 className="text-3xl font-display font-semibold text-foreground">{c("text_008", "Vad händer under en klassisk massage?")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-body">{c("text_009", "Behandlingen fokuserar på att lösa upp spänningar i muskler och bindväv, öka blodcirkulationen och ge djup avkoppling. Massageterapeut Andreas Håman anpassar varje behandling efter dig och dina behov.")}</p>
          </motion.div>

          {/* Mid-content CTA */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2.5}
            className="mt-12 bg-primary/5 border border-primary/20 rounded-3xl p-8 text-center"
          >
            <p className="text-foreground font-display font-semibold text-xl mb-2">{c("text_010", "Låter det bra?")}</p>
            <p className="text-muted-foreground font-body mb-4">{c("text_011", "Boka din tid direkt – det tar under en minut.")}</p>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={g("booking_url")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("klassisk-massage-mid")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-body font-medium shadow-lg shadow-primary/20 hover:shadow-xl transition-shadow"
            >{g("booking_label")}<Calendar className="w-5 h-5" />
            </motion.a>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="mt-12 space-y-6"
          >
            <h2 className="text-3xl font-display font-semibold text-foreground flex items-center gap-3">
              <MapPin className="w-7 h-7 text-primary" />{c("text_012", " Var ligger vi?")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-body">{c("text_013", "Viriditas finns i Uddevalla Folkets Hus, Göteborgsvägen 11B. Enkel parkering och centralt läge.")}</p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="mt-12 space-y-6"
          >
            <h2 className="text-3xl font-display font-semibold text-foreground">{c("text_014", "Boka massage i Uddevalla")}</h2>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={g("booking_url")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("klassisk-massage")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-body font-medium text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
            >{g("booking_label")}<Calendar className="w-5 h-5" />
            </motion.a>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={5}
            className="mt-12"
          >
            <Link
              to={c("link_001", "/om-andreas")}
              className="inline-flex items-center gap-2 text-primary font-body font-medium hover:underline"
            >{c("text_015", "Läs mer om Andreas Håman ")}<ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default KlassiskMassage;

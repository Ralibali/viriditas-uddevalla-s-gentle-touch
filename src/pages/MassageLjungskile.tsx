import { motion } from "framer-motion";
import { Calendar, ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { trackBookingClick } from "@/lib/trackBookingClick";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

const faqs = [
  {
    q: "Hur långt är det från Ljungskile till Viriditas?",
    a: "Från Ljungskile tar bilresan till Uddevalla centrum ungefär 15–20 minuter längs E6/väg 44. Du kan också ta tåget eller bussen – Uddevalla har goda förbindelser med Ljungskile.",
  },
  {
    q: "Finns det parkering vid mottagningen?",
    a: "Ja. Viriditas finns i Uddevalla Folkets Hus på Göteborgsvägen 11B, med parkeringsmöjligheter i närheten och centralt läge som gör det enkelt att ta sig hit oavsett om du kör eller åker kollektivt.",
  },
  {
    q: "Erbjuder ni samma behandlingar för oss som kommer från Ljungskile?",
    a: "Självklart. Alla behandlingar – klassisk massage, avslappningsmassage och återhämtningsmassage – är desamma oavsett varifrån du kommer. Många av våra kunder reser in från Ljungskile och övriga Bohuslän.",
  },
  {
    q: "Hur bokar jag tid?",
    a: "Du bokar enkelt online via vår bokningssida på peach.nu. Välj en tid som passar din resa in till Uddevalla, så är allt klart på under en minut.",
  },
];

const MassageLjungskile = () => {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Massage nära Ljungskile – i Uddevalla | Viriditas"
        description="Massage nära Ljungskile – endast 15–20 min till Viriditas i Uddevalla. Klassisk massage hos diplomerad massör, enkel parkering. Boka online, från 550 kr."
        path="/massage-ljungskile"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Massage nära Ljungskile",
            "serviceType": "Klassisk massage",
            "provider": {
              "@type": "HealthAndBeautyBusiness",
              "name": "Viriditas",
              "url": "https://viriditasmassage.se",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Göteborgsvägen 11B (Uddevalla Folkets Hus)",
                "addressLocality": "Uddevalla",
                "addressCountry": "SE",
              },
            },
            "areaServed": [
              { "@type": "City", "name": "Ljungskile" },
              { "@type": "City", "name": "Uddevalla" },
              { "@type": "AdministrativeArea", "name": "Bohuslän" },
            ],
            "url": "https://viriditasmassage.se/massage-ljungskile",
            "offers": [
              { "@type": "Offer", "price": "550", "priceCurrency": "SEK", "name": "45 min" },
              { "@type": "Offer", "price": "650", "priceCurrency": "SEK", "name": "60 min" },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map((f) => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": { "@type": "Answer", "text": f.a },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Hem", "item": "https://viriditasmassage.se/" },
              { "@type": "ListItem", "position": 2, "name": "Massage Ljungskile", "item": "https://viriditasmassage.se/massage-ljungskile" },
            ],
          }),
        }}
      />
      <Navbar alwaysSolid />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-8 leading-tight"
          >
            Massage nära Ljungskile – välkommen till Viriditas i Uddevalla
          </motion.h1>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="space-y-6 text-lg text-muted-foreground leading-relaxed font-body"
          >
            <p>
              Bor du i Ljungskile och letar efter en skicklig massör? Då har du Viriditas på bekvämt avstånd. Från Ljungskile tar du dig till vår mottagning i Uddevalla på bara 15–20 minuter, och väl framme möts du av lugn, omtanke och behandlingar som verkligen gör skillnad. Många av våra trognaste kunder reser just in från Ljungskile och resten av Bohuslän.
            </p>
            <p>
              Viriditas drivs av Andreas Håman, diplomerad massageterapeut och certifierad massör enligt Branschrådet Svensk Massage. Hans skärpta känsel – en följd av en synnedsättning – gör varje behandling ovanligt uppmärksam och personlig. Oavsett om du söker djup avslappning, lindring av nackspänning eller bara en stunds återhämtning är resan in till Uddevalla väl värd den.
            </p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4 flex items-center gap-3">
              <MapPin className="w-7 h-7 text-primary" /> Hitta hit från Ljungskile
            </h2>
            <p>
              Viriditas finns i Uddevalla Folkets Hus, Göteborgsvägen 11B – centralt och lättillgängligt. Kör du från Ljungskile följer du E6/väg 44 norrut mot Uddevalla, och det finns goda parkeringsmöjligheter i närheten av Folkets Hus. Föredrar du att åka kollektivt går både tåg och buss smidigt mellan Ljungskile och Uddevalla, med kort promenad till mottagningen.
            </p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">
              Samma behandlingar – nära dig
            </h2>
            <p>
              Hos Viriditas får du tillgång till hela utbudet: klassisk massage i 45 eller 60 minuter, avslappningsmassage för stress och sömn samt återhämtningsmassage till reducerat pris för dig som är arbetslös eller har sjukersättning. Behandlingarna anpassas alltid efter dina behov, oavsett om du kommer från Ljungskile, Uddevalla centrum eller någon annanstans i Bohuslän.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-12 bg-primary/5 border border-primary/20 rounded-3xl p-8 text-center"
          >
            <p className="text-foreground font-display font-semibold text-xl mb-2">Bara en kort resa bort</p>
            <p className="text-muted-foreground font-body mb-4">Boka din massage i Uddevalla – enkelt och snabbt.</p>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("ljungskile-mid")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-body font-medium shadow-lg shadow-primary/20 hover:shadow-xl transition-shadow"
            >
              Boka tid <Calendar className="w-5 h-5" />
            </motion.a>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="mt-12 space-y-6 text-lg text-muted-foreground leading-relaxed font-body"
          >
            <p>
              Vill du läsa mer innan du bokar? Se vår sida om{" "}
              <Link to="/klassisk-massage" className="text-primary font-medium underline-offset-4 hover:underline">klassisk massage i Uddevalla</Link>, om{" "}
              <Link to="/avslappningsmassage-uddevalla" className="text-primary font-medium underline-offset-4 hover:underline">avslappningsmassage</Link> eller hur du kan använda ditt{" "}
              <Link to="/friskvardsbidrag-massage-uddevalla" className="text-primary font-medium underline-offset-4 hover:underline">friskvårdsbidrag</Link>.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="mt-12"
          >
            <h2 className="text-3xl font-display font-semibold text-foreground mb-6">Vanliga frågor</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left font-body text-foreground">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground font-body leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={5}
            className="mt-12 space-y-6"
          >
            <h2 className="text-3xl font-display font-semibold text-foreground">Boka massage – nära Ljungskile</h2>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("ljungskile")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-body font-medium text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
            >
              Boka tid <Calendar className="w-5 h-5" />
            </motion.a>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6} className="mt-12">
            <Link to="/om-andreas" className="inline-flex items-center gap-2 text-primary font-body font-medium hover:underline">
              Läs mer om Andreas Håman <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MassageLjungskile;

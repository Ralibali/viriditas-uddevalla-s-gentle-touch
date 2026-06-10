import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
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

const BOOKING_URL = "https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule";

const faqs = [
  {
    q: "Hur skiljer sig avslappningsmassage från klassisk massage?",
    a: "Avslappningsmassage använder samma grundtekniker som klassisk massage men med mjukare tryck och lugnare tempo. Fokus ligger på helhetsavslappning och stressreduktion snarare än djup bearbetning av enskilda muskler. Hos Viriditas anpassas varje behandling efter dina önskemål.",
  },
  {
    q: "Hur ofta bör jag gå på avslappningsmassage?",
    a: "För att hantera vardagsstress fungerar en behandling per månad bra för de flesta. Under perioder av hög belastning kan tätare besök, exempelvis varannan vecka, ge bättre effekt.",
  },
  {
    q: "Kan jag använda friskvårdsbidraget?",
    a: "Ja. Massage hos diplomerad massör är godkänd friskvård enligt Skatteverket, och du får kvitto som du laddar upp i din arbetsgivares friskvårdsportal.",
  },
  {
    q: "Vad ska jag tänka på inför besöket?",
    a: "Ingenting särskilt – kom som du är. Undvik gärna en stor måltid precis innan, och räkna med att ge dig själv några lugna minuter efter behandlingen i stället för att rusa vidare.",
  },
];

const AvslappningsmassageUddevalla = () => {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Avslappningsmassage Uddevalla – Boka hos Viriditas | Från 550 kr"
        description="Avslappningsmassage i Uddevalla hos diplomerad massör Andreas Håman. Minska stress, sov bättre och hitta lugnet. Folkets Hus, Göteborgsvägen 11B. Boka online."
        path="/avslappningsmassage-uddevalla"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Avslappningsmassage",
            "serviceType": "Avslappningsmassage",
            "provider": {
              "@type": "HealthAndBeautyBusiness",
              "@id": "https://viriditasmassage.se/#business",
              "name": "Viriditas",
              "url": "https://viriditasmassage.se",
            },
            "areaServed": [
              { "@type": "City", "name": "Uddevalla" },
              { "@type": "AdministrativeArea", "name": "Bohuslän" },
            ],
            "url": "https://viriditasmassage.se/avslappningsmassage-uddevalla",
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
              { "@type": "ListItem", "position": 2, "name": "Avslappningsmassage Uddevalla", "item": "https://viriditasmassage.se/avslappningsmassage-uddevalla" },
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
            Avslappningsmassage i Uddevalla
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-lg text-muted-foreground leading-relaxed font-body"
          >
            Känner du dig stressad, spänd eller har svårt att varva ner? Hos Viriditas i centrala Uddevalla får du en avslappningsmassage som är skapad för att lugna nervsystemet, lösa upp ytliga spänningar och ge kroppen den återhämtning den behöver. Behandlingen utförs av Andreas Håman – diplomerad massageterapeut med bakgrund inom vården.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1.5}
            className="mt-8"
          >
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("avslappningsmassage-top")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-body font-medium text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
            >
              Boka tid <Calendar className="w-5 h-5" />
            </motion.a>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-12 space-y-6 text-lg text-muted-foreground leading-relaxed font-body"
          >
            <h2 className="text-3xl font-display font-semibold text-foreground">Vad är avslappningsmassage?</h2>
            <p>
              Avslappningsmassage är en mjukare form av klassisk massage där fokus ligger på långa, lugna strykningar och ett behagligt tryck snarare än djup muskelbearbetning. Syftet är inte i första hand att jobba bort enskilda muskelknutor, utan att sänka kroppens stressnivå som helhet.
            </p>
            <p>
              När kroppen får ro aktiveras det parasympatiska nervsystemet – kroppens "vila och återhämta"-läge. Pulsen går ner, andningen blir djupare och musklerna släpper gradvis sina spänningar. Många somnar nästan på bänken, och det är helt okej. Det är faktiskt ett kvitto på att behandlingen gör sitt jobb.
            </p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">Så kan avslappningsmassage hjälpa dig</h2>
            <p>Regelbunden avslappningsmassage kan göra märkbar skillnad om du:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>har en stressig vardag med jobb, familj och fullbokad kalender</li>
              <li>sover dåligt eller har svårt att somna</li>
              <li>känner dig spänd i axlar, nacke eller rygg utan att ha direkt smärta</li>
              <li>vill förebygga stressrelaterade besvär innan de blir problem</li>
              <li>helt enkelt behöver en stund som bara är din</li>
            </ul>
            <p>
              Massage är en av få stunder i vardagen där du inte förväntas prestera någonting alls. Du ligger på bänken, terapeuten gör jobbet, och kroppen får lov att bara vara.
            </p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">En massör som känner mer</h2>
            <p>
              Andreas Håman har en synnedsättning – något som skärpt hans övriga sinnen och gett honom en ovanligt utvecklad känslighet i händerna. Han läser av spänningar i din kropp som många andra missar, och anpassar tryck och tempo efter exakt vad du behöver just den dagen. I kombination med hans bakgrund inom vården får du en behandling som är både trygg och genuint lyhörd.
            </p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">Praktisk information</h2>
            <p>
              Viriditas finns i Uddevalla Folkets Hus på Göteborgsvägen 11B, mitt i centrala Uddevalla med goda parkeringsmöjligheter i närheten. Du bokar enkelt online via vår bokningssida – välj 45 minuter (550 kr) eller 60 minuter (650 kr). Behandlingen är godkänd för friskvårdsbidrag.
            </p>
            <p>
              Läs mer om{" "}
              <Link to="/klassisk-massage" className="text-primary font-medium underline-offset-4 hover:underline">klassisk massage i Uddevalla</Link>, om{" "}
              <Link to="/massage-mot-nackspanning" className="text-primary font-medium underline-offset-4 hover:underline">massage mot nackspänning</Link> eller hur du använder ditt{" "}
              <Link to="/friskvardsbidrag-massage-uddevalla" className="text-primary font-medium underline-offset-4 hover:underline">friskvårdsbidrag</Link>.
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mt-12">
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

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4} className="mt-12 space-y-6">
            <h2 className="text-3xl font-display font-semibold text-foreground">Boka avslappningsmassage i Uddevalla</h2>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("avslappningsmassage-bottom")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-body font-medium text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
            >
              Boka tid <Calendar className="w-5 h-5" />
            </motion.a>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="mt-12">
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

export default AvslappningsmassageUddevalla;

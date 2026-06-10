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

const faqs = [
  {
    q: "Vad är skillnaden på avslappningsmassage och klassisk massage?",
    a: "Avslappningsmassage bygger på samma teknik som klassisk svensk massage, men med ett lugnare tempo och mjukare tryck. Fokus ligger på att lugna nervsystemet och ge djup vila snarare än att bearbeta enskilda muskelknutor.",
  },
  {
    q: "Kan massage hjälpa mot stress och sömnproblem?",
    a: "Ja. Lugn, rytmisk massage sänker stresshormonet kortisol och aktiverar det parasympatiska nervsystemet – kroppens vilo- och återhämtningsläge. Många upplever bättre sömn redan natten efter en behandling.",
  },
  {
    q: "Hur ofta bör jag boka avslappningsmassage?",
    a: "Vid hög stress kan varannan vecka ge bäst effekt inledningsvis. För allmänt välmående räcker det ofta med en behandling i månaden som en stunds återhämtning.",
  },
  {
    q: "Hur lång är en behandling och vad kostar den?",
    a: "Du väljer mellan 45 minuter för 550 kr eller 60 minuter för 650 kr. Sextiominuterspasset ger mer tid för djup avslappning från topp till tå.",
  },
];

const AvslappningsmassageUddevalla = () => {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Avslappningsmassage Uddevalla – lugn & återhämtning | Viriditas"
        description="Avslappningsmassage i Uddevalla mot stress och sömnproblem. Lugn, mjuk massage hos diplomerad massör Andreas Håman. Från 550 kr – boka online."
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
            Avslappningsmassage i Uddevalla – andas ut och återhämta dig
          </motion.h1>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="space-y-6 text-lg text-muted-foreground leading-relaxed font-body"
          >
            <p>
              Lever du med ständig stress, orolig sömn eller en känsla av att aldrig riktigt landa? Avslappningsmassage hos Viriditas i Uddevalla är till för dig som behöver sänka varvtalet och ge kropp och själ en stunds äkta vila. I en lugn och omsorgsfullt förberedd lokal i Uddevalla Folkets Hus får du tid att bara vara.
            </p>
            <p>
              Behandlingen utgår från klassisk svensk massage men hålls i ett medvetet långsamt tempo med mjukt, jämnt tryck. Långa, rytmiska strykningar lugnar nervsystemet, sänker pulsen och hjälper kroppen att gå från stresspåslag till återhämtning. Resultatet är en djup avspänning som ofta märks långt efter att du lämnat behandlingsbänken – i form av lättare axlar, klarare tankar och bättre sömn.
            </p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">
              När gör avslappningsmassage som mest nytta?
            </h2>
            <p>
              Många av de som söker sig hit har ett högt tempo i vardagen: pressade arbetsdagar, ansvar hemma och en hjärna som sällan stänger av. Avslappningsmassage är särskilt värdefull vid långvarig stress, spänningar som sätter sig i nacke och axlar, sömnsvårigheter och allmän mental trötthet. Den passar också utmärkt som förebyggande egenvård – ett sätt att möta stressen innan den blir till värk.
            </p>
            <p>
              Andreas Håman är diplomerad massageterapeut och certifierad massör enligt Branschrådet Svensk Massage. Hans skärpta känsel – en följd av en synnedsättning – gör att han läser av kroppens spänningar med ovanlig precision och anpassar varje behandling efter just dig.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-12 bg-primary/5 border border-primary/20 rounded-3xl p-8 text-center"
          >
            <p className="text-foreground font-display font-semibold text-xl mb-2">Dags att unna dig vila?</p>
            <p className="text-muted-foreground font-body mb-4">Boka din avslappningsmassage – det tar under en minut.</p>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("avslappningsmassage-mid")}
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
            <h2 className="text-3xl font-display font-semibold text-foreground">
              Så går behandlingen till
            </h2>
            <p>
              Vi börjar med ett kort samtal om hur du mår och vad du behöver – vill du ha ren avkoppling eller lite mer fokus på spända områden? Sedan får du landa på en varm bänk medan lugn massage arbetar sig genom rygg, nacke, axlar och övriga kroppen. Du behöver inte prestera något; din enda uppgift är att andas och slappna av.
            </p>
            <p>
              Vill du veta mer om grundtekniken kan du läsa om{" "}
              <Link to="/klassisk-massage" className="text-primary font-medium underline-offset-4 hover:underline">klassisk massage i Uddevalla</Link>. Bär du på spänningar som ger huvudvärk passar kanske{" "}
              <Link to="/massage-mot-nackspanning" className="text-primary font-medium underline-offset-4 hover:underline">massage mot nackspänning</Link> bättre.
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
            <h2 className="text-3xl font-display font-semibold text-foreground">Boka avslappningsmassage i Uddevalla</h2>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("avslappningsmassage")}
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

export default AvslappningsmassageUddevalla;

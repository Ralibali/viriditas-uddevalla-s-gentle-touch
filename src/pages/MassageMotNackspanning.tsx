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
    q: "Kan massage hjälpa mot spänningshuvudvärk?",
    a: "Ja. Spänningshuvudvärk beror ofta på stram muskulatur i nacke, axlar och käke. Genom att lösa upp dessa spänningar minskar trycket på nerver och blodkärl, vilket för många lindrar både huvudvärk och tryckkänsla.",
  },
  {
    q: "Jag sitter framför datorn hela dagen – kan ni hjälpa?",
    a: "Absolut. Kontorsarbete med statisk hållning är en av de vanligaste orsakerna till stel nacke och ömma axlar. Behandlingen fokuserar på de muskelgrupper som belastas av skärmarbete och kombineras gärna med tips på rörelse i vardagen.",
  },
  {
    q: "Hur många behandlingar behöver jag?",
    a: "Vid akuta besvär kan det krävas några behandlingar tätare inpå varandra, exempelvis varje vecka inledningsvis. När spänningarna släppt räcker ofta underhåll varje månad för att hålla nacke och axlar mjuka.",
  },
  {
    q: "Ska massage mot nackspänning göra ont?",
    a: "Nej. Trycket anpassas efter dig – från mjukt till djupare bearbetning. Det kan kännas en behaglig ömhet i spända partier, men behandlingen ska aldrig vara smärtsam. Säg alltid till om något känns fel.",
  },
];

const MassageMotNackspanning = () => {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Massage mot nackspänning & huvudvärk – Uddevalla | Viriditas"
        description="Massage mot nackspänning, stela axlar och spänningshuvudvärk i Uddevalla. Perfekt för dig med kontorsjobb. Diplomerad massör, från 550 kr. Boka online."
        path="/massage-mot-nackspanning"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Massage mot nackspänning och huvudvärk",
            "serviceType": "Massage mot nackspänning",
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
            "url": "https://viriditasmassage.se/massage-mot-nackspanning",
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
              { "@type": "ListItem", "position": 2, "name": "Massage mot nackspänning", "item": "https://viriditasmassage.se/massage-mot-nackspanning" },
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
            Massage mot nackspänning och huvudvärk i Uddevalla
          </motion.h1>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="space-y-6 text-lg text-muted-foreground leading-relaxed font-body"
          >
            <p>
              Stel nacke, ömma axlar och en molande huvudvärk som kommer tillbaka dag efter dag? Du är långt ifrån ensam. Spänningar i nacke och skuldror är ett av de vanligaste skälen till att människor i Uddevalla söker massage – och ofta är orsaken vardaglig: timmar framför skärmen, en framåtlutad hållning och stress som biter sig fast i musklerna.
            </p>
            <p>
              Hos Viriditas i Uddevalla Folkets Hus får du en behandling som riktar sig direkt mot de muskelgrupper som skapar besvären. Genom klassisk massageteknik – strykningar, knådning och riktat tryck mot nacke, skulderparti och övre rygg – löser vi gradvis upp den stramhet som ger spänningshuvudvärk och nedsatt rörlighet.
            </p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">
              Varför uppstår nackspänning?
            </h2>
            <p>
              När vi sitter still och belastar samma muskler under lång tid – vid datorn, i bilen eller med mobilen – arbetar nack- och skuldermusklerna statiskt utan paus. Det leder till syrebrist, slaggprodukter och till slut spända, ömma muskler. Lägg till stress, som får oss att dra upp axlarna mot öronen, och du har den perfekta grogrunden för huvudvärk och stelhet.
            </p>
            <p>
              Massage bryter den onda cirkeln: blodcirkulationen ökar, muskeln får syre och näring, och nervsystemet får signalen att slappna av. Många märker direkt att huvudet känns lättare och att rörligheten i nacken förbättras redan efter ett pass.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-12 bg-primary/5 border border-primary/20 rounded-3xl p-8 text-center"
          >
            <p className="text-foreground font-display font-semibold text-xl mb-2">Trött på spänningshuvudvärken?</p>
            <p className="text-muted-foreground font-body mb-4">Boka en behandling som riktar sig mot nacke och axlar.</p>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("nackspanning-mid")}
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
              För dig som jobbar vid skärm
            </h2>
            <p>
              Är du kontorsarbetare, programmerare, ekonom eller jobbar på annat sätt mycket vid datorn? Då hör du till den grupp som har allra mest att vinna på regelbunden massage. Behandlingen kombineras gärna med enkla råd om hur du kan variera din arbetsställning och bryta stillasittandet under dagen, så att effekten håller i sig längre.
            </p>
            <p>
              Söker du i stället ren återhämtning kan du läsa om{" "}
              <Link to="/avslappningsmassage-uddevalla" className="text-primary font-medium underline-offset-4 hover:underline">avslappningsmassage i Uddevalla</Link>, och vill du veta mer om grundtekniken finns en utförlig sida om{" "}
              <Link to="/klassisk-massage" className="text-primary font-medium underline-offset-4 hover:underline">klassisk massage</Link>.
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
            <h2 className="text-3xl font-display font-semibold text-foreground">Boka massage mot nackspänning</h2>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("nackspanning")}
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

export default MassageMotNackspanning;

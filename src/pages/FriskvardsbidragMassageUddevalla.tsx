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
    q: "Är massage godkänt som friskvård av Skatteverket?",
    a: "Ja. Klassisk massage hos en utbildad massör räknas som enklare motion och friskvård enligt Skatteverket, och får betalas med friskvårdsbidrag. Det gäller behandlingar i förebyggande syfte – inte sjukvårdande behandling.",
  },
  {
    q: "Hur mycket friskvårdsbidrag får jag använda?",
    a: "Arbetsgivaren får erbjuda upp till 5 000 kr per år skattefritt i friskvårdsbidrag. Hur mycket just du har beror på vad din arbetsgivare beslutat – fråga din chef eller HR om din nivå.",
  },
  {
    q: "Hur gör jag för att använda mitt friskvårdsbidrag hos er?",
    a: "Du betalar din behandling som vanligt och får ett kvitto. Kvittot laddar du sedan upp i din arbetsgivares system – exempelvis Epassi, Benify, ePassi, Söderberg & Partners eller direkt till HR – för att få pengarna återbetalda enligt era rutiner.",
  },
  {
    q: "Får jag kvitto med all information som krävs?",
    a: "Ja. Du får ett tydligt kvitto med datum, belopp, typ av behandling och uppgifter om Viriditas, så att det uppfyller arbetsgivarens och Skatteverkets krav för friskvårdsbidrag.",
  },
];

const FriskvardsbidragMassageUddevalla = () => {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Friskvårdsbidrag på massage i Uddevalla – så funkar det | Viriditas"
        description="Använd ditt friskvårdsbidrag på massage i Uddevalla. Skatteverket-godkänt hos diplomerad massör. Kvitto för Epassi, Benify m.fl. Boka online."
        path="/friskvardsbidrag-massage-uddevalla"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Massage med friskvårdsbidrag",
            "serviceType": "Friskvårdsmassage",
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
            "url": "https://viriditasmassage.se/friskvardsbidrag-massage-uddevalla",
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
              { "@type": "ListItem", "position": 2, "name": "Friskvårdsbidrag massage Uddevalla", "item": "https://viriditasmassage.se/friskvardsbidrag-massage-uddevalla" },
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
            Friskvårdsbidrag på massage i Uddevalla – så använder du det
          </motion.h1>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="space-y-6 text-lg text-muted-foreground leading-relaxed font-body"
          >
            <p>
              Visste du att du kan låta arbetsgivaren betala din massage? Massage hos en diplomerad massör är godkänt som friskvård av Skatteverket, vilket betyder att du kan använda ditt friskvårdsbidrag för behandlingar hos Viriditas i Uddevalla. Det är ett av de enklaste och mest uppskattade sätten att omvandla en löneförmån till verkligt välmående.
            </p>
            <p>
              På den här sidan går vi igenom hur friskvårdsbidraget fungerar, vad som gäller enligt Skatteverket, hur du får ut pengarna och vilka arbetsgivarportaler som är vanligast – så att du kan boka med gott samvete och utan krångel.
            </p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">
              Vad är friskvårdsbidrag?
            </h2>
            <p>
              Friskvårdsbidrag är en skattefri förmån som din arbetsgivare kan erbjuda för motion och annan friskvård av enklare slag. Arbetsgivaren får ge upp till 5 000 kr per anställd och år utan att det beskattas. Massage räknas hit – så länge den ges i förebyggande, hälsofrämjande syfte och utförs av någon med relevant utbildning. Andreas Håman är diplomerad massageterapeut och certifierad massör enligt Branschrådet Svensk Massage, vilket uppfyller kraven.
            </p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">
              Så får du ut pengarna – steg för steg
            </h2>
            <p>
              Du betalar din behandling som vanligt och får ett komplett kvitto. Därefter laddar du upp kvittot i din arbetsgivares friskvårdssystem. De vanligaste portalerna är Epassi, Benify, Wellnet och Söderberg & Partners, men många arbetsgivare hanterar det också direkt via HR mot uppvisat kvitto. Hur återbetalningen sker – som utlägg eller via app – beror på era interna rutiner.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-12 bg-primary/5 border border-primary/20 rounded-3xl p-8 text-center"
          >
            <p className="text-foreground font-display font-semibold text-xl mb-2">Låt jobbet betala din massage</p>
            <p className="text-muted-foreground font-body mb-4">Boka din tid – du får kvitto för friskvårdsbidraget.</p>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("friskvard-mid")}
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
              Bra att veta innan du bokar
            </h2>
            <p>
              Kontrollera gärna med din arbetsgivare vilken summa du har kvar av årets friskvårdsbidrag och vilket system ni använder. Tänk på att bidraget gäller per kalenderår och inte kan sparas till nästa år – så passa på att boka in regelbunden massage medan budgeten finns kvar. Du väljer mellan 45 minuter för 550 kr och 60 minuter för 650 kr.
            </p>
            <p>
              Vill du läsa mer om själva behandlingen? Se sidan om{" "}
              <Link to="/klassisk-massage" className="text-primary font-medium underline-offset-4 hover:underline">klassisk massage i Uddevalla</Link> eller om{" "}
              <Link to="/massage-mot-nackspanning" className="text-primary font-medium underline-offset-4 hover:underline">massage mot nackspänning</Link> om du har besvär från skärmarbete.
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
            <h2 className="text-3xl font-display font-semibold text-foreground">Boka massage med friskvårdsbidrag</h2>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("friskvard")}
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

export default FriskvardsbidragMassageUddevalla;

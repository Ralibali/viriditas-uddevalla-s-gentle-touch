import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { trackBookingClick } from "@/lib/trackBookingClick";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SeoHead from "@/components/SeoHead";
import epassiLogo from "@/assets/epassi-logo.svg.asset.json";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const BOOKING_URL = "https://www.bokadirekt.se/places/viriditas-massage-136924";

const faqs = [
  {
    q: "Hur mycket är friskvårdsbidraget på?",
    a: "Det varierar mellan arbetsgivare, vanligtvis 1 500–5 000 kr per år. Skatteverkets tak för skattefritt friskvårdsbidrag är 5 000 kr per år. Fråga din HR-avdelning vad som gäller hos er.",
  },
  {
    q: "Funkar Epassi, Benify eller Wellnet hos er?",
    a: "Ja. Viriditas är ansluten till Epassi, så du kan betala din friskvårdsmassage direkt via Epassi-appen på plats. Använder du en annan portal som Benify eller Wellnet betalar du som vanligt och laddar upp kvittot för ersättning – det fungerar med samtliga vanliga friskvårdsportaler.",
  },
  {
    q: "Kan jag köpa flera behandlingar på en gång?",
    a: "Ja, du kan boka och betala flera behandlingar och redovisa kvittona mot ditt bidrag, så länge du håller dig inom din arbetsgivares regler och årsbelopp.",
  },
  {
    q: "Gäller bidraget även återhämtningsmassage?",
    a: "Återhämtningsmassagen (200 kr) är ett reducerat pris för dig som är arbetslös eller har sjukersättning/sjukpenning – då är friskvårdsbidrag via arbetsgivare oftast inte aktuellt. Kontakta oss om du är osäker på vad som gäller i din situation.",
  },
];

const FriskvardsbidragMassageUddevalla = () => {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Friskvårdsbidrag för massage i Uddevalla | Viriditas"
        description="Använd ditt friskvårdsbidrag för massage i Uddevalla. Klassisk massage hos diplomerad massör är godkänd friskvård enligt Skatteverket. Så funkar det – steg för steg."
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
              "@id": "https://viriditasmassage.se/#business",
              "name": "Viriditas",
              "url": "https://viriditasmassage.se",
            },
            "areaServed": [
              { "@type": "City", "name": "Uddevalla" },
              { "@type": "AdministrativeArea", "name": "Bohuslän" },
            ],
            "url": "https://viriditasmassage.se/friskvardsbidrag-massage-uddevalla",
            "offers": [
              { "@type": "Offer", "price": "595", "priceCurrency": "SEK", "name": "45 min" },
              { "@type": "Offer", "price": "720", "priceCurrency": "SEK", "name": "60 min" },
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
            Använd friskvårdsbidraget för massage i Uddevalla
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-lg text-muted-foreground leading-relaxed font-body"
          >
            Visste du att din massage hos Viriditas kan vara helt eller delvis betald av din arbetsgivare? Klassisk massage hos diplomerad massör är godkänd friskvård enligt Skatteverkets regler – och de flesta arbetsgivare i Sverige erbjuder idag ett friskvårdsbidrag på mellan 1 500 och 5 000 kr per år. Här går vi igenom exakt hur det fungerar.
          </motion.p>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1.5} className="mt-8">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("friskvard-top")}
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
            <h2 className="text-3xl font-display font-semibold text-foreground">Är massage godkänt som friskvård?</h2>
            <p>
              Ja. Skatteverket klassar massage som en godkänd friskvårdsaktivitet när syftet är att förebygga eller motverka ömhet och stelhet – exempelvis behandling av nacke, axlar och rygg. Det gäller klassisk massage av precis den typ som Viriditas erbjuder. Behandlingen ska vara av enklare slag, vilket vanlig massage hos massör uppfyller.
            </p>
            <p>
              Det innebär att både vår klassiska massage på 45 minuter (595 kr) och 60 minuter (720 kr) går utmärkt att betala med friskvårdsbidraget.
            </p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">Så använder du bidraget – steg för steg</h2>
            <ol className="list-decimal list-inside space-y-3">
              <li><span className="font-medium text-foreground">Kolla ditt bidrag.</span> Hör med din arbetsgivare eller HR hur stort ditt friskvårdsbidrag är och hur det administreras. De flesta använder en portal som Epassi, Benify, Wellnet eller Söderberg & Partners – andra låter dig lämna in kvitto direkt.</li>
              <li><span className="font-medium text-foreground">Boka och betala din massage.</span> Boka online och betala på plats. Är du ansluten till Epassi kan du betala direkt via Epassi-appen – annars går det bra med kort eller Swish.</li>
              <li><span className="font-medium text-foreground">Spara kvittot.</span> Du får alltid ett kvitto där behandling, datum och belopp framgår.</li>
              <li><span className="font-medium text-foreground">Ladda upp eller lämna in.</span> Registrera kvittot i din friskvårdsportal eller lämna det till din arbetsgivare, så får du ersättningen utbetald.</li>
            </ol>
            <p>
              Hela processen tar ett par minuter. Är du osäker på vad som ska stå på kvittot för just din portal – säg till vid besöket så löser vi det.
            </p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">Smart friskvård som faktiskt gör skillnad</h2>
            <p>
              Många låter friskvårdsbidraget brinna inne varje år. Det är synd – regelbunden massage är ett av de mest direkta sätten att använda bidraget på något som kroppen märker av. Spänningar i nacke och rygg byggs upp långsamt, och regelbunden behandling förebygger att de hinner bli till smärta, huvudvärk eller sjukskrivningsdagar.
            </p>
            <p>
              Med ett bidrag på 3 000 kr räcker det till fyra till fem behandlingar per år – ungefär en per kvartal, vilket är en utmärkt grundrytm för de flesta.
            </p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">Diplomerad massör – det spelar roll</h2>
            <p>
              Hos Viriditas behandlas du av Andreas Håman, diplomerad massageterapeut certifierad enligt Branschrådet Svensk Massage, med bakgrund inom vården. För friskvårdsbidraget är det en trygghet att behandlingen utförs av utbildad och diplomerad massör – och för din kropp är det en ännu större.
            </p>
            <p>
              Läs mer om{" "}
              <Link to="/klassisk-massage" className="text-primary font-medium underline-offset-4 hover:underline">klassisk massage i Uddevalla</Link> eller om{" "}
              <Link to="/massage-mot-nackspanning" className="text-primary font-medium underline-offset-4 hover:underline">massage mot nackspänning</Link> om du har besvär från skärmarbete.
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
            <h2 className="text-3xl font-display font-semibold text-foreground">Boka massage med friskvårdsbidrag</h2>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("friskvard-bottom")}
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

export default FriskvardsbidragMassageUddevalla;

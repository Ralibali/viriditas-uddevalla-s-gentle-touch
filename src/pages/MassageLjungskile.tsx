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

const BOOKING_URL = "https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule";

const faqs = [
  {
    q: "Hur lång tid tar det från Ljungskile till Viriditas?",
    a: "Cirka 15 minuter med bil via E6. Med buss till Uddevalla centrum tar resan något längre, och därifrån är det en kort promenad till Folkets Hus på Göteborgsvägen 11B.",
  },
  {
    q: "Finns det parkering?",
    a: "Ja, det finns goda parkeringsmöjligheter vid och i närheten av Uddevalla Folkets Hus.",
  },
  {
    q: "Kan jag boka kvällstid efter jobbet?",
    a: "Ja. Tisdag till torsdag finns tider fram till 19:00, vilket gör det enkelt att hinna med en behandling efter arbetsdagen även om du pendlar.",
  },
  {
    q: "Hur bokar jag?",
    a: "Du bokar online via vår bokningssida där du ser alla lediga tider direkt. Det går också bra att ringa 076-317 78 97.",
  },
];

const MassageLjungskile = () => {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Massage nära Ljungskile – Viriditas i Uddevalla | Boka online"
        description="Söker du massage i Ljungskile? Viriditas i Uddevalla ligger 15 minuter bort – diplomerad massör, enkel parkering vid Folkets Hus och bokning online. Från 550 kr."
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
              "@id": "https://viriditasmassage.se/#business",
              "name": "Viriditas",
              "url": "https://viriditasmassage.se",
            },
            "areaServed": [
              { "@type": "City", "name": "Ljungskile" },
              { "@type": "City", "name": "Uddevalla" },
              { "@type": "City", "name": "Munkedal" },
              { "@type": "City", "name": "Lysekil" },
              { "@type": "AdministrativeArea", "name": "Bohuslän" },
            ],
            "url": "https://viriditasmassage.se/massage-ljungskile",
            "offers": [
              { "@type": "Offer", "price": "550", "priceCurrency": "SEK", "name": "45 min" },
              { "@type": "Offer", "price": "650", "priceCurrency": "SEK", "name": "60 min" },
              { "@type": "Offer", "price": "200", "priceCurrency": "SEK", "name": "Återhämtningsmassage" },
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

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-lg text-muted-foreground leading-relaxed font-body"
          >
            Bor du i Ljungskile och letar efter en riktigt bra massör? Viriditas ligger i Uddevalla Folkets Hus, bara en kvarts bilresa från Ljungskile längs E6:an. Många av våra återkommande kunder kommer just från Ljungskile med omnejd – för en behandling som är värd den korta resan.
          </motion.p>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1.5} className="mt-8">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("ljungskile-top")}
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
            <h2 className="text-3xl font-display font-semibold text-foreground flex items-center gap-3">
              <MapPin className="w-7 h-7 text-primary" /> Lätt att ta sig hit från Ljungskile
            </h2>
            <p>
              Från Ljungskile tar du dig enklast hit via E6 norrut mot Uddevalla – resan tar ungefär 15 minuter med bil. Viriditas finns i Uddevalla Folkets Hus på Göteborgsvägen 11B, centralt i Uddevalla med goda parkeringsmöjligheter i direkt anslutning. Åker du kollektivt går det täta bussförbindelser mellan Ljungskile och Uddevalla centrum, och från Kampenhof är det bara en kort promenad.
            </p>
            <p>
              Tipset från våra Ljungskile-kunder: kombinera massagen med ett ärende i Uddevalla – behandlingen blir startskottet eller avslutningen på en stund i stan.
            </p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">Behandlingar och priser</h2>
            <p>Hos Viriditas får du klassisk massage av Andreas Håman, diplomerad massageterapeut certifierad enligt Branschrådet Svensk Massage:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><span className="font-medium text-foreground">Klassisk massage 60 min – 650 kr.</span> En hel timmes genomarbetad behandling av hela ryggsidan eller de områden du behöver.</li>
              <li><span className="font-medium text-foreground">Klassisk massage 45 min – 550 kr.</span> Effektiv behandling med fokus på dina mest spända områden, ofta nacke, axlar och rygg.</li>
              <li><span className="font-medium text-foreground">Återhämtningsmassage – 200 kr.</span> Mjuk, återställande behandling till reducerat pris för dig som är arbetslös eller har sjukersättning/sjukpenning.</li>
            </ul>
            <p>Alla behandlingar går att betala med friskvårdsbidrag, och vi tar emot Swish, kort och kontanter.</p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">Därför åker Ljungskileborna till Viriditas</h2>
            <p>
              Andreas Håman är inte vilken massör som helst. Hans synnedsättning har gett honom en ovanligt utvecklad känslighet i händerna – han hittar spänningar och triggerpunkter med en precision som kunder ofta beskriver som något utöver det vanliga. Med bakgrund inom vården möter han dig dessutom med en trygghet och ett lugn som gör att även den som aldrig gått på massage tidigare snabbt känner sig hemma.
            </p>
            <p>
              Tider finns tisdag till lördag, med kvällstider tisdag–torsdag fram till 19:00 och lördagstider för dig som vill kombinera med helgledighet. Du bokar enkelt online och ser direkt vilka tider som är lediga.
            </p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">Även för dig i Munkedal, Lysekil och övriga Bohuslän</h2>
            <p>
              Viriditas tar emot kunder från hela regionen – förutom Ljungskile kommer många från Munkedal, Lysekil, Trollhättan och övriga Bohuslän. Det centrala läget i Uddevalla gör oss lätta att nå oavsett varifrån du kommer.
            </p>
            <p>
              Läs mer om{" "}
              <Link to="/klassisk-massage" className="text-primary font-medium underline-offset-4 hover:underline">klassisk massage i Uddevalla</Link>, om{" "}
              <Link to="/avslappningsmassage-uddevalla" className="text-primary font-medium underline-offset-4 hover:underline">avslappningsmassage</Link> eller hur du kan använda ditt{" "}
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
            <h2 className="text-3xl font-display font-semibold text-foreground">Boka massage – nära Ljungskile</h2>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("ljungskile-bottom")}
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

export default MassageLjungskile;

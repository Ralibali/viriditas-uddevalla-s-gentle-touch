import { treatmentPriceNumber, serializeStructuredData } from "@/lib/siteContentValues";
import { useSiteContent } from "@/hooks/useSiteContent";
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




const MassageLjungskile = () => {
  const { c, g } = useSiteContent("ljungskile");

const faqs = [
  {
    q: c("faq_001", "Hur lång tid tar det från Ljungskile till Viriditas?"),
    a: c("faq_002", "Cirka 15 minuter med bil via E6. Med buss till Uddevalla centrum tar resan något längre, och därifrån är det en kort promenad till Folkets Hus på Göteborgsvägen 11B."),
  },
  {
    q: c("faq_003", "Finns det parkering?"),
    a: c("faq_004", "Ja, det finns goda parkeringsmöjligheter vid och i närheten av Uddevalla Folkets Hus."),
  },
  {
    q: c("faq_005", "Kan jag boka kvällstid efter jobbet?"),
    a: c("faq_006", "Se aktuella tider och behandlingar i bokningen. Där ser du vilka tider som är lediga och kan välja en som passar dig."),
  },
  {
    q: c("faq_007", "Hur bokar jag?"),
    a: c("faq_008", "Du bokar online via vår bokningssida där du ser alla lediga tider direkt. Du kan också mejla info@auroramedia.se för hjälp."),
  },
];
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={c("seo_001", "Massage nära Ljungskile – Viriditas i Uddevalla | Boka online")}
        description={c("seo_002", "Söker du massage i Ljungskile? Viriditas i Uddevalla ligger 15 minuter bort – diplomerad massör, enkel parkering vid Folkets Hus och bokning online. Från 450 kr.")}
        path="/massage-ljungskile"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": c("seo_003", "Massage nära Ljungskile"),
            "serviceType": "Klassisk massage",
            "provider": {
              "@type": "HealthAndBeautyBusiness",
              "@id": "https://viriditasmassage.se/#business",
              "name": g("business_name"),
              "url": "https://viriditasmassage.se",
            },
            "areaServed": [
              { "@type": "City", "name": c("seo_004", "Ljungskile") },
              { "@type": "City", "name": c("seo_005", "Uddevalla") },
              { "@type": "City", "name": c("seo_006", "Munkedal") },
              { "@type": "City", "name": c("seo_007", "Lysekil") },
              { "@type": "AdministrativeArea", "name": c("seo_008", "Bohuslän") },
            ],
            "url": "https://viriditasmassage.se/massage-ljungskile",
            "offers": [
              { "@type": "Offer", "price": treatmentPriceNumber(g("treatment_30_price")), "priceCurrency": "SEK", "name": c("seo_009", "30 min") },
              { "@type": "Offer", "price": treatmentPriceNumber(g("treatment_45_price")), "priceCurrency": "SEK", "name": c("seo_010", "45 min") },
              { "@type": "Offer", "price": treatmentPriceNumber(g("treatment_60_price")), "priceCurrency": "SEK", "name": c("seo_011", "60 min") },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData({
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
          __html: serializeStructuredData({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": c("seo_012", "Hem"), "item": "https://viriditasmassage.se/" },
              { "@type": "ListItem", "position": 2, "name": c("seo_013", "Massage Ljungskile"), "item": "https://viriditasmassage.se/massage-ljungskile" },
            ],
          }),
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
          >{c("text_001", "Massage nära Ljungskile – välkommen till Viriditas i Uddevalla")}</motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-lg text-muted-foreground leading-relaxed font-body"
          >{c("text_002", "Bor du i Ljungskile och letar efter en riktigt bra massör? Viriditas ligger i Uddevalla Folkets Hus, bara en kvarts bilresa från Ljungskile längs E6:an. Många av våra återkommande kunder kommer just från Ljungskile med omnejd – för en behandling som är värd den korta resan.")}</motion.p>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1.5} className="mt-8">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={g("booking_url")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("ljungskile-top")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-body font-medium text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
            >{g("booking_label")}<Calendar className="w-5 h-5" />
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
              <MapPin className="w-7 h-7 text-primary" />{c("text_003", " Lätt att ta sig hit från Ljungskile")}</h2>
            <p>{c("text_004", "Från Ljungskile tar du dig enklast hit via E6 norrut mot Uddevalla – resan tar ungefär 15 minuter med bil. Viriditas finns i Uddevalla Folkets Hus på Göteborgsvägen 11B, centralt i Uddevalla med goda parkeringsmöjligheter i direkt anslutning. Åker du kollektivt går det täta bussförbindelser mellan Ljungskile och Uddevalla centrum, och från Kampenhof är det bara en kort promenad.")}</p>
            <p>{c("text_005", "Tipset från våra Ljungskile-kunder: kombinera massagen med ett ärende i Uddevalla – behandlingen blir startskottet eller avslutningen på en stund i stan.")}</p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">{c("text_006", "Behandlingar och priser")}</h2>
            <p>{c("text_007", "Hos Viriditas får du klassisk massage av Andreas Håman, diplomerad massageterapeut certifierad enligt Branschrådet Svensk Massage:")}</p>
            <ul className="list-disc list-inside space-y-2">
              <li><span className="font-medium text-foreground">{c("text_008", "Klassisk massage 60 min – 720 kr.")}</span>{c("text_009", " En hel timmes genomarbetad behandling av hela ryggsidan eller de områden du behöver.")}</li>
              <li><span className="font-medium text-foreground">{c("text_010", "Klassisk massage 30 min – 450 kr.")}</span>{c("text_011", " Fokuserad massage av rygg, nacke och axlar.")}</li>
              <li><span className="font-medium text-foreground">{c("text_012", "Klassisk massage 45 min – 595 kr.")}</span>{c("text_013", " Effektiv behandling med fokus på dina mest spända områden, ofta nacke, axlar och rygg.")}</li>
              <li><span className="font-medium text-foreground">{c("text_014", "Återhämtningsmassage.")}</span>{c("text_015", " Se aktuella behandlingar, priser och villkor i bokningen.")}</li>
            </ul>
            <p>{c("text_016", "Alla behandlingar går att betala med friskvårdsbidrag, och vi tar emot Swish, kort och kontanter.")}</p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">{c("text_017", "Därför åker Ljungskileborna till Viriditas")}</h2>
            <p>{c("text_018", "Andreas Håman är inte vilken massör som helst. Hans synnedsättning har gett honom en ovanligt utvecklad känslighet i händerna – han hittar spänningar och triggerpunkter med en precision som kunder ofta beskriver som något utöver det vanliga. Med bakgrund inom vården möter han dig dessutom med en trygghet och ett lugn som gör att även den som aldrig gått på massage tidigare snabbt känner sig hemma.")}</p>
            <p>{c("text_019", "Se aktuella tider och behandlingar i bokningen. Du bokar enkelt online och ser vilka tider som är lediga.")}</p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">{c("text_020", "Även för dig i Munkedal, Lysekil och övriga Bohuslän")}</h2>
            <p>{c("text_021", "Viriditas tar emot kunder från hela regionen – förutom Ljungskile kommer många från Munkedal, Lysekil, Trollhättan och övriga Bohuslän. Det centrala läget i Uddevalla gör oss lätta att nå oavsett varifrån du kommer.")}</p>
            <p>{c("text_022", "Läs mer om")}{" "}
              <Link to={c("link_001", "/klassisk-massage")} className="text-primary font-medium underline-offset-4 hover:underline">{c("text_023", "klassisk massage i Uddevalla")}</Link>{c("text_024", ", om")}{" "}
              <Link to={c("link_002", "/avslappningsmassage-uddevalla")} className="text-primary font-medium underline-offset-4 hover:underline">{c("text_025", "avslappningsmassage")}</Link>{c("text_026", " eller hur du kan använda ditt")}{" "}
              <Link to={c("link_003", "/friskvardsbidrag-massage-uddevalla")} className="text-primary font-medium underline-offset-4 hover:underline">{c("text_027", "friskvårdsbidrag")}</Link>.
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mt-12">
            <h2 className="text-3xl font-display font-semibold text-foreground mb-6">{c("text_028", "Vanliga frågor")}</h2>
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
            <h2 className="text-3xl font-display font-semibold text-foreground">{c("text_029", "Boka massage – nära Ljungskile")}</h2>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={g("booking_url")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("ljungskile-bottom")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-body font-medium text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
            >{g("booking_label")}<Calendar className="w-5 h-5" />
            </motion.a>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="mt-12">
            <Link to={c("link_004", "/om-andreas")} className="inline-flex items-center gap-2 text-primary font-body font-medium hover:underline">{c("text_030", "Läs mer om Andreas Håman ")}<ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MassageLjungskile;

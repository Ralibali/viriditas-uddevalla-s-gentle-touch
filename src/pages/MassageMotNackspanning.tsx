import { treatmentPriceNumber, serializeStructuredData } from "@/lib/siteContentValues";
import { useSiteContent } from "@/hooks/useSiteContent";
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




const MassageMotNackspanning = () => {
  const { c, g } = useSiteContent("neck");

const faqs = [
  {
    q: c("faq_001", "Hjälper massage verkligen mot spänningshuvudvärk?"),
    a: c("faq_002", "Ja, för många gör den stor skillnad. Spänningshuvudvärk orsakas ofta av spända muskler i nacke och skuldror, och när massagen löser upp dessa minskar trycket som utlöser värken. Vid frekvent eller ovanlig huvudvärk bör du dock alltid också rådgöra med läkare."),
  },
  {
    q: c("faq_003", "Gör behandlingen ont?"),
    a: c("faq_004", "Den ska inte göra ont. Vissa spända punkter kan kännas ömma när de bearbetas – många beskriver det som \"gott ont\" – men trycket anpassas alltid efter dig. Säg till under behandlingen så justerar Andreas direkt."),
  },
  {
    q: c("faq_005", "Hur många behandlingar behövs?"),
    a: c("faq_006", "Det beror på hur länge besvären funnits. Akuta spänningar kan släppa på en eller två behandlingar, medan spänningar som byggts upp under år ofta behöver en serie på tre till fem behandlingar för varaktig effekt."),
  },
  {
    q: c("faq_007", "Kan jag träna efter massagen?"),
    a: c("faq_008", "Vänta gärna till dagen efter med hård träning. Lätt rörelse som en promenad går utmärkt och hjälper cirkulationen."),
  },
];
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={c("seo_001", "Massage mot nackspänning i Uddevalla | Viriditas – Andreas Håman")}
        description={c("seo_002", "Stel nacke, spända axlar eller spänningshuvudvärk? Massage mot nackspänning i Uddevalla hos diplomerad massör. Folkets Hus, Göteborgsvägen 11B. Boka online.")}
        path="/massage-mot-nackspanning"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": c("seo_003", "Massage mot nackspänning och huvudvärk"),
            "serviceType": "Massage mot nackspänning",
            "provider": {
              "@type": "HealthAndBeautyBusiness",
              "@id": "https://viriditasmassage.se/#business",
              "name": g("business_name"),
              "url": "https://viriditasmassage.se",
            },
            "areaServed": [
              { "@type": "City", "name": c("seo_004", "Uddevalla") },
              { "@type": "AdministrativeArea", "name": c("seo_005", "Bohuslän") },
            ],
            "url": "https://viriditasmassage.se/massage-mot-nackspanning",
            "offers": [
              { "@type": "Offer", "price": treatmentPriceNumber(g("treatment_45_price")), "priceCurrency": "SEK", "name": c("seo_006", "45 min") },
              { "@type": "Offer", "price": treatmentPriceNumber(g("treatment_60_price")), "priceCurrency": "SEK", "name": c("seo_007", "60 min") },
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
              { "@type": "ListItem", "position": 1, "name": c("seo_008", "Hem"), "item": "https://viriditasmassage.se/" },
              { "@type": "ListItem", "position": 2, "name": c("seo_009", "Massage mot nackspänning"), "item": "https://viriditasmassage.se/massage-mot-nackspanning" },
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
          >{c("text_001", "Massage mot nackspänning och spänningshuvudvärk i Uddevalla")}</motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-lg text-muted-foreground leading-relaxed font-body"
          >{c("text_002", "Stel nacke när du vaknar. Axlar som sitter uppe vid öronen efter en dag framför skärmen. Huvudvärk som smyger sig på under eftermiddagen. Känner du igen dig? Du är långt ifrån ensam – nack- och axelspänningar är ett av de absolut vanligaste besvären vi behandlar hos Viriditas i Uddevalla.")}</motion.p>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1.5} className="mt-8">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={g("booking_url")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("nackspanning-top")}
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
            <h2 className="text-3xl font-display font-semibold text-foreground">{c("text_003", "Varför blir man spänd i nacke och axlar?")}</h2>
            <p>{c("text_004", "Nacken bär ditt huvud – cirka fem kilo – hela dagen. När du sitter framåtlutad mot en skärm eller tittar ner i mobilen ökar belastningen kraftigt, och musklerna i nacke, axlar och övre rygg jobbar konstant på övertid. Lägg till stress, som får oss att omedvetet dra upp axlarna, och du har receptet på kroniska spänningar.")}</p>
            <p>{c("text_005", "Med tiden blir musklerna korta, hårda och ömma. Blodcirkulationen i området försämras, vilket gör att slaggprodukter stannar kvar i muskulaturen. Det är ofta då huvudvärken kommer – spänningshuvudvärk uppstår när spända muskler i nacke och skuldror skapar tryck och refererad smärta upp mot huvudet.")}</p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">{c("text_006", "Hur hjälper massage?")}</h2>
            <p>{c("text_007", "Klassisk massage är en av de mest beprövade behandlingarna mot just den här typen av besvär. Genom knådningar, strykningar och riktat tryck:")}</p>
            <ul className="list-disc list-inside space-y-2">
              <li>{c("text_008", "mjukas spända och förkortade muskler upp")}</li>
              <li>{c("text_009", "ökar blodcirkulationen så att muskulaturen får syre och näring")}</li>
              <li>{c("text_010", "minskar trycket på nerver och blodkärl som orsakar huvudvärk")}</li>
              <li>{c("text_011", "återfår nacken sin naturliga rörlighet")}</li>
            </ul>
            <p>{c("text_012", "De flesta känner skillnad redan efter första behandlingen. Vid långvariga besvär brukar en serie behandlingar med en till två veckors mellanrum ge bäst resultat, följt av glesare underhållsbehandlingar.")}</p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">{c("text_013", "Behandling med ovanlig precision")}</h2>
            <p>{c("text_014", "Andreas Håman arbetar med en känslighet utöver det vanliga. Hans synnedsättning har gett honom händer som hittar exakt var spänningen sitter – även de djupa triggerpunkter som du själv inte visste fanns förrän de släpper. Med bakgrund inom vården vet han också när besvär bör utredas vidare av läkare, vilket ger en extra trygghet.")}</p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">{c("text_015", "Sitter du mycket vid skrivbord?")}</h2>
            <p>{c("text_016", "Kontorsarbete är den enskilt vanligaste orsaken till nackspänning. Kombinera gärna regelbunden massage med små vanor i vardagen: res dig varje halvtimme, sänk axlarna medvetet några gånger per dag och placera skärmen i ögonhöjd. Massagen löser upp det som redan satt sig – vanorna förebygger att det kommer tillbaka lika fort.")}</p>
            <p>{c("text_017", "Vill du ha ren återhämtning passar kanske")}{" "}
              <Link to={c("link_001", "/avslappningsmassage-uddevalla")} className="text-primary font-medium underline-offset-4 hover:underline">{c("text_018", "avslappningsmassage i Uddevalla")}</Link>{c("text_019", ", och du kan läsa mer om grundtekniken på sidan om")}{" "}
              <Link to={c("link_002", "/klassisk-massage")} className="text-primary font-medium underline-offset-4 hover:underline">{c("text_020", "klassisk massage")}</Link>.
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mt-12">
            <h2 className="text-3xl font-display font-semibold text-foreground mb-6">{c("text_021", "Vanliga frågor")}</h2>
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
            <h2 className="text-3xl font-display font-semibold text-foreground">{c("text_022", "Boka massage mot nackspänning")}</h2>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={g("booking_url")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("nackspanning-bottom")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-body font-medium text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
            >{g("booking_label")}<Calendar className="w-5 h-5" />
            </motion.a>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="mt-12">
            <Link to={c("link_003", "/om-andreas")} className="inline-flex items-center gap-2 text-primary font-body font-medium hover:underline">{c("text_023", "Läs mer om Andreas Håman ")}<ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MassageMotNackspanning;

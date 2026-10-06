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




const AvslappningsmassageUddevalla = () => {
  const { c, g } = useSiteContent("relaxation");

const faqs = [
  {
    q: c("faq_001", "Hur skiljer sig avslappningsmassage från klassisk massage?"),
    a: c("faq_002", "Avslappningsmassage använder samma grundtekniker som klassisk massage men med mjukare tryck och lugnare tempo. Fokus ligger på helhetsavslappning och stressreduktion snarare än djup bearbetning av enskilda muskler. Hos Viriditas anpassas varje behandling efter dina önskemål."),
  },
  {
    q: c("faq_003", "Hur ofta bör jag gå på avslappningsmassage?"),
    a: c("faq_004", "För att hantera vardagsstress fungerar en behandling per månad bra för de flesta. Under perioder av hög belastning kan tätare besök, exempelvis varannan vecka, ge bättre effekt."),
  },
  {
    q: c("faq_005", "Kan jag använda friskvårdsbidraget?"),
    a: c("faq_006", "Ja. Massage hos diplomerad massör är godkänd friskvård enligt Skatteverket, och du får kvitto som du laddar upp i din arbetsgivares friskvårdsportal."),
  },
  {
    q: c("faq_007", "Vad ska jag tänka på inför besöket?"),
    a: c("faq_008", "Ingenting särskilt – kom som du är. Undvik gärna en stor måltid precis innan, och räkna med att ge dig själv några lugna minuter efter behandlingen i stället för att rusa vidare."),
  },
];
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={c("seo_001", "Avslappningsmassage Uddevalla – Boka hos Viriditas | Från 595 kr")}
        description={c("seo_002", "Avslappningsmassage i Uddevalla hos diplomerad massör Andreas Håman. Minska stress, sov bättre och hitta lugnet. Folkets Hus, Göteborgsvägen 11B. Boka online.")}
        path="/avslappningsmassage-uddevalla"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": c("seo_003", "Avslappningsmassage"),
            "serviceType": "Avslappningsmassage",
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
            "url": "https://viriditasmassage.se/avslappningsmassage-uddevalla",
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
              { "@type": "ListItem", "position": 2, "name": c("seo_009", "Avslappningsmassage Uddevalla"), "item": "https://viriditasmassage.se/avslappningsmassage-uddevalla" },
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
          >{c("text_001", "Avslappningsmassage i Uddevalla")}</motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-lg text-muted-foreground leading-relaxed font-body"
          >{c("text_002", "Känner du dig stressad, spänd eller har svårt att varva ner? Hos Viriditas i centrala Uddevalla får du en avslappningsmassage som är skapad för att lugna nervsystemet, lösa upp ytliga spänningar och ge kroppen den återhämtning den behöver. Behandlingen utförs av Andreas Håman – diplomerad massageterapeut med bakgrund inom vården.")}</motion.p>

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
              href={g("booking_url")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("avslappningsmassage-top")}
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
            <h2 className="text-3xl font-display font-semibold text-foreground">{c("text_003", "Vad är avslappningsmassage?")}</h2>
            <p>{c("text_004", "Avslappningsmassage är en mjukare form av klassisk massage där fokus ligger på långa, lugna strykningar och ett behagligt tryck snarare än djup muskelbearbetning. Syftet är inte i första hand att jobba bort enskilda muskelknutor, utan att sänka kroppens stressnivå som helhet.")}</p>
            <p>{c("text_005", "När kroppen får ro aktiveras det parasympatiska nervsystemet – kroppens \"vila och återhämta\"-läge. Pulsen går ner, andningen blir djupare och musklerna släpper gradvis sina spänningar. Många somnar nästan på bänken, och det är helt okej. Det är faktiskt ett kvitto på att behandlingen gör sitt jobb.")}</p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">{c("text_006", "Så kan avslappningsmassage hjälpa dig")}</h2>
            <p>{c("text_007", "Regelbunden avslappningsmassage kan göra märkbar skillnad om du:")}</p>
            <ul className="list-disc list-inside space-y-2">
              <li>{c("text_008", "har en stressig vardag med jobb, familj och fullbokad kalender")}</li>
              <li>{c("text_009", "sover dåligt eller har svårt att somna")}</li>
              <li>{c("text_010", "känner dig spänd i axlar, nacke eller rygg utan att ha direkt smärta")}</li>
              <li>{c("text_011", "vill förebygga stressrelaterade besvär innan de blir problem")}</li>
              <li>{c("text_012", "helt enkelt behöver en stund som bara är din")}</li>
            </ul>
            <p>{c("text_013", "Massage är en av få stunder i vardagen där du inte förväntas prestera någonting alls. Du ligger på bänken, terapeuten gör jobbet, och kroppen får lov att bara vara.")}</p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">{c("text_014", "En massör som känner mer")}</h2>
            <p>{c("text_015", "Andreas Håman har en synnedsättning – något som skärpt hans övriga sinnen och gett honom en ovanligt utvecklad känslighet i händerna. Han läser av spänningar i din kropp som många andra missar, och anpassar tryck och tempo efter exakt vad du behöver just den dagen. I kombination med hans bakgrund inom vården får du en behandling som är både trygg och genuint lyhörd.")}</p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">{c("text_016", "Praktisk information")}</h2>
            <p>{c("text_017", "Viriditas finns i Uddevalla Folkets Hus på Göteborgsvägen 11B, mitt i centrala Uddevalla med goda parkeringsmöjligheter i närheten. Du bokar enkelt online via vår bokningssida – välj 45 minuter (595 kr) eller 60 minuter (720 kr). Behandlingen är godkänd för friskvårdsbidrag.")}</p>
            <p>{c("text_018", "Läs mer om")}{" "}
              <Link to={c("link_001", "/klassisk-massage")} className="text-primary font-medium underline-offset-4 hover:underline">{c("text_019", "klassisk massage i Uddevalla")}</Link>{c("text_020", ", om")}{" "}
              <Link to={c("link_002", "/massage-mot-nackspanning")} className="text-primary font-medium underline-offset-4 hover:underline">{c("text_021", "massage mot nackspänning")}</Link>{c("text_022", " eller hur du använder ditt")}{" "}
              <Link to={c("link_003", "/friskvardsbidrag-massage-uddevalla")} className="text-primary font-medium underline-offset-4 hover:underline">{c("text_023", "friskvårdsbidrag")}</Link>.
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mt-12">
            <h2 className="text-3xl font-display font-semibold text-foreground mb-6">{c("text_024", "Vanliga frågor")}</h2>
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
            <h2 className="text-3xl font-display font-semibold text-foreground">{c("text_025", "Boka avslappningsmassage i Uddevalla")}</h2>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={g("booking_url")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("avslappningsmassage-bottom")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-body font-medium text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
            >{g("booking_label")}<Calendar className="w-5 h-5" />
            </motion.a>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="mt-12">
            <Link to={c("link_004", "/om-andreas")} className="inline-flex items-center gap-2 text-primary font-body font-medium hover:underline">{c("text_026", "Läs mer om Andreas Håman ")}<ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AvslappningsmassageUddevalla;

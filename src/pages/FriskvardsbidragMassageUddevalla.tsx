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




const FriskvardsbidragMassageUddevalla = () => {
  const { c, g } = useSiteContent("wellness");

const faqs = [
  {
    q: c("faq_001", "Hur mycket är friskvårdsbidraget på?"),
    a: c("faq_002", "Det varierar mellan arbetsgivare, vanligtvis 1 500–5 000 kr per år. Skatteverkets tak för skattefritt friskvårdsbidrag är 5 000 kr per år. Fråga din HR-avdelning vad som gäller hos er."),
  },
  {
    q: c("faq_003", "Funkar Epassi, Benify eller Wellnet hos er?"),
    a: c("faq_004", "Ja. Viriditas är ansluten till Epassi, så du kan betala din friskvårdsmassage direkt via Epassi-appen på plats. Använder du en annan portal som Benify eller Wellnet betalar du som vanligt och laddar upp kvittot för ersättning – det fungerar med samtliga vanliga friskvårdsportaler."),
  },
  {
    q: c("faq_005", "Kan jag köpa flera behandlingar på en gång?"),
    a: c("faq_006", "Ja, du kan boka och betala flera behandlingar och redovisa kvittona mot ditt bidrag, så länge du håller dig inom din arbetsgivares regler och årsbelopp."),
  },
  {
    q: c("faq_007", "Gäller bidraget även återhämtningsmassage?"),
    a: c("faq_008", "Se aktuella behandlingar, priser och villkor i bokningen. Kontakta Andreas om du har frågor om återhämtningsmassage eller betalning."),
  },
];
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={c("seo_001", "Friskvårdsbidrag för massage i Uddevalla | Viriditas")}
        description={c("seo_002", "Använd ditt friskvårdsbidrag för massage i Uddevalla. Klassisk massage hos diplomerad massör är godkänd friskvård enligt Skatteverket. Så funkar det – steg för steg.")}
        path="/friskvardsbidrag-massage-uddevalla"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": c("seo_003", "Massage med friskvårdsbidrag"),
            "serviceType": "Friskvårdsmassage",
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
            "url": "https://viriditasmassage.se/friskvardsbidrag-massage-uddevalla",
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
              { "@type": "ListItem", "position": 2, "name": c("seo_009", "Friskvårdsbidrag massage Uddevalla"), "item": "https://viriditasmassage.se/friskvardsbidrag-massage-uddevalla" },
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
          >{c("text_001", "Använd friskvårdsbidraget för massage i Uddevalla")}</motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-lg text-muted-foreground leading-relaxed font-body"
          >{c("text_002", "Visste du att din massage hos Viriditas kan vara helt eller delvis betald av din arbetsgivare? Klassisk massage hos diplomerad massör är godkänd friskvård enligt Skatteverkets regler – och de flesta arbetsgivare i Sverige erbjuder idag ett friskvårdsbidrag på mellan 1 500 och 5 000 kr per år. Här går vi igenom exakt hur det fungerar.")}</motion.p>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1.5} className="mt-8">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={g("booking_url")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("friskvard-top")}
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
            <h2 className="text-3xl font-display font-semibold text-foreground">{c("text_003", "Är massage godkänt som friskvård?")}</h2>
            <p>{c("text_004", "Ja. Skatteverket klassar massage som en godkänd friskvårdsaktivitet när syftet är att förebygga eller motverka ömhet och stelhet – exempelvis behandling av nacke, axlar och rygg. Det gäller klassisk massage av precis den typ som Viriditas erbjuder. Behandlingen ska vara av enklare slag, vilket vanlig massage hos massör uppfyller.")}</p>
            <p>{c("text_005", "Det innebär att både vår klassiska massage på 45 minuter (595 kr) och 60 minuter (720 kr) går utmärkt att betala med friskvårdsbidraget.")}</p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">{c("text_006", "Så använder du bidraget – steg för steg")}</h2>
            <ol className="list-decimal list-inside space-y-3">
              <li><span className="font-medium text-foreground">{c("text_007", "Kolla ditt bidrag.")}</span>{c("text_008", " Hör med din arbetsgivare eller HR hur stort ditt friskvårdsbidrag är och hur det administreras. De flesta använder en portal som Epassi, Benify, Wellnet eller Söderberg & Partners – andra låter dig lämna in kvitto direkt.")}</li>
              <li><span className="font-medium text-foreground">{c("text_009", "Boka och betala din massage.")}</span>{c("text_010", " Boka online och betala på plats. Är du ansluten till Epassi kan du betala direkt via Epassi-appen – annars går det bra med kort eller Swish.")}</li>
              <li><span className="font-medium text-foreground">{c("text_011", "Spara kvittot.")}</span>{c("text_012", " Du får alltid ett kvitto där behandling, datum och belopp framgår.")}</li>
              <li><span className="font-medium text-foreground">{c("text_013", "Ladda upp eller lämna in.")}</span>{c("text_014", " Registrera kvittot i din friskvårdsportal eller lämna det till din arbetsgivare, så får du ersättningen utbetald.")}</li>
            </ol>
            <p>{c("text_015", "Hela processen tar ett par minuter. Är du osäker på vad som ska stå på kvittot för just din portal – säg till vid besöket så löser vi det.")}</p>

            <div className="not-prose flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-border bg-card p-6 mt-2">
              <div className="flex items-center justify-center rounded-xl bg-white px-6 py-4 shrink-0">
                <img
                  src={c("image_001", "/epassi-logo.svg")}
                  alt={c("text_016", "Epassi – betala din massage med friskvårdsbidrag")}
                  width={140}
                  height={44}
                  loading="lazy"
                  className="h-11 w-auto"
                />
              </div>
              <p className="text-muted-foreground font-body leading-relaxed m-0">{c("text_017", "Viriditas är ansluten till ")}<span className="font-medium text-foreground">{c("text_018", "Epassi")}</span>{c("text_019", " – betala din friskvårdsmassage smidigt direkt via Epassi-appen på plats.")}</p>
            </div>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">{c("text_020", "Smart friskvård som faktiskt gör skillnad")}</h2>
            <p>{c("text_021", "Många låter friskvårdsbidraget brinna inne varje år. Det är synd – regelbunden massage är ett av de mest direkta sätten att använda bidraget på något som kroppen märker av. Spänningar i nacke och rygg byggs upp långsamt, och regelbunden behandling förebygger att de hinner bli till smärta, huvudvärk eller sjukskrivningsdagar.")}</p>
            <p>{c("text_022", "Med ett bidrag på 3 000 kr räcker det till fyra till fem behandlingar per år – ungefär en per kvartal, vilket är en utmärkt grundrytm för de flesta.")}</p>

            <h2 className="text-3xl font-display font-semibold text-foreground pt-4">{c("text_023", "Diplomerad massör – det spelar roll")}</h2>
            <p>{c("text_024", "Hos Viriditas behandlas du av Andreas Håman, diplomerad massageterapeut certifierad enligt Branschrådet Svensk Massage, med bakgrund inom vården. För friskvårdsbidraget är det en trygghet att behandlingen utförs av utbildad och diplomerad massör – och för din kropp är det en ännu större.")}</p>
            <p>{c("text_025", "Läs mer om")}{" "}
              <Link to={c("link_001", "/klassisk-massage")} className="text-primary font-medium underline-offset-4 hover:underline">{c("text_026", "klassisk massage i Uddevalla")}</Link>{c("text_027", " eller om")}{" "}
              <Link to={c("link_002", "/massage-mot-nackspanning")} className="text-primary font-medium underline-offset-4 hover:underline">{c("text_028", "massage mot nackspänning")}</Link>{c("text_029", " om du har besvär från skärmarbete.")}</p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mt-12">
            <h2 className="text-3xl font-display font-semibold text-foreground mb-6">{c("text_030", "Vanliga frågor")}</h2>
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
            <h2 className="text-3xl font-display font-semibold text-foreground">{c("text_031", "Boka massage med friskvårdsbidrag")}</h2>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={g("booking_url")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("friskvard-bottom")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-body font-medium text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
            >{g("booking_label")}<Calendar className="w-5 h-5" />
            </motion.a>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="mt-12">
            <Link to={c("link_003", "/om-andreas")} className="inline-flex items-center gap-2 text-primary font-body font-medium hover:underline">{c("text_032", "Läs mer om Andreas Håman ")}<ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FriskvardsbidragMassageUddevalla;

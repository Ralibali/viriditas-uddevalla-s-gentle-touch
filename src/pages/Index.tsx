import { serializeStructuredData } from "@/lib/siteContentValues";
import { useSiteContent } from "@/hooks/useSiteContent";
import ExternalEmbedGate from '@/components/ExternalEmbedGate';
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Clock, Star, Calendar, ArrowRight, Quote, Leaf, Gift, ExternalLink, Sparkles, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useReviews } from "@/hooks/useReviews";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import andreasPortrait from "@/assets/andreas-portrait.jpeg";
import folketsHus from "@/assets/folkets-hus.jpeg";
import folketsHusEntre from "@/assets/folkets-hus-entre.jpeg";
import salonRoomPainting from "@/assets/salon-room-painting.jpg";
import salonWindowLogo from "@/assets/salon-window-logo.jpg";
import salonTableWindow from "@/assets/salon-table-window.jpg";
import salonWindowsill from "@/assets/salon-windowsill.jpg";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { trackBookingClick, trackContactClick } from "@/lib/trackBookingClick";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SeoHead from "@/components/SeoHead";

const baseFadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const noMotion = {
  hidden: { opacity: 1, y: 0 },
  visible: () => ({ opacity: 1, y: 0 }),
};

const Index = () => {
  const { c, g } = useSiteContent("home");

  const { data: reviews } = useReviews();
  const { data: s } = useSiteSettings();
  const reduceMotion = useReducedMotion();
  const fadeUp = reduceMotion ? noMotion : baseFadeUp;

  // Helper: get setting value or fallback
  const t = c;

  const featuredReviews = reviews?.filter(r => r.review_text) || [];
  const compactReviews = reviews?.filter(r => !r.review_text) || [];

  // Aggregate rating from imported reviews (falls back to local DB average)
  const aggRating = s?.review_rating_value ? parseFloat(s.review_rating_value) : null;
  const aggCount = s?.review_count ? parseInt(s.review_count, 10) : null;
  const localCount = reviews?.length || 0;
  const localAvg = localCount > 0
    ? reviews!.reduce((sum, r) => sum + r.rating, 0) / localCount
    : 0;
  const totalCount = aggCount ?? localCount;
  const avgRating = (aggRating ?? localAvg).toFixed(1);

  return (
    <div className="min-h-screen bg-background pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      <a
        href={c("link_001", "#main-content")}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:font-body focus:font-medium focus:text-primary-foreground focus:shadow-lg"
      >{c("text_001", "Hoppa till innehåll")}</a>
      <SeoHead
        title={c("seo_001", "Massage Uddevalla | Viriditas – Andreas Håman")}
        description={c("seo_002", "Boka klassisk massage i Uddevalla hos Viriditas. Certifierad massör Andreas Håman, Folkets Hus, Göteborgsvägen 11B. Från 450 kr.")}
        path="/"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": c("seo_003", "Hem"),
                "item": "https://viriditasmassage.se/"
              }
            ]
          })
        }}
      />
      {aggRating !== null && aggCount !== null && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeStructuredData({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://viriditasmassage.se/#business",
              "name": c("seo_004", "Viriditas – Andreas Håman"),
              "url": "https://viriditasmassage.se",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": aggRating.toFixed(1),
                "reviewCount": aggCount.toString(),
                "bestRating": "5"
              }
            })
          }}
        />
      )}
      <Navbar />

      <main id="main-content">
      {/* Hero */}
      {c("show_hero", "true") !== "false" && (<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {reduceMotion ? (
          <img
            src={c("image_001", "/video/massage-2-poster.jpg")}
            alt={c("text_002", "")}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={c("image_001", "/video/massage-2-poster.jpg")}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={c("video_001", "/video/massage-2.webm")} type="video/webm" />
            <source src={c("video_002", "/video/massage-2.mp4")} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-5xl md:text-7xl font-display font-semibold text-primary-foreground mb-6 leading-tight"
          >
            {t("hero_title", "Massage i Uddevalla")}
            <span className="block text-3xl md:text-4xl font-normal mt-2 text-primary-foreground/80">
              {t("hero_subtitle", "– hos Uddevallas blinde massör Andreas Håman")}
            </span>
          </motion.h1>


          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={g("booking_url")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("hero")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-body font-medium text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
            >{g("booking_label")}<Calendar className="w-5 h-5" />
            </motion.a>
            <a
              href={c("link_002", "#behandlingar")}
              className="inline-flex items-center gap-2 text-primary-foreground/80 font-body font-medium hover:text-primary-foreground transition-colors"
            >{c("text_005", "Se behandlingar ")}<ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3.5}
            className="text-primary-foreground/60 text-sm font-body mt-4 flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            {t("hero_availability", "Se aktuella tider i bokningen")}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-primary-foreground/60 text-sm mt-12 sm:gap-x-6"
          >
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-primary-foreground fill-primary-foreground" /> {avgRating}{c("text_007", " betyg")}</span>
            <span className="hidden w-1 h-1 bg-primary-foreground/30 rounded-full sm:block" />
            <span>{t("hero_price_from", "Från 450 kr")}</span>
            <span className="hidden w-1 h-1 bg-primary-foreground/30 rounded-full sm:block" />
            <span>{totalCount}{c("text_009", "+ omdömen")}</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <a
            href={c("link_003", "#om")}
            aria-label={c("text_010", "Scrolla till om-sektionen")}
            className="text-primary-foreground/80 animate-bounce block"
          >
            <ArrowRight className="w-6 h-6 rotate-90" />
          </a>
        </motion.div>
      </section>)}

      {/* Om Andreas */}
      {c("show_about", "true") !== "false" && (<section id="om" className="py-28 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <img
              src={c("image_002", andreasPortrait)}
              alt={c("text_011", "Andreas Håman, massageterapeut på Viriditas i Uddevalla")}
              className="rounded-3xl shadow-2xl w-full object-cover object-top aspect-[3/4]"
              loading="lazy"
              decoding="async"
            />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={1}
            className="space-y-6"
          >
             <h2 className="text-3xl md:text-5xl font-display font-semibold text-foreground">
               {t("about_title", "Om Andreas")}
             </h2>
            <div className="w-20 h-1 bg-primary rounded-full" />
            <p className="text-muted-foreground leading-relaxed text-lg">
              {t("about_text_1", "Andreas Håman är diplomerad massageterapeut och certifierad massör enligt Branschrådet Svensk Massage med bakgrund inom vården. Hans unika känslighet – skärpt av en synnedsättning – gör varje behandling mycket uppmärksam och personlig.")}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t("about_text_2", "Tidigare har han arbetat inom personlig assistans, psykiatrin och äldreboende. I massagen har han funnit något som ger samma känsla av kreativitet som konsten en gång gav.")}
            </p>
            <blockquote className="border-l-4 border-primary pl-6 mt-8">
               <p className="text-xl font-body italic text-foreground">
                 "{t("about_quote", "Jag lyssnar med händerna.")}"
               </p>
              <cite className="text-sm text-muted-foreground mt-2 block not-italic">{c("text_016", "– Andreas Håman")}</cite>
            </blockquote>
            <Link
              to={c("link_004", "/om-andreas")}
              className="inline-flex items-center gap-2 text-primary font-body font-medium hover:underline mt-4"
            >{c("text_017", "Läs mer om Andreas ")}<ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>)}

      {/* CTA after Om Andreas */}
      {c("show_cta1", "true") !== "false" && (<section className="py-16 px-6 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="space-y-4"
          >
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-primary-foreground">
              {t("cta1_title", "Redo att boka din massage?")}
            </h2>
            <p className="text-primary-foreground/80 font-body">
              {t("cta1_text", "Boka enkelt online – välj tid som passar dig.")}
            </p>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={g("booking_url")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("cta-after-about")}
              className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-10 py-4 rounded-full font-body font-medium text-lg shadow-lg hover:shadow-xl transition-shadow"
            >{c("text_020", "Boka tid nu ")}<Calendar className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>)}

      {/* Viriditas betydelse */}
      {c("show_viriditas", "true") !== "false" && (<section className="py-28 px-6 bg-card">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="space-y-6 order-2 md:order-1"
          >
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground">
              {t("viriditas_title", "Vad betyder Viriditas?")}
            </h2>
            <div className="w-20 h-1 bg-primary rounded-full" />
            <p className="text-muted-foreground leading-relaxed text-lg">
              {t("viriditas_text_1", "Viriditas är ett ord som betyder vitalitet, fruktsamhet, frodighet och grönska. Det är särskilt förknippat med abbedissan Hildegard von Bingen (1098–1179), mystiker, tonsättare och predikant.")}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t("viriditas_text_2", "Hildegard hade en helhetssyn på människans hälsa där hon tog in kropp, själ och ande.")}
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={1}
            className="order-1 md:order-2"
          >
            {reduceMotion ? (
              <img
                src={c("image_003", "/video/massage-poster.jpg")}
                alt={c("text_002", "")}
                aria-hidden="true"
                className="rounded-3xl shadow-2xl w-full object-cover aspect-square"
              />
            ) : (
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={c("image_003", "/video/massage-poster.jpg")}
                aria-hidden="true"
                className="rounded-3xl shadow-2xl w-full object-cover aspect-square"
              >
                <source src={c("video_003", "/video/massage.mp4")} type="video/mp4" />
              </video>
            )}
          </motion.div>
        </div>
      </section>)}

      {/* SEO-introtext: Massage i Uddevalla */}
      {c("show_intro", "true") !== "false" && (<section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="space-y-6 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground">
              {t("seo_intro_title", "Massage i Uddevalla – närvaro, kvalitet och omtanke")}
            </h2>
            <div className="w-20 h-1 bg-primary rounded-full mx-auto" />
            <p className="text-lg text-muted-foreground leading-relaxed font-body">{c("text_025", "Söker du professionell massage i Uddevalla? Hos Viriditas möts du av en diplomerad massageterapeut och certifierad massör enligt Branschrådet Svensk Massage som tar sig tid att förstå just din kropp – oavsett om du vill släppa nackspänningar, mjuka upp en stel rygg eller bara unna dig en stunds djup avslappning. Läs mer om")}{" "}
              <Link
                to={c("link_005", "/klassisk-massage")}
                className="text-primary font-medium underline-offset-4 hover:underline"
              >{c("text_026", "klassisk massage Uddevalla centrum")}</Link>
              .
            </p>
            <p className="text-base text-muted-foreground leading-relaxed font-body">{c("text_027", "Behandlingarna utgår från klassisk svensk massage och anpassas efter dina behov, från fokuserade 45-minuterspass till en hel timmes lugn återhämtning. Vill du veta mer om terapeuten bakom Viriditas och vår plats för")}{" "}
              <Link
                to={c("link_004", "/om-andreas")}
                className="text-primary font-medium underline-offset-4 hover:underline"
              >{c("text_028", "massage i Bohuslän")}</Link>{c("text_029", "? Det är enkelt att boka tid online – välj en stund som passar dig och kom till en stilla, omsorgsfullt förberedd lokal.")}</p>
          </motion.div>
        </div>
      </section>)}

      {/* Behandlingar */}
      {c("show_treatments", "true") !== "false" && (<section id="behandlingar" className="py-28 px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-display font-semibold text-foreground mb-4"
          >
            {t("treatments_title", "Behandlingar & priser – massage i Uddevalla")}
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="w-20 h-1 bg-primary rounded-full mx-auto"
          />
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            className="text-lg text-muted-foreground leading-relaxed font-body mt-6 max-w-2xl mx-auto"
          >
            {t(
              "treatments_intro",
              "Här hittar du alla behandlingar – från fokuserad klassisk massage till lugn avslappningsmassage. Allt utförs av samma certifierade terapeut, med tid att verkligen lyssna på din kropp."
            )}
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Clock,
              title: t("treatment_30_title", "Klassisk massage"),
              duration: c("text_033", "30 min"),
              price: t("treatment_30_price", "450 kr"),
              desc: t("treatment_30_desc", "Fokuserad behandling av rygg, nacke och axlar för dig med ont om tid."),
              cta: c("text_036", "Boka 30 min"),
            },
            {
              icon: Clock,
              title: t("treatment_45_title", "Klassisk massage"),
              duration: c("text_038", "45 min"),
              price: t("treatment_45_price", "595 kr"),
              desc: t("treatment_45_desc", "En kortare men effektiv behandling fokuserad på dina problemområden."),
              cta: c("text_041", "Boka 45 min"),
            },
            {
              icon: Leaf,
              title: t("treatment_60_title", "Klassisk massage"),
              duration: c("text_043", "60 min"),
              price: t("treatment_60_price", "720 kr"),
              desc: t("treatment_60_desc", "En hel timmes lugn avslappningsmassage som löser upp spänningar i hela kroppen – populärast bland alla våra behandlingar för massage i Uddevalla."),
              cta: c("text_046", "Boka 60 min"),
              featured: true,
            },
            {
              icon: Sparkles,
              title: t("treatment_80_title", "Klassisk massage"),
              duration: c("text_048", "80 min"),
              price: t("treatment_80_price", "998 kr"),
              desc: t("treatment_80_desc", "En omsorgsfull genomgång av hela kroppen för djup avslappning och återhämtning."),
              cta: c("text_051", "Boka 80 min"),
            },
            {
              icon: Sparkles,
              title: t("treatment_recovery_title", "Återhämtningsmassage"),
              duration: c("text_053", ""),
              price: t("treatment_recovery_price", "Se bokningen"),
              desc: t("treatment_recovery_desc", "Se aktuella tider, behandlingar och villkor i bokningen. Kontakta Andreas om du har frågor."),
              cta: g("booking_label"),
            },
            {
              icon: Gift,
              title: t("gift_title", "Presentkort"),
              duration: c("text_053", ""),
              price: t("gift_price", "Valfritt belopp"),
              desc: t("gift_desc", "Ge bort välmående. Perfekt som present till någon du tycker om."),
              cta: c("text_059", "Kontakta oss"),
              isGift: true,
            },
          ].map((service, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -4 }}
              className={`rounded-3xl p-8 border transition-all duration-300 ${
                service.featured
                  ? "bg-primary text-primary-foreground border-primary shadow-2xl shadow-primary/20 scale-[1.02]"
                  : "bg-background border-border shadow-md hover:shadow-xl"
              }`}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 ${
                service.featured ? "bg-primary-foreground/20" : "bg-primary/10"
              }`}>
                <service.icon className={`w-7 h-7 ${service.featured ? "text-primary-foreground" : "text-primary"}`} />
              </div>

              {service.duration && (
                <span className={`text-sm font-body mb-2 block ${
                  service.featured ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}>
                  {service.duration}
                </span>
              )}

              <h3 className={`text-xl font-display font-semibold mb-2 ${
                service.featured ? "text-primary-foreground" : "text-foreground"
              }`}>
                {service.title}
              </h3>

              <p className={`text-3xl font-display font-bold mb-4 ${
                service.featured ? "text-primary-foreground" : "text-foreground"
              }`}>
                {service.price}
              </p>

              <p className={`text-sm leading-relaxed mb-6 ${
                service.featured ? "text-primary-foreground/80" : "text-muted-foreground"
              }`}>
                {service.desc}
              </p>

              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href={service.isGift ? "#kontakt" : g("booking_url")}
                target={service.isGift ? undefined : "_blank"}
                rel={service.isGift ? undefined : "noopener noreferrer"}
                onClick={() => !service.isGift && trackBookingClick(`treatment-${service.duration}`)}
                className={`inline-flex items-center justify-center gap-2 w-full py-3 rounded-full font-body font-medium text-sm transition-colors ${
                  service.featured
                    ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {service.cta} <ArrowRight className="w-4 h-4" />
              </motion.a>
            </motion.div>
          ))}
        </div>
        <div className="max-w-5xl mx-auto text-center mt-10">
          <Link
            to={c("link_005", "/klassisk-massage")}
            className="inline-flex items-center gap-2 text-primary font-body font-medium hover:underline"
          >{c("text_060", "Läs mer om klassisk massage ")}<ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Återhämtningsmassage – framträdande highlight */}
        <div className="max-w-5xl mx-auto mt-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card shadow-xl"
          >
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-2 min-w-0 bg-primary/10 p-6 sm:p-10 flex flex-col justify-center items-start gap-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15">
                  <Sparkles className="w-7 h-7 text-primary" />
                </div>
                <span className="text-sm font-body uppercase tracking-[0.25em] text-primary">
                  {t("recovery_eyebrow", "Tillgänglig massage")}
                </span>
                <p className="text-3xl md:text-4xl font-display font-bold text-foreground leading-none">{c("text_062", "Se bokningen")}</p>
                <span className="text-sm font-body text-muted-foreground">
                  {t("recovery_duration_label", "Aktuella behandlingar och tider")}
                </span>
              </div>

              <div className="md:col-span-3 min-w-0 p-6 sm:p-10 space-y-5">
                <h3 className="break-words text-2xl md:text-3xl font-display font-semibold text-foreground">
                  {t("recovery_section_title", "Återhämtningsmassage – en stund av lugn för fler")}
                </h3>
                <div className="w-16 h-1 bg-primary rounded-full" />
                <p className="text-muted-foreground leading-relaxed font-body">
                  {t(
                    "recovery_section_text_1",
                    "Behandlingen anpassas efter dina önskemål. För aktuell information om återhämtningsmassage, se bokningen."
                  )}
                </p>
                <p className="text-muted-foreground leading-relaxed font-body">
                  {t(
                    "recovery_section_text_2",
                    "Se aktuella tider, behandlingar och priser i bokningen. Kontakta Andreas om du undrar vilka villkor som gäller."
                  )}
                </p>

                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-foreground/80 font-body pt-2">
                  <li className="flex items-start gap-2">
                    <Leaf className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    {t("recovery_bullet_1", "Lugn, avslappnande takt")}
                  </li>
                  <li className="flex items-start gap-2">
                    <Leaf className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    {t("recovery_bullet_2", "Mjukare eller fastare – som du vill")}
                  </li>
                  <li className="flex items-start gap-2">
                    <Leaf className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    {t("recovery_bullet_3", "Skön vid stress och trötthet")}
                  </li>
                  <li className="flex items-start gap-2">
                    <Leaf className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    {t("recovery_bullet_4", "Samma omtanke, samma terapeut")}
                  </li>
                </ul>

                <div className="pt-2">
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    href={g("booking_url")}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackBookingClick("recovery-highlight")}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-body font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
                  >
                    {t("recovery_cta", "Boka återhämtningsmassage")} <Calendar className="w-4 h-4" />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Social proof – Återhämtning, lugn, stress */}
          {(() => {
            const recoveryReviews = (reviews || []).filter(
              (r) =>
                r.review_text &&
                /stress|lugn|avslapp|återhämt|avkopp|sl[äa]ppa|tyst|värme/i.test(r.review_text)
            ).slice(0, 3);
            if (recoveryReviews.length === 0) return null;
            return (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                className="mt-16"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
                    {t("recovery_social_title", "Andras upplevelser av lugn & återhämtning")}
                  </h3>
                  <div className="w-16 h-1 bg-primary rounded-full mx-auto mt-3" />
                  <p className="text-muted-foreground font-body mt-4 max-w-2xl mx-auto">
                    {t(
                      "recovery_social_intro",
                      "Röster från gäster som sökt en stund av stillhet – ord om stress som släpper, värme som sprider sig och kropp och själ som hinner ifatt."
                    )}
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {recoveryReviews.map((r, i) => (
                    <motion.div
                      key={r.id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeUp}
                      custom={i}
                      className="relative bg-card rounded-3xl p-8 border border-primary/15 shadow-md hover:shadow-lg transition-shadow flex flex-col"
                    >
                      <div className="absolute -top-4 left-8 inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/15 border border-primary/20">
                        <Leaf className="w-5 h-5 text-primary" />
                      </div>
                      <Quote className="w-8 h-8 text-primary/15 absolute top-6 right-6" />
                      <div className="flex gap-0.5 mb-4 mt-2">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className={`w-4 h-4 ${
                              j < r.rating ? "text-amber-500 fill-amber-500" : "text-border"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-foreground/90 text-sm leading-relaxed italic font-body flex-1">
                        "{r.review_text}"
                      </p>
                      <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-6">
                        <span className="text-foreground font-medium text-sm">{r.reviewer_name}</span>
                        <span className="text-muted-foreground/60 text-xs">{r.review_date}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    href={g("booking_url")}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackBookingClick("recovery-social-proof")}
                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-body font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
                  >
                    {t("recovery_social_cta", "Unna dig en stund av lugn")} <Calendar className="w-4 h-4" />
                  </motion.a>
                </div>
              </motion.div>
            );
          })()}

          {/* FAQ – Återhämtningsmassage */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="mt-16"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
                {t("recovery_faq_title", "Vanliga frågor om återhämtningsmassagen")}
              </h3>
              <div className="w-16 h-1 bg-primary rounded-full mx-auto mt-3" />
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {[
                {
                  q: t("recovery_faq_q1", "Vilka priser och villkor gäller?"),
                  a: t(
                    "recovery_faq_a1",
                    "Se aktuella behandlingar, priser och villkor i bokningen. Kontakta Andreas om du har frågor om återhämtningsmassage."
                  ),
                },
                {
                  q: t("recovery_faq_q2", "Hur bokar jag?"),
                  a: t(
                    "recovery_faq_a2",
                    "Öppna bokningssidan för att se aktuella behandlingar och lediga tider."
                  ),
                },
                {
                  q: t("recovery_faq_q3", "Vilka tider finns?"),
                  a: t(
                    "recovery_faq_a3",
                    "Lediga tider visas i bokningen. Kontakta Andreas om du inte hittar den behandling eller tid du söker."
                  ),
                },
                {
                  q: t("recovery_faq_q4", "Hur lång är behandlingen?"),
                  a: t(
                    "recovery_faq_a4",
                    "Längden framgår för varje behandling i bokningen. Välj den behandling som passar dig eller kontakta Andreas om du är osäker."
                  ),
                },
              ].map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`recovery-faq-${i}`}
                  className="bg-background rounded-2xl border border-border px-6"
                >
                  <AccordionTrigger className="text-left font-display text-foreground hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed font-body">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>)}

      {/* Friskvård / Epassi */}
      {c("show_wellness", "true") !== "false" && (<section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="rounded-3xl border border-primary/20 bg-card shadow-xl overflow-hidden"
          >
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-2 bg-primary/10 p-10 flex flex-col justify-center items-start gap-5">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15">
                  <Gift className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground">{c("text_075", "Betala med friskvårdsbidrag")}</h2>
                <div className="flex items-center justify-center rounded-xl bg-white px-6 py-4">
                  <img
                    src={c("image_004", "/epassi-logo.svg")}
                    alt={c("text_076", "Epassi – betala din massage med friskvårdsbidrag")}
                    width={140}
                    height={44}
                    loading="lazy"
                    className="h-10 w-auto"
                  />
                </div>
              </div>
              <div className="md:col-span-3 p-10 flex flex-col justify-center gap-5">
                <p className="text-lg text-muted-foreground leading-relaxed font-body">{c("text_077", "Viriditas är ansluten till ")}<span className="font-medium text-foreground">{c("text_078", "Epassi")}</span>{c("text_079", " – betala din friskvårdsmassage smidigt direkt via Epassi-appen på plats. Använder du en annan portal som Benify eller Wellnet går det också bra; du betalar som vanligt och laddar upp kvittot för ersättning.")}</p>
                <Link
                  to={c("link_006", "/friskvardsbidrag-massage-uddevalla")}
                  className="inline-flex items-center gap-2 text-primary font-body font-medium hover:underline"
                >{c("text_080", "Läs mer om friskvårdsbidrag ")}<ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>)}



      {/* Omdömen */}
      {c("show_reviews", "true") !== "false" && (<section className="py-28 px-6 bg-[#f4f0eb]">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-display font-semibold text-foreground mb-4"
          >{c("text_081", "Vad kunderna säger")}</motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="w-20 h-1 bg-primary rounded-full mx-auto mb-6"
          />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            className="flex items-center justify-center gap-3 text-foreground"
          >
            <span className="text-4xl font-display font-bold">{avgRating}</span>
            <div className="flex flex-col items-start">
              <span className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.round(Number(avgRating)) ? "text-amber-500 fill-amber-500" : "text-border"}`} />
                ))}
              </span>
              <span className="text-muted-foreground text-sm">{totalCount}{c("text_082", " omdömen")}</span>
            </div>
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {featuredReviews.slice(0, 6).map((review, i) => (
            <motion.div
              key={review.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="bg-background rounded-3xl p-8 border border-border relative shadow-sm hover:shadow-md transition-shadow"
            >
              <Quote className="w-10 h-10 text-primary/10 absolute top-6 right-6" />
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className={`w-4 h-4 ${j < review.rating ? "text-amber-500 fill-amber-500" : "text-border"}`} />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
                "{review.review_text}"
              </p>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-foreground font-medium text-sm">{review.reviewer_name}</span>
                <span className="text-muted-foreground/60 text-xs">{review.review_date}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {compactReviews.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={3}
            className="max-w-5xl mx-auto mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {compactReviews.map((r) => (
              <div key={r.id} className="bg-background rounded-2xl p-4 border border-border text-center shadow-sm">
                <div className="flex justify-center gap-0.5 mb-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-3 h-3 ${j < r.rating ? "text-amber-500 fill-amber-500" : "text-border"}`} />
                  ))}
                </div>
                <p className="text-foreground text-xs font-medium">{r.reviewer_name}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* CTA after reviews */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={4}
          className="max-w-2xl mx-auto text-center mt-16"
        >
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            href={g("booking_url")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackBookingClick("cta-after-reviews")}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-body font-medium text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
          >{c("text_083", "Boka din massage idag ")}<Calendar className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </section>)}

      {/* Hitta hit / Kontakt */}
      {c("show_contact", "true") !== "false" && (<section id="kontakt" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
           className="text-3xl md:text-5xl font-display font-semibold text-foreground mb-4"
          >
            {t("contact_title", "Boka massage Uddevalla – Hitta hit")}
            </motion.h2>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="w-20 h-1 bg-primary rounded-full mx-auto"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="space-y-8"
            >
              <div className="bg-card rounded-3xl p-8 border border-border shadow-sm space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-2xl flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-1">{c("text_085", "Adress")}</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{t("contact_address_full", "Uddevalla Folkets Hus\nGöteborgsvägen 11B, Uddevalla")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-2xl flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-1">{c("text_087", "Öppettider")}</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{t("contact_hours_display", "Se aktuella tider och behandlingar i bokningen.")}</p>
                    <a
                      href={g("booking_url")}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackBookingClick("contact-hours-schedule-link")}
                      className="inline-flex items-center gap-1.5 text-primary font-body font-medium text-sm hover:underline mt-2"
                    >{c("text_089", "Se alla lediga tider ")}<ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-2xl flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-1">{c("text_090", "E-post")}</h3>
                    <a
                      href={`mailto:${g("email")}`}
                      onClick={() => trackContactClick("kontakt-email")}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >{g("email")}</a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  href={g("maps_url")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackContactClick("kontakt-maps")}
                  className="inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground px-6 py-3 rounded-full font-body font-medium shadow-sm hover:shadow-md transition-shadow"
                >
                  <ExternalLink className="w-4 h-4" />{c("text_091", " Öppna i Google Maps")}</motion.a>
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  href={g("booking_url")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackBookingClick("kontakt")}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-body font-medium shadow-lg shadow-primary/20"
                >
                  <Calendar className="w-4 h-4" />{c("text_092", " Boka din behandling")}</motion.a>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-3xl overflow-hidden shadow-lg aspect-[4/5]">
                  <img
                    src={c("image_005", folketsHus)}
                    alt={c("text_093", "Uddevalla Folkets Hus – fasad med entré")}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-lg aspect-[4/5]">
                  <img
                    src={c("image_006", folketsHusEntre)}
                    alt={c("text_094", "Entrén till Uddevalla Folkets Hus, Göteborgsvägen 11B")}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-lg">
                <ExternalEmbedGate service="Google Maps"><iframe
                  title={c("text_095", "Karta till Viriditas – Uddevalla Folkets Hus")}
                  src={g("map_embed_url")}
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                /></ExternalEmbedGate>
              </div>
            </motion.div>
          </div>
        </div>
      </section>)}

      {/* Inne i salongen */}
      {c("show_gallery", "true") !== "false" && (<section className="py-28 px-6 bg-card">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="text-center mb-14 max-w-2xl mx-auto space-y-4"
          >
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-foreground">{c("text_096", "Inne i salongen")}</h2>
            <div className="w-20 h-1 bg-primary rounded-full mx-auto" />
            <p className="text-lg text-muted-foreground leading-relaxed font-body">{c("text_097", "En lugn och omsorgsfullt förberedd plats i Uddevalla Folkets Hus – med dagsljus, mjuka filtar och små detaljer som får dig att landa direkt.")}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="md:row-span-2 rounded-3xl overflow-hidden shadow-lg"
            >
              <img
                src={c("image_007", salonRoomPainting)}
                alt={c("text_098", "Behandlingsrum hos Viriditas i Uddevalla med massagebänk, mjuka handdukar och tavla av grön skog")}
                loading="lazy"
                className="w-full h-full object-cover aspect-[3/4] md:aspect-auto"
              />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="rounded-3xl overflow-hidden shadow-lg"
            >
              <img
                src={c("image_008", salonTableWindow)}
                alt={c("text_099", "Massagebänk vid fönstret med dagsljus i Viriditas behandlingsrum")}
                loading="lazy"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="rounded-3xl overflow-hidden shadow-lg"
            >
              <img
                src={c("image_009", salonWindowsill)}
                alt={c("text_100", "Fönsterbräda med saltkristallampa, ängel och växter i Viriditas salong")}
                loading="lazy"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={3}
              className="md:col-span-2 rounded-3xl overflow-hidden shadow-lg"
            >
              <img
                src={c("image_010", salonWindowLogo)}
                alt={c("text_101", "Viriditas massage – logotyp i fönstret på salongen i Uddevalla")}
                loading="lazy"
                className="w-full h-full object-cover aspect-[16/9]"
              />
            </motion.div>
          </div>
        </div>
      </section>)}

      {/* FAQ */}
      {c("show_faq", "true") !== "false" && (<section className="py-28 px-6 bg-card">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-foreground mb-4">{c("text_102", "Vanliga frågor")}</h2>
            <div className="w-20 h-1 bg-primary rounded-full mx-auto" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {[
                { q: c("faq_010", "Vad kostar massage hos Viriditas i Uddevalla?"), a: c("faq_011", "Klassisk massage kostar 450 kr för 30 minuter, 595 kr för 45 minuter, 720 kr för 60 minuter och 998 kr för 80 minuter. Du bokar enkelt online.") },
                { q: c("faq_012", "Var ligger Viriditas i Uddevalla?"), a: c("faq_013", "Viriditas finns i Uddevalla Folkets Hus, Göteborgsvägen 11B.") },
                { q: c("faq_014", "Hur bokar jag tid för massage?"), a: c("faq_015", "Du bokar snabbt och enkelt online via vår bokningssida. Klicka på \"Boka tid\" här på sidan.") },
                { q: c("faq_016", "Vad är klassisk massage?"), a: c("faq_017", "Klassisk massage är den vanligaste massageformen i Sverige. Den löser upp spänningar, ökar blodcirkulationen och ger djup avkoppling för hela kroppen.") },
                { q: c("faq_018", "Vem är massageterapeuten på Viriditas?"), a: c("faq_019", "Andreas Håman är diplomerad massageterapeut och certifierad massör enligt Branschrådet Svensk Massage med bakgrund inom vården. Tack vare sin synnedsättning har han utvecklat en unik känslighet i sina händer, vilket gör hans behandlingar extra uppmärksamma och precisa.") },
              ].map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-background rounded-2xl border border-border px-6">
                  <AccordionTrigger className="text-left font-display text-foreground hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>)}

      {/* Final CTA before footer */}
      {c("show_cta2", "true") !== "false" && (<section className="py-20 px-6 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="space-y-4"
          >
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-primary-foreground">
              {t("cta2_title", "Ge kroppen den omvårdnad den förtjänar")}
            </h2>
            <p className="text-primary-foreground/80 font-body">
              {t("cta2_text", "Klassisk massage från 450 kr. Boka din tid idag.")}
            </p>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={g("booking_url")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("cta-before-footer")}
              className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-10 py-4 rounded-full font-body font-medium text-lg shadow-lg hover:shadow-xl transition-shadow"
            >{g("booking_label")}<Calendar className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>)}
      </main>

      <Footer />

      {/* Mobil sticky CTA */}
      <div
        className="md:hidden fixed inset-x-0 bottom-0 z-50 p-4 pointer-events-none"
        style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
      >
        <a
          href={g("booking_url")}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackBookingClick("sticky-mobile")}
          className="pointer-events-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-full font-body font-medium text-lg shadow-lg shadow-primary/30"
        >{g("booking_label")}<Calendar className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};

export default Index;

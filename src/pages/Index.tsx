import { motion } from "framer-motion";
import { MapPin, Clock, Star, Heart, Calendar, ArrowRight, Quote, HelpCircle, Leaf, Gift, Phone, Mail, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useReviews } from "@/hooks/useReviews";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import andreasGoliat from "@/assets/andreas-goliat.jpeg";
import halsokraft from "@/assets/halsokraft.jpeg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { trackBookingClick } from "@/lib/trackBookingClick";
import Navbar from "@/components/Navbar";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const Index = () => {
  const { data: reviews } = useReviews();
  const { data: s } = useSiteSettings();

  // Helper: get setting value or fallback
  const t = (key: string, fallback: string) => s?.[key] || fallback;

  const featuredReviews = reviews?.filter(r => r.review_text) || [];
  const compactReviews = reviews?.filter(r => !r.review_text) || [];
  const totalCount = reviews?.length || 0;
  const avgRating = totalCount > 0
    ? (reviews!.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Hem",
                "item": "https://viriditasmassage.se/"
              }
            ]
          })
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/massage-2-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video/massage-2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <Leaf className="w-5 h-5 text-primary-foreground/70" />
            <span className="text-primary-foreground/70 tracking-[0.3em] uppercase text-sm font-body">Viriditas</span>
            <Leaf className="w-5 h-5 text-primary-foreground/70" />
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-5xl md:text-7xl font-display font-semibold text-primary-foreground mb-6 leading-tight"
          >
            {t("hero_title", "Massage i Uddevalla")}
            <span className="block text-3xl md:text-4xl font-normal mt-2 text-primary-foreground/80">
              {t("hero_subtitle", "– Känn skillnaden med Viriditas")}
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-primary-foreground/70 text-lg md:text-xl font-body italic mb-8 max-w-xl mx-auto"
          >
            {t("hero_description", "Diplomerad massageterapeut Andreas Håman – Hälsokraft, Norra Drottninggatan 2")}
          </motion.p>

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
              href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("hero")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-body font-medium text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
            >
              Boka tid <Calendar className="w-5 h-5" />
            </motion.a>
            <a
              href="#behandlingar"
              className="inline-flex items-center gap-2 text-primary-foreground/80 font-body font-medium hover:text-primary-foreground transition-colors"
            >
              Se behandlingar <ArrowRight className="w-4 h-4" />
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
            {t("hero_availability", "Tider tillgängliga fredagar & lördagar")}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="flex items-center justify-center gap-6 text-primary-foreground/60 text-sm mt-12"
          >
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-primary-foreground fill-primary-foreground" /> {avgRating} betyg
            </span>
            <span className="w-1 h-1 bg-primary-foreground/30 rounded-full" />
            <span>{t("hero_price_from", "Från 550 kr")}</span>
            <span className="w-1 h-1 bg-primary-foreground/30 rounded-full" />
            <span>{totalCount}+ omdömen</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <a href="#om" className="text-primary-foreground/50 animate-bounce block">
            <ArrowRight className="w-6 h-6 rotate-90" />
          </a>
        </motion.div>
      </section>

      {/* Om Andreas */}
      <section id="om" className="py-28 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <img
              src={andreasGoliat}
              alt="Andreas Håman, massageterapeut på Viriditas i Uddevalla, med ledarhunden Goliat"
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
               {t("about_title", "Om Andreas & Goliat")}
             </h2>
            <div className="w-20 h-1 bg-primary rounded-full" />
            <p className="text-muted-foreground leading-relaxed text-lg">
              {t("about_text_1", "Andreas Håman är diplomerad massageterapeut med bakgrund inom vården. Hans unika känslighet – skärpt av en synnedsättning – gör varje behandling mycket uppmärksam och personlig.")}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t("about_text_2", "Tidigare har han arbetat inom personlig assistans, psykiatrin och äldreboende. I massagen har han funnit något som ger samma känsla av kreativitet som konsten en gång gav.")}
            </p>
            <p className="text-muted-foreground leading-relaxed flex items-start gap-2">
              <Heart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
               <span>
                 {t("about_text_goliat", "Min bästa vän och ledarhund Goliat hjälper mig i vardagen och är också med i behandlingsrummet – en lugn och trygg närvaro.")}
               </span>
            </p>
            <blockquote className="border-l-4 border-primary pl-6 mt-8">
               <p className="text-xl font-body italic text-foreground">
                 "{t("about_quote", "Jag lyssnar med händerna.")}"
               </p>
              <cite className="text-sm text-muted-foreground mt-2 block not-italic">– Andreas Håman</cite>
            </blockquote>
            <Link
              to="/om-andreas"
              className="inline-flex items-center gap-2 text-primary font-body font-medium hover:underline mt-4"
            >
              Läs mer om Andreas <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA after Om Andreas */}
      <section className="py-16 px-6 bg-primary">
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
              href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("cta-after-about")}
              className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-10 py-4 rounded-full font-body font-medium text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              Boka tid nu <Calendar className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Viriditas betydelse */}
      <section className="py-28 px-6 bg-card">
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
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              className="rounded-3xl shadow-2xl w-full object-cover aspect-square"
            >
              <source src="/video/massage.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </div>
      </section>

      {/* Behandlingar */}
      <section id="behandlingar" className="py-28 px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-display font-semibold text-foreground mb-4"
          >
            {t("treatments_title", "Klassisk massage – Behandlingar & priser")}
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

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Clock,
              title: t("treatment_45_title", "Klassisk massage"),
              duration: "45 min",
              price: t("treatment_45_price", "550 kr"),
              desc: t("treatment_45_desc", "En kortare men effektiv behandling fokuserad på dina problemområden."),
              cta: "Boka 45 min",
            },
            {
              icon: Leaf,
              title: t("treatment_60_title", "Klassisk massage"),
              duration: "60 min",
              price: t("treatment_60_price", "650 kr"),
              desc: t("treatment_60_desc", "En hel timmes avkopplande behandling som löser upp spänningar i hela kroppen."),
              cta: "Boka 60 min",
              featured: true,
            },
            {
              icon: Gift,
              title: t("gift_title", "Presentkort"),
              duration: "",
              price: t("gift_price", "Valfritt belopp"),
              desc: t("gift_desc", "Ge bort välmående. Perfekt som present till någon du tycker om."),
              cta: "Kontakta oss",
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
                href={service.isGift ? "#kontakt" : "https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"}
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
            to="/klassisk-massage"
            className="inline-flex items-center gap-2 text-primary font-body font-medium hover:underline"
          >
            Läs mer om klassisk massage <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Omdömen */}
      <section className="py-28 px-6 bg-[#f4f0eb]">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-display font-semibold text-foreground mb-4"
          >
            Vad kunderna säger
          </motion.h2>
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
              <span className="text-muted-foreground text-sm">{totalCount} omdömen</span>
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
            href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackBookingClick("cta-after-reviews")}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-body font-medium text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
          >
            Boka din massage idag <Calendar className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </section>

      {/* Hitta hit / Kontakt */}
      <section id="kontakt" className="py-28 px-6">
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
                    <h3 className="font-display font-semibold text-foreground mb-1">Adress</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{t("contact_address_full", "Hälsokraft, Norra Drottninggatan 2\n451 30 Uddevalla")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-2xl flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-1">Öppettider</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{t("contact_hours_display", "Mån–Fre: 09:00–18:00\nLör: 10:00–15:00")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-2xl flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-1">Telefon</h3>
                    <p className="text-muted-foreground">{t("phone", "076-317 78 97")}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://maps.google.com/?q=Norra+Drottninggatan+2+Uddevalla"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground px-6 py-3 rounded-full font-body font-medium shadow-sm hover:shadow-md transition-shadow"
                >
                  <ExternalLink className="w-4 h-4" /> Öppna i Google Maps
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackBookingClick("kontakt")}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-body font-medium shadow-lg shadow-primary/20"
                >
                  <Calendar className="w-4 h-4" /> Boka din behandling
                </motion.a>
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
              <img
                src={halsokraft}
                alt="Hälsokraft butiken på Norra Drottninggatan 2 i Uddevalla – här finns Viriditas massage"
                className="w-full rounded-3xl shadow-lg object-cover max-h-[280px]"
                loading="lazy"
              />
              <div className="rounded-3xl overflow-hidden shadow-lg">
                <iframe
                  title="Karta till Hälsokraft Uddevalla"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2117.5!2d11.9338!3d58.3495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTjCsDIwJzU4LjIiTiAxMcKwNTYnMDEuNyJF!5e0!3m2!1ssv!2sse!4v1"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28 px-6 bg-card">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-foreground mb-4">
              Vanliga frågor
            </h2>
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
                { q: "Vad kostar massage hos Viriditas i Uddevalla?", a: "Klassisk massage 60 minuter kostar 650 kr och 45 minuter kostar 550 kr. Du bokar enkelt online." },
                { q: "Var ligger Viriditas i Uddevalla?", a: "Viriditas finns på Hälsokraft, Norra Drottninggatan 2 i centrala Uddevalla." },
                { q: "Hur bokar jag tid för massage?", a: 'Du bokar snabbt och enkelt online via vår bokningssida. Klicka på "Boka tid" här på sidan.' },
                { q: "Vad är klassisk massage?", a: "Klassisk massage är den vanligaste massageformen i Sverige. Den löser upp spänningar, ökar blodcirkulationen och ger djup avkoppling för hela kroppen." },
                { q: "Vem är massageterapeuten på Viriditas?", a: "Andreas Håman är diplomerad massageterapeut med bakgrund inom vården. Tack vare sin synnedsättning har han utvecklat en unik känslighet i sina händer, vilket gör hans behandlingar extra uppmärksamma och precisa." },
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
      </section>

      {/* Final CTA before footer */}
      <section className="py-20 px-6 bg-primary">
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
              {t("cta2_text", "Klassisk massage från 550 kr. Boka din tid idag.")}
            </p>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("cta-before-footer")}
              className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-10 py-4 rounded-full font-body font-medium text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              Boka tid <Calendar className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border bg-foreground text-primary-foreground">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <h3 className="font-display text-2xl font-semibold mb-4">Viriditas</h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">
                {t("footer_text", "Klassisk massage i Uddevalla. Diplomerad massageterapeut med passion för välmående.")}
              </p>
            </div>

            {/* Snabblänkar */}
            <div>
              <h4 className="font-display font-semibold mb-4">Snabblänkar</h4>
              <div className="space-y-2">
                <Link to="/om-andreas" className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">Om Andreas</Link>
                <Link to="/klassisk-massage" className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">Klassisk massage</Link>
                <a href="#behandlingar" className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">Behandlingar</a>
                <a href="#kontakt" className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">Hitta hit</a>
                <a href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule" target="_blank" rel="noopener noreferrer" className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">Boka online</a>
              </div>
            </div>

            {/* Kontakt */}
            <div>
              <h4 className="font-display font-semibold mb-4">Kontakt</h4>
              <div className="space-y-3 text-sm text-primary-foreground/70">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {t("address", "Norra Drottninggatan 2, Uddevalla")}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> {t("phone", "076-317 78 97")}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-8 text-center">
            <p className="text-primary-foreground/50 text-sm">
              &copy; {new Date().getFullYear()} Viriditas – Andreas Håman. Alla rättigheter förbehållna.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

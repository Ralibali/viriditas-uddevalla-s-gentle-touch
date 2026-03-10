import { motion } from "framer-motion";
import { MapPin, Clock, Star, Heart, Calendar, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import treatmentRoom from "@/assets/treatment-room.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <img
          src={heroBg}
          alt="Naturliga stenar och eukalyptus"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="text-primary-foreground/70 tracking-[0.3em] uppercase text-sm mb-4 font-body"
          >
            Massage &amp; Välmående i Uddevalla
          </motion.p>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-5xl md:text-7xl font-display font-semibold text-primary-foreground mb-6 leading-tight"
          >
            Viriditas
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-primary-foreground/80 text-lg md:text-xl font-body mb-4"
          >
            Uddevallas blinde massör
          </motion.p>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="flex items-center justify-center gap-6 text-primary-foreground/60 text-sm mb-10"
          >
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-current" /> 4.8 betyg
            </span>
            <span>30+ behandlingar</span>
          </motion.div>
          <motion.a
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-body font-medium text-lg hover:opacity-90 transition-opacity"
          >
            Boka tid <Calendar className="w-5 h-5" />
          </motion.a>
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

      {/* Om */}
      <section id="om" className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <img
              src={treatmentRoom}
              alt="Behandlingsrum med ledarhunden Goliat"
              className="rounded-2xl shadow-lg w-full object-cover aspect-square"
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
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground">
              Om Andreas &amp; Goliat
            </h2>
            <div className="w-16 h-0.5 bg-primary rounded-full" />
            <p className="text-muted-foreground leading-relaxed">
              Jag heter Andreas Håman, är 51 år och bor i Uddevalla. Jag studerar på Åsa folkhögskola och är diplomerad massageterapeut med pågående studier mot certifiering. Tidigare har jag arbetat inom vården – personlig assistans, psykiatrin och äldreboende.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              På grund av en ögonsjukdom är jag i det närmaste blind. Jag har tidigare målat och har i massagen funnit något som ger mig en liknande känsla av kreativitet.
            </p>
            <p className="text-muted-foreground leading-relaxed flex items-start gap-2">
              <Heart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <span>
                Min bästa vän och ledarhund <strong className="text-foreground">Goliat</strong> hjälper mig i vardagen och är också med i behandlingsrummet – en lugn och trygg närvaro.
              </span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tjänster */}
      <section className="py-24 px-6 bg-card">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-4"
          >
            Behandlingar
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="w-16 h-0.5 bg-primary rounded-full mx-auto"
          />
        </div>

        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            { title: "Klassisk massage", duration: "60 min", desc: "En hel timmes avkopplande behandling som löser upp spänningar i hela kroppen." },
            { title: "Klassisk massage", duration: "45 min", desc: "En kortare men effektiv behandling fokuserad på dina problemområden." },
          ].map((service, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="bg-background rounded-2xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 text-primary mb-4">
                <Clock className="w-5 h-5" />
                <span className="font-body font-medium">{service.duration}</span>
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {service.desc}
              </p>
              <a
                href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:underline"
              >
                Boka denna behandling <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Plats & Kontakt */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-4"
          >
            Hitta hit
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="w-16 h-0.5 bg-primary rounded-full mx-auto mb-8"
          />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            className="inline-flex items-center gap-2 text-muted-foreground text-lg mb-12"
          >
            <MapPin className="w-5 h-5 text-primary" />
            Hälsokraft, Norra Drottninggatan 2, Uddevalla
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={3}
            className="rounded-2xl overflow-hidden shadow-lg mb-12"
          >
            <iframe
              title="Karta till Hälsokraft Uddevalla"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2117.5!2d11.9338!3d58.3495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTjCsDIwJzU4LjIiTiAxMcKwNTYnMDEuNyJF!5e0!3m2!1ssv!2sse!4v1"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

          <motion.a
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={4}
            href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-body font-medium text-lg hover:opacity-90 transition-opacity"
          >
            Boka din behandling <Calendar className="w-5 h-5" />
          </motion.a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border bg-card">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <p className="font-display text-lg text-foreground">Viriditas</p>
          <p className="text-muted-foreground text-sm">
            Diplomerad massageterapeut &middot; Uddevalla
          </p>
          <p className="text-muted-foreground/60 text-xs mt-4">
            &copy; {new Date().getFullYear()} Viriditas. Alla rättigheter förbehållna.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

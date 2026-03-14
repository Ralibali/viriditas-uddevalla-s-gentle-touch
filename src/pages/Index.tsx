import { motion } from "framer-motion";
import { MapPin, Clock, Star, Heart, Calendar, ArrowRight, Quote, HelpCircle } from "lucide-react";
import heroBg from "@/assets/skog.jpg";
import treatmentRoom from "@/assets/massage-1.jpeg";
import massage2 from "@/assets/massage-2.jpeg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video/massage-2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
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
            Massage i Uddevalla
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-primary-foreground/80 text-lg md:text-xl font-body mb-2"
          >
            Viriditas
          </motion.p>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2.5}
            className="text-primary-foreground/60 text-base font-body mb-4"
          >
            Klassisk massage &middot; Från 550 kr &middot; Boka online
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
              alt="Klassisk massage i Uddevalla – Andreas Håman med ledarhunden Goliat i behandlingsrummet"
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

      {/* Viriditas betydelse */}
      <section className="py-24 px-6 bg-card">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="space-y-6 order-2 md:order-1"
          >
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground">
              Vad betyder Viriditas?
            </h2>
            <div className="w-16 h-0.5 bg-primary rounded-full" />
            <p className="text-muted-foreground leading-relaxed">
              Viriditas är ett ord som betyder vitalitet, fruktsamhet, frodighet och grönska. Det är särskilt förknippat med abbedissan Hildegard von Bingen (1098–1179), mystiker, tonsättare och predikant.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Hildegard hade en helhetssyn på människans hälsa där hon tog in kropp, själ och ande.
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
              className="rounded-2xl shadow-lg w-full object-cover aspect-square"
            >
              <source src="/video/massage.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </div>
      </section>

      {/* Tjänster */}
      <section className="py-24 px-6">
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
            { title: "Klassisk massage", duration: "60 min", price: "650 kr", desc: "En hel timmes avkopplande behandling som löser upp spänningar i hela kroppen." },
            { title: "Klassisk massage", duration: "45 min", price: "550 kr", desc: "En kortare men effektiv behandling fokuserad på dina problemområden." },
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-primary">
                  <Clock className="w-5 h-5" />
                  <span className="font-body font-medium">{service.duration}</span>
                </div>
                <span className="text-xl font-display font-bold text-foreground">{service.price}</span>
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

      {/* Omdömen */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-4"
          >
            Vad kunderna säger
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="w-16 h-0.5 bg-primary rounded-full mx-auto mb-4"
          />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            className="flex items-center justify-center gap-2 text-foreground"
          >
            <span className="text-3xl font-display font-bold">4.8</span>
            <span className="text-muted-foreground">av 5</span>
            <span className="flex ml-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < 5 ? "text-primary fill-primary" : "text-border"}`} />
              ))}
            </span>
            <span className="text-muted-foreground ml-2">(11 omdömen)</span>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Tone Faye",
              rating: 5,
              date: "19 feb.",
              text: "Jag önskade ryggmassage, skuldrorna har krånglat. Lokalen var avskild och tyst trots att den ligger innanför en butik. Mjuk naturnära musik och ljus, värmen och hunden i hörnet bidrog till avslappning och att kunna släppa taget. Nystart för ryggen och själen. Som att unna sig en resa till värmen mitt i kylan.",
            },
            {
              name: "Charlotte Lundqvist",
              rating: 5,
              date: "2 feb.",
              text: "Bara positiv upplevelse! Kommer tillbaka!",
            },
            {
              name: "Fredrica Myrehag",
              rating: 5,
              date: "26 jan.",
              text: "Nöjd och ett väl bemött!",
            },
          ].map((review, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="bg-card rounded-2xl p-6 border border-border relative"
            >
              <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className={`w-4 h-4 ${j < review.rating ? "text-primary fill-primary" : "text-border"}`} />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic">
                "{review.text}"
              </p>
              <div className="flex items-center justify-between">
                <span className="text-foreground font-medium text-sm">{review.name}</span>
                <span className="text-muted-foreground/60 text-xs">{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={3}
          className="max-w-4xl mx-auto mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { name: "Anders Brattgård", rating: 4, date: "8 mars" },
            { name: "Anne Holmlund", rating: 5, date: "22 feb." },
            { name: "Åsa Karlsson", rating: 5, date: "21 feb." },
            { name: "Catarina Platek", rating: 4, date: "15 feb." },
            { name: "Eva Jantzen", rating: 5, date: "31 jan." },
            { name: "Ellen Beran", rating: 5, date: "24 jan." },
            { name: "Camilla Edwartz", rating: 5, date: "17 jan." },
            { name: "Minde Passby", rating: 5, date: "10 jan." },
          ].map((r, i) => (
            <div key={i} className="bg-card rounded-xl p-4 border border-border text-center">
              <div className="flex justify-center gap-0.5 mb-1">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className={`w-3 h-3 ${j < r.rating ? "text-primary fill-primary" : "text-border"}`} />
                ))}
              </div>
              <p className="text-foreground text-xs font-medium">{r.name}</p>
            </div>
          ))}
        </motion.div>
      </section>


      <section className="relative py-24 px-6 overflow-hidden">
        <img
          src={heroBg}
          alt="Grön skogsväg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/85" />
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

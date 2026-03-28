import { useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
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

const KlassiskMassage = () => {
  useEffect(() => {
    document.title = "Klassisk Massage Uddevalla – 550 kr | Viriditas";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "Klassisk massage i Uddevalla från 550 kr. Diplomerad massageterapeut på Hälsokraft, Norra Drottninggatan 2. Boka online enkelt via peach.nu.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-8 leading-tight"
          >
            Klassisk Massage i Uddevalla – Vad är det och vad kostar det?
          </motion.h1>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="space-y-6 text-lg text-muted-foreground leading-relaxed font-body"
          >
            <p>
              Klassisk massage är Sveriges vanligaste massageform och en av de mest välbeforskade behandlingsmetoderna för stress, muskelspänningar och återhämtning.
            </p>
            <p>
              Hos Viriditas i Uddevalla erbjuder vi klassisk massage i två längder:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground font-medium">
              <li>45 minuter – 550 kr</li>
              <li>60 minuter – 650 kr</li>
            </ul>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-12 space-y-6"
          >
            <h2 className="text-3xl font-display font-semibold text-foreground">
              Vad händer under en klassisk massage?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-body">
              Behandlingen fokuserar på att lösa upp spänningar i muskler och bindväv, öka blodcirkulationen och ge djup avkoppling. Massageterapeut Andreas Håman anpassar varje behandling efter dig och dina behov.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="mt-12 space-y-6"
          >
            <h2 className="text-3xl font-display font-semibold text-foreground flex items-center gap-3">
              <MapPin className="w-7 h-7 text-primary" /> Var ligger vi?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-body">
              Viriditas finns på Hälsokraft, Norra Drottninggatan 2 i Uddevalla. Enkel parkering och centralt läge.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="mt-12 space-y-6"
          >
            <h2 className="text-3xl font-display font-semibold text-foreground">
              Boka massage i Uddevalla
            </h2>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("klassisk-massage")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-body font-medium text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
            >
              Boka tid <Calendar className="w-5 h-5" />
            </motion.a>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={5}
            className="mt-12"
          >
            <Link
              to="/om-andreas"
              className="inline-flex items-center gap-2 text-primary font-body font-medium hover:underline"
            >
              Läs mer om Andreas Håman <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border bg-foreground text-primary-foreground">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="font-display text-2xl font-semibold mb-4">Viriditas</h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">
                Klassisk massage i Uddevalla. Diplomerad massageterapeut med passion för välmående.
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-4">Snabblänkar</h4>
              <div className="space-y-2">
                <Link to="/" className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">Hem</Link>
                <Link to="/om-andreas" className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">Om Andreas</Link>
                <Link to="/klassisk-massage" className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">Klassisk massage</Link>
                <a href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule" target="_blank" rel="noopener noreferrer" className="block text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">Boka online</a>
              </div>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-4">Kontakt</h4>
              <div className="space-y-3 text-sm text-primary-foreground/70">
                <p>Norra Drottninggatan 2, Uddevalla</p>
                <p>076-317 78 97</p>
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

export default KlassiskMassage;

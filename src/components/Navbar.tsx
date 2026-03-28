import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { trackBookingClick } from "@/lib/trackBookingClick";

const navLinks = [
  { label: "Hem", href: "#" },
  { label: "Behandlingar", href: "#behandlingar" },
  { label: "Om Andreas", href: "#om" },
  { label: "Kontakt", href: "#kontakt" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-background/80 border-b border-border/40 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-display text-2xl font-semibold text-foreground">
          Viriditas
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackBookingClick("navbar")}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-body font-medium hover:bg-primary/90 transition-colors"
          >
            Boka tid
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-foreground p-2"
          aria-label="Meny"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden backdrop-blur-md bg-background/95 border-b border-border/40 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-body text-foreground py-2"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackBookingClick("navbar-mobile");
                  setIsOpen(false);
                }}
                className="bg-primary text-primary-foreground px-5 py-3 rounded-full text-center font-body font-medium"
              >
                Boka tid
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

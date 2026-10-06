import { useSitePages } from "@/hooks/useSitePages";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { trackBookingClick } from "@/lib/trackBookingClick";



interface NavbarProps {
  alwaysSolid?: boolean;
}

const Navbar = ({ alwaysSolid = false }: NavbarProps) => {
  const { c, g } = useSiteContent("navigation");
  const { data: pages } = useSitePages();
  const articleLinks = (pages || []).filter(page => page.is_published && page.show_in_nav).map(page => ({ label: page.nav_label || page.title, href: `/p/${page.slug}`, isRoute: true }));

  const navLinks = [
  { label: c("text_001", "Hem"), href: c("link_001", "/"), isRoute: true },
  { label: c("text_002", "Behandlingar"), href: c("link_002", "/#behandlingar") },
  { label: c("text_003", "Om Andreas"), href: c("link_003", "/om-andreas"), isRoute: true },
  { label: c("text_004", "Klassisk massage"), href: c("link_004", "/klassisk-massage"), isRoute: true },
  { label: c("text_005", "Kontakt"), href: c("link_005", "/#kontakt") },
];
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 50);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const solid = alwaysSolid || scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid
          ? "backdrop-blur-md bg-background/80 border-b border-border/40 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to={c("link_001", "/")}
          className={`max-w-[70%] truncate font-display font-semibold text-xl tracking-tight transition-colors lg:max-w-44 duration-300 ${
            solid ? "text-foreground" : "text-white"
          }`}
          aria-label={c("text_006", "Viriditas Massage – till startsidan")}
        >{g("business_name")}</Link>

        {/* Desktop */}
        <div className="hidden lg:flex shrink-0 items-center gap-4 xl:gap-6">
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-body transition-colors duration-300 ${
                  solid
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-body transition-colors duration-300 ${
                  solid
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            )
          )}
          {articleLinks.length > 0 && <details className="relative">
            <summary className={`cursor-pointer text-sm font-body ${solid ? "text-muted-foreground" : "text-white/80"}`}>{c("articles_label", "Kunskapsbank")}</summary>
            <div className="absolute right-0 top-full mt-3 max-h-[calc(100dvh-6rem)] w-64 max-w-[calc(100vw-3rem)] overflow-y-auto overscroll-contain rounded-xl border border-border bg-background p-3 shadow-lg">
              {articleLinks.map(link => <Link key={link.href} to={link.href} className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted">{link.label}</Link>)}
            </div>
          </details>}
          <a
            href={g("booking_url")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackBookingClick("navbar")}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-body font-medium hover:bg-primary/90 transition-colors"
          >{g("booking_label")}</a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`lg:hidden p-2 transition-colors duration-300 ${
            solid ? "text-foreground" : "text-white"
          }`}
          aria-label={c("text_007", "Meny")}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
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
            id="mobile-navigation"
            className="lg:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain backdrop-blur-md bg-background/95 border-b border-border/40"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {[...navLinks, ...articleLinks].map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="break-words text-base font-body text-foreground py-2"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="break-words text-base font-body text-foreground py-2"
                  >
                    {link.label}
                  </a>
                )
              )}
              <a
                href={g("booking_url")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackBookingClick("navbar-mobile");
                  setIsOpen(false);
                }}
                className="bg-primary text-primary-foreground px-5 py-3 rounded-full text-center font-body font-medium"
              >{g("booking_label")}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

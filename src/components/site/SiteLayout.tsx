import { useEffect, useState, type ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BookingLink from "./BookingLink";

interface SiteLayoutProps {
  children: ReactNode;
  /** Show the booking bar at the bottom of the screen on phones once the visitor scrolls. */
  stickyBooking?: string | false;
}

export default function SiteLayout({ children, stickyBooking = false }: SiteLayoutProps) {
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    if (!stickyBooking) return;
    const onScroll = () => setShowBar(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [stickyBooking]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:font-semibold focus:text-primary-foreground"
      >
        Hoppa till innehållet
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
      {stickyBooking && (
        <div
          className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-[transform,visibility] duration-300 ease-calm md:hidden ${
            showBar ? "visible translate-y-0" : "invisible translate-y-full"
          }`}
        >
          <BookingLink source={stickyBooking} className="btn btn-primary btn-lg w-full" />
        </div>
      )}
    </div>
  );
}

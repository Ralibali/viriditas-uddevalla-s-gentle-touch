import { useEffect, useId, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { navigationContent } from "@/content/navigation";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useSitePages } from "@/hooks/useSitePages";
import BookingLink from "./BookingLink";
import SmartLink from "./SmartLink";
import { BrailleMark } from "./BrailleMark";

export default function Navbar() {
  const { c, g } = useSiteContent(navigationContent);
  const { data: pages } = useSitePages();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const hasArticles = (pages ?? []).length > 0;
  const primary = [
    { label: c("text_002"), to: c("link_002") },
    { label: c("text_003"), to: c("link_003") },
    { label: c("text_008"), to: c("link_006") },
    ...(hasArticles ? [{ label: c("articles_label"), to: "/kunskapsbank" }] : []),
    { label: c("text_005"), to: c("link_005") },
  ].filter((item) => item.label && item.to);
  const mobile = [{ label: c("text_001"), to: c("link_001") }, ...primary.slice(0, 2), { label: c("text_004"), to: c("link_004") }, ...primary.slice(2)].filter(
    (item) => item.label && item.to,
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A new page closes the menu.
  useEffect(() => setOpen(false), [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled || open ? "border-b border-line bg-paper/95 backdrop-blur-md" : "border-b border-transparent bg-paper/0"
      }`}
    >
      <nav aria-label="Huvudmeny" className="page-gutter flex h-[4.5rem] items-center justify-between gap-6">
        <SmartLink to="/" className="group flex items-center gap-3 rounded-md text-ink">
          <BrailleMark />
          <span className="font-display text-[1.6rem] leading-none soft-type" style={{ fontWeight: 450 }}>
            {g("business_name")}
          </span>
          <span className="sr-only">{c("text_006")}</span>
        </SmartLink>

        <div className="hidden items-center gap-7 lg:flex">
          <ul className="flex items-center gap-6">
            {primary.map((item) => (
              <li key={item.to}>
                <SmartLink to={item.to} className="text-[0.98rem] font-semibold text-ink/80 transition-colors hover:text-ink">
                  {item.label}
                </SmartLink>
              </li>
            ))}
          </ul>
          <BookingLink source="navbar" className="btn btn-primary" />
        </div>

        <button
          ref={buttonRef}
          type="button"
          className="flex min-h-11 items-center gap-2 rounded-full border border-ink/25 px-4 font-semibold text-ink lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true" className="relative block h-3 w-4">
            <span className={`absolute left-0 h-0.5 w-4 bg-current transition-transform duration-200 ${open ? "top-[5px] rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 top-[5px] h-0.5 w-4 bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 h-0.5 w-4 bg-current transition-transform duration-200 ${open ? "top-[5px] -rotate-45" : "top-[10px]"}`} />
          </span>
          {open ? "Stäng" : c("text_007")}
        </button>
      </nav>

      <div
        id={menuId}
        ref={panelRef}
        hidden={!open}
        className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line bg-paper lg:hidden"
      >
        <ul className="page-gutter py-4">
          {mobile.map((item) => (
            <li key={item.to} className="border-b border-line/70 last:border-0">
              <SmartLink to={item.to} onClick={() => setOpen(false)} className="flex min-h-14 items-center font-display text-[1.375rem] text-ink soft-type">
                {item.label}
              </SmartLink>
            </li>
          ))}
        </ul>
        <div className="page-gutter pb-6">
          <BookingLink source="navbar-mobile" className="btn btn-primary btn-lg w-full" />
        </div>
      </div>
    </header>
  );
}

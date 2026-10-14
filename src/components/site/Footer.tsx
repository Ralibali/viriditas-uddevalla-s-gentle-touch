import { footerContent } from "@/content/footer";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useSitePages } from "@/hooks/useSitePages";
import { trackContactClick } from "@/lib/trackBookingClick";
import { openCookieSettings } from "@/lib/privacyConsent";
import Braille from "./Braille";
import BookingLink from "./BookingLink";
import SmartLink from "./SmartLink";

export default function Footer() {
  const { c, g } = useSiteContent(footerContent);
  const { data: pages } = useSitePages();
  // Pages the owner lifts forward come first; the list is otherwise in the editor's order.
  const articles = [...(pages ?? [])].sort((a, b) => Number(b.show_in_nav) - Number(a.show_in_nav) || a.nav_order - b.nav_order).slice(0, 6);
  const phone = g("phone");

  const quickLinks = [
    [c("text_003"), c("link_001")],
    [c("text_004"), c("link_002")],
    [c("text_005"), c("link_003")],
    [c("text_006"), c("link_004")],
    [c("text_007"), c("link_005")],
    [c("text_008"), c("link_006")],
    [c("text_009"), c("link_007")],
  ].filter(([label, to]) => label && to);

  return (
    <footer className="bg-ink text-paper">
      <div className="page-gutter grid gap-12 pb-12 pt-16 md:grid-cols-12 md:gap-10 md:pt-20">
        <div className="md:col-span-4">
          <p className="font-display text-[2.5rem] leading-none text-paper soft-type" style={{ fontWeight: 400 }}>
            {g("business_name")}
          </p>
          <p className="mt-5 max-w-sm text-paper/75">{c("text_001")}</p>
          <div className="mt-8 flex items-center gap-4">
            <Braille word="viriditas" size="1.05rem" onDark />
            <span className="text-sm text-paper/60">{c("text_017")}</span>
          </div>
        </div>

        <nav aria-labelledby="footer-quick" className="md:col-span-3">
          <h2 id="footer-quick" className="font-body text-sm font-bold text-paper">
            {c("text_002")}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map(([label, to]) => (
              <li key={to}>
                <SmartLink to={to} className="text-paper/75 transition-colors hover:text-paper">
                  {label}
                </SmartLink>
              </li>
            ))}
            <li>
              <BookingLink source="footer" className="text-paper/75 transition-colors hover:text-paper">
                {c("text_010")}
              </BookingLink>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-articles" className="md:col-span-2">
          <h2 id="footer-articles" className="font-body text-sm font-bold text-paper">
            {c("text_011")}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {articles.length === 0 && <li className="text-paper/60">{c("text_012")}</li>}
            {articles.map((page) => (
              <li key={page.id}>
                <SmartLink to={`/p/${page.slug}`} className="text-paper/75 transition-colors hover:text-paper">
                  {page.nav_label || page.title}
                </SmartLink>
              </li>
            ))}
            {articles.length > 0 && (
              <li>
                <SmartLink to="/kunskapsbank" className="text-paper underline decoration-paper/40 underline-offset-4 hover:decoration-paper">
                  {c("text_018")}
                </SmartLink>
              </li>
            )}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="font-body text-sm font-bold text-paper">{c("text_013")}</h2>
          <address className="mt-4 space-y-2.5 not-italic text-paper/75">
            <p>{c("text_014")}</p>
            <p>
              <a href={`mailto:${g("email")}`} onClick={() => void trackContactClick("footer-email")} className="break-words transition-colors hover:text-paper">
                {g("email")}
              </a>
            </p>
            {phone && (
              <p>
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="transition-colors hover:text-paper">
                  {phone}
                </a>
              </p>
            )}
          </address>
        </div>
      </div>

      <div className="border-t border-paper/15">
        <div className="page-gutter flex flex-col gap-3 py-6 text-sm text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {c("text_016")}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <SmartLink to={c("link_008")} className="transition-colors hover:text-paper">
              {c("text_015")}
            </SmartLink>
            <button type="button" onClick={openCookieSettings} className="text-left transition-colors hover:text-paper">
              {c("text_019")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

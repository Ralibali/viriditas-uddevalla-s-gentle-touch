import type { SiteContentRoute } from "@/lib/siteContentValues";
import { homeContent } from "./home";
import { aboutContent } from "./about";
import { classicContent } from "./classic";
import { relaxationContent } from "./relaxation";
import { neckContent } from "./neck";
import { wellnessContent } from "./wellness";
import { ljungskileContent } from "./ljungskile";
import { articlesContent } from "./articles";
import { privacyContent } from "./privacy";
import { navigationContent } from "./navigation";
import { footerContent } from "./footer";

/** Every editable page, in the order the administration lists them. */
export const SITE_CONTENT_ROUTES: SiteContentRoute[] = [
  homeContent,
  aboutContent,
  classicContent,
  relaxationContent,
  neckContent,
  wellnessContent,
  ljungskileContent,
  articlesContent,
  privacyContent,
  navigationContent,
  footerContent,
];

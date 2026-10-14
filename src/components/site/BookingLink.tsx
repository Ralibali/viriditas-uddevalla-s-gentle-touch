import type { ReactNode } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { getGlobalContentValue } from "@/lib/siteContentValues";
import { trackBookingClick } from "@/lib/trackBookingClick";

interface BookingLinkProps {
  /** Where on the site the click happened, shown in the click statistics. */
  source: string;
  children?: ReactNode;
  className?: string;
  treatmentCategory?: string;
  /** Accessible name when the visible text alone is ambiguous, e.g. "Boka 30 min". */
  ariaLabel?: string;
}

/** Link to the external booking page. Opens a new tab and says so to screen readers. */
export default function BookingLink({ source, children, className = "btn btn-primary", treatmentCategory, ariaLabel }: BookingLinkProps) {
  const { data: settings } = useSiteSettings();
  const url = getGlobalContentValue("booking_url", settings);
  const label = children ?? getGlobalContentValue("booking_label", settings);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel ? `${ariaLabel} (öppnas i ny flik)` : undefined}
      onClick={() => void trackBookingClick(source, treatmentCategory)}
    >
      {label}
      {!ariaLabel && <span className="sr-only"> (öppnas i ny flik)</span>}
    </a>
  );
}

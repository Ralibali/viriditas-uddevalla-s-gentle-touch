import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface SmartLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/** Internal paths navigate inside the app; anything else is an ordinary link that opens in a new tab. */
export default function SmartLink({ to, children, className, onClick }: SmartLinkProps) {
  if (to.startsWith("/") && !to.startsWith("//")) {
    return (
      <Link to={to} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  if (to.startsWith("#") || to.startsWith("mailto:") || to.startsWith("tel:")) {
    return (
      <a href={to} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <a href={to} className={className} onClick={onClick} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> (öppnas i ny flik)</span>
    </a>
  );
}

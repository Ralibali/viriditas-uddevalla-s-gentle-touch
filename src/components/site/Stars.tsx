/** Five stars with the given rating filled. Decorative: callers write the rating out in text. */
export default function Stars({ rating, size = "1rem", className = "" }: { rating: number; size?: string; className?: string }) {
  const filled = Math.round(Math.max(0, Math.min(5, rating)));
  return (
    <span aria-hidden="true" className={`inline-flex gap-[0.15em] ${className}`} style={{ fontSize: size }}>
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} viewBox="0 0 20 20" width="1em" height="1em" className={index < filled ? "text-amber" : "text-line"}>
          <path
            fill="currentColor"
            d="M10 1.6l2.47 5.2 5.7.68-4.2 3.9 1.1 5.63L10 14.23 4.93 17l1.1-5.63-4.2-3.9 5.7-.68L10 1.6z"
          />
        </svg>
      ))}
    </span>
  );
}

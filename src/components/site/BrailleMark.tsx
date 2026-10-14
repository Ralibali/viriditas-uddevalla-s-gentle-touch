import { brailleDots } from "./Braille";

/** The brand mark: the braille letter v (dots 1, 2, 3 and 6), the same as the favicon. */
export function BrailleMark({ onDark = false, className = "" }: { onDark?: boolean; className?: string }) {
  return (
    <span aria-hidden="true" className={`grid grid-cols-2 gap-[3px] ${className}`}>
      {brailleDots("v").map((raised, index) => (
        <span
          key={index}
          className={`h-[7px] w-[7px] rounded-full ${raised ? (onDark ? "bg-sprout" : "bg-primary") : onDark ? "bg-sprout/20" : "bg-primary/20"}`}
        />
      ))}
    </span>
  );
}

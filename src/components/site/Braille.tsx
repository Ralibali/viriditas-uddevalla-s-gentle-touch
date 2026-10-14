import type { CSSProperties } from "react";

/** Swedish braille letters as Unicode braille patterns (dots 1–6). */
const LETTERS: Record<string, string> = {
  a: "⠁", b: "⠃", c: "⠉", d: "⠙", e: "⠑", f: "⠋", g: "⠛", h: "⠓", i: "⠊", j: "⠚",
  k: "⠅", l: "⠇", m: "⠍", n: "⠝", o: "⠕", p: "⠏", q: "⠟", r: "⠗", s: "⠎", t: "⠞",
  u: "⠥", v: "⠧", w: "⠺", x: "⠭", y: "⠽", z: "⠵", å: "⠡", ä: "⠜", ö: "⠪",
};

/** Grid position of dots 1–6: dots 1–3 run down the left column, 4–6 down the right. */
const DOT_ORDER = [1, 4, 2, 5, 3, 6] as const;

/** Which of the six dots are raised for a letter, in reading order of the 2×3 grid. */
export function brailleDots(letter: string): boolean[] {
  const pattern = LETTERS[letter.toLowerCase()];
  if (!pattern) return [false, false, false, false, false, false];
  const bits = pattern.codePointAt(0)! - 0x2800;
  return DOT_ORDER.map((dot) => (bits & (1 << (dot - 1))) !== 0);
}

export function toBraille(word: string): string {
  return [...word.toLowerCase()].map((letter) => LETTERS[letter] ?? " ").join("");
}

interface BrailleProps {
  word: string;
  /** Size of the dots relative to the surrounding text. */
  size?: string;
  /** Press the dots in, one after another, when the page loads. */
  animated?: boolean;
  onDark?: boolean;
  className?: string;
}

/**
 * A word set in raised braille dots. Purely decorative: the word is always
 * written out in text nearby, so assistive technology skips it.
 */
export default function Braille({ word, size = "1rem", animated = false, onDark = false, className = "" }: BrailleProps) {
  let index = 0;
  return (
    <span
      aria-hidden="true"
      className={`braille ${animated ? "braille-press" : ""} ${onDark ? "braille-on-dark" : ""} ${className}`}
      style={{ "--braille-size": size } as CSSProperties}
    >
      {[...word].map((letter, cell) => (
        <span key={cell} className="braille-cell">
          {brailleDots(letter).map((raised, dot) => (
            <span
              key={dot}
              className={raised ? "braille-dot" : "braille-empty"}
              style={raised ? ({ "--dot-index": index++ } as CSSProperties) : undefined}
            />
          ))}
        </span>
      ))}
    </span>
  );
}

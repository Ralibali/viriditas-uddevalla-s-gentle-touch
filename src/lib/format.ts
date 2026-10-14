/** 4.8 → "4,8", the Swedish way. */
export const formatRating = (value: number) => value.toLocaleString("sv-SE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** "Från 450 kr" → a large "450 kr" with "Från" as its label. Other wording is shown as written. */
export function splitPriceFact(text: string): { value: string; label: string } {
  const match = /^(.*?)\s*(\d[\d\s]*(?:[.,]\d+)?\s*(?:kr|SEK))\s*$/i.exec(text.trim());
  return match ? { value: match[2], label: match[1] } : { value: text, label: "" };
}

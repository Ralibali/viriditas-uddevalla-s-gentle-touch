/** 4.8 → "4,8", the Swedish way. */
export const formatRating = (value: number) => value.toLocaleString("sv-SE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

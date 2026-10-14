export type ContentFieldKind = "text" | "longtext" | "link" | "image" | "video" | "toggle";
export interface SiteContentField {
  key: string;
  settingKey: string;
  label: string;
  defaultValue: string;
  kind: ContentFieldKind;
  group: string;
}
export interface SiteContentRoute {
  id: string;
  label: string;
  path: string;
  fields: SiteContentField[];
}

export const TREATMENT_MINUTES = [30, 45, 60, 80] as const;
const DEFAULT_PRICES: Record<(typeof TREATMENT_MINUTES)[number], string> = { 30: "450 kr", 45: "595 kr", 60: "720 kr", 80: "998 kr" };

/** Shared settings used across the whole site. Public content is plain text or a validated URL; never HTML or code. */
export const GLOBAL_CONTENT_FIELDS: SiteContentField[] = [
  { key: "business_name", settingKey: "business_name", label: "Företagsnamn", defaultValue: "Viriditas", kind: "text", group: "Verksamhet och kontakt" },
  { key: "owner_name", settingKey: "owner_name", label: "Ansvarig / massör", defaultValue: "Andreas Håman", kind: "text", group: "Verksamhet och kontakt" },
  { key: "email", settingKey: "email", label: "E-postadress", defaultValue: "info@auroramedia.se", kind: "text", group: "Verksamhet och kontakt" },
  { key: "phone", settingKey: "phone", label: "Telefonnummer (lämna tomt för att inte visa något)", defaultValue: "", kind: "text", group: "Verksamhet och kontakt" },
  { key: "address", settingKey: "address", label: "Besöksadress", defaultValue: "Uddevalla Folkets Hus, Göteborgsvägen 11B", kind: "text", group: "Verksamhet och kontakt" },
  { key: "postal_code", settingKey: "postal_code", label: "Postnummer (för Google)", defaultValue: "", kind: "text", group: "Verksamhet och kontakt" },
  { key: "city", settingKey: "city", label: "Ort (för Google)", defaultValue: "Uddevalla", kind: "text", group: "Verksamhet och kontakt" },
  { key: "opening_hours", settingKey: "opening_hours", label: "Öppettider", defaultValue: "Se aktuella tider i bokningen", kind: "longtext", group: "Verksamhet och kontakt" },
  { key: "footer_text", settingKey: "footer_text", label: "Beskrivning i sidfoten", defaultValue: "Klassisk massage i Uddevalla. Diplomerad massageterapeut och certifierad massör enligt Branschrådet Svensk Massage med passion för välmående.", kind: "longtext", group: "Verksamhet och kontakt" },
  { key: "booking_url", settingKey: "booking_url", label: "Bokningsadress (används på hela webbplatsen)", defaultValue: "https://www.bokadirekt.se/places/viriditas-massage-136924", kind: "link", group: "Bokning och karta" },
  { key: "booking_label", settingKey: "booking_label", label: "Text på bokningsknappar", defaultValue: "Boka tid", kind: "text", group: "Bokning och karta" },
  { key: "google_review_url", settingKey: "google_review_url", label: "Länk för att lämna omdöme på Google (lämna tomt för att dölja)", defaultValue: "", kind: "link", group: "Bokning och karta" },
  { key: "maps_url", settingKey: "maps_url", label: "Länk till karta (tomt fält använder besöksadressen)", defaultValue: "", kind: "link", group: "Bokning och karta" },
  { key: "map_embed_url", settingKey: "map_embed_url", label: "Inbäddad Google Maps-karta (tomt fält använder besöksadressen)", defaultValue: "", kind: "link", group: "Bokning och karta" },
  { key: "og_image", settingKey: "og_image", label: "Bild när webbplatsen delas", defaultValue: "https://viriditasmassage.se/og-image.jpg", kind: "image", group: "Bilder och film" },
  ...TREATMENT_MINUTES.map((minutes) => ({
    key: `treatment_${minutes}_price`,
    settingKey: `treatment_${minutes}_price`,
    label: `Klassisk massage ${minutes} minuter – pris`,
    defaultValue: DEFAULT_PRICES[minutes],
    kind: "text" as const,
    group: "Behandlingar",
  })),
];

export function isSafeContentUrl(value: string, media = false): boolean {
  if (!value) return true;
  // Control characters and backslashes can disguise an unsafe URL scheme.
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u0020\u007f\\]/.test(value)) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  if (!media && value.startsWith("#")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function validateContentValue(field: SiteContentField, value: string): string | null {
  if (value.length > 20000) return `${field.label}: texten är för lång.`;
  if (field.kind === "toggle" && !["true", "false"].includes(value)) return `${field.label}: välj om sektionen ska visas.`;
  if (field.settingKey === "business_name" && !value.trim()) return "Företagsnamnet får inte vara tomt.";
  if (field.settingKey === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Ange en giltig e-postadress.";
  if (field.settingKey === "phone" && value && !/^[+()\d\s-]{6,40}$/.test(value)) return "Ange telefonnumret med siffror, till exempel 070-123 45 67.";
  if (field.settingKey === "postal_code" && value && !/^\d{3}\s?\d{2}$/.test(value.trim())) return "Ange postnumret med fem siffror, till exempel 451 30.";
  if (["link", "image", "video"].includes(field.kind) && !isSafeContentUrl(value, field.kind !== "link")) return `${field.label}: använd en https-adress, intern sökväg eller ankarlänk.`;
  if (field.settingKey === "booking_url" && !/^https:\/\//i.test(value)) return "Bokningsadressen behöver vara en fullständig https-adress.";
  if (field.settingKey === "map_embed_url" && value) {
    try {
      if (!/^(www\.)?google\.(com|se)$/.test(new URL(value).hostname)) return "Den inbäddade kartan behöver använda google.com eller google.se.";
    } catch {
      return "Ange en giltig Google Maps-adress.";
    }
  }
  if (/^treatment_(30|45|60|80)_price$/.test(field.settingKey) && !/^\d[\d\s]*(?:[.,]\d{1,2})?\s*(?:kr|SEK)?$/i.test(value.trim())) return `${field.label}: ange ett pris, exempelvis 720 kr.`;
  return null;
}

/** Keep editable schema text safe when the rendered page is serialized to HTML. */
export function serializeStructuredData(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

export function treatmentPriceNumber(value: string): string {
  return value.replace(/\s/g, "").replace(/(?:kr|SEK)$/i, "").replace(",", ".");
}

export function getGlobalContentValue(key: string, settings: Record<string, string> = {}): string {
  const field = GLOBAL_CONTENT_FIELDS.find((field) => field.key === key);
  const stored = settings[key] ?? field?.defaultValue ?? "";
  const value = field && validateContentValue(field, stored) ? field.defaultValue : stored;
  if (key === "maps_url" && !value) return `https://maps.google.com/?q=${encodeURIComponent(getGlobalContentValue("address", settings))}`;
  if (key === "map_embed_url" && !value) return `https://www.google.com/maps?q=${encodeURIComponent(getGlobalContentValue("address", settings))}&output=embed`;
  return value;
}

/** Shared prices, names and contact details also update original texts until a text is explicitly customized. */
export function expandDefaultContent(value: string, settings: Record<string, string> = {}): string {
  const prices: Record<string, string> = { "450": "30", "595": "45", "720": "60", "998": "80" };
  let text = value.replace(/\b(450|595|720|998)\s+kr\b/g, (_match, price: string) => getGlobalContentValue(`treatment_${prices[price]}_price`, settings));
  text = text.replace(/info@auroramedia\.se/g, getGlobalContentValue("email", settings));
  text = text.replace(/Viriditas/g, getGlobalContentValue("business_name", settings));
  text = text.replace(/Andreas Håman/g, getGlobalContentValue("owner_name", settings));
  if (settings.address) text = text.replace(/Uddevalla Folkets Hus(?:,| på) Göteborgsvägen 11B/g, settings.address);
  return text;
}

export function getContentFieldValue(field: SiteContentField, settings: Record<string, string> = {}): string {
  const stored = settings[field.settingKey];
  if (stored !== undefined && !validateContentValue(field, stored)) return stored;
  if (GLOBAL_CONTENT_FIELDS.some((global) => global.settingKey === field.settingKey)) return getGlobalContentValue(field.settingKey, settings);
  if (field.settingKey === "contact_address_full" && settings.address) return getGlobalContentValue("address", settings);
  if (field.settingKey === "contact_hours_display" && settings.opening_hours) return getGlobalContentValue("opening_hours", settings);
  // Media and links are paths, not prose: only text is personalised.
  if (field.kind === "image" || field.kind === "video" || field.kind === "link") return field.defaultValue;
  return expandDefaultContent(field.defaultValue, settings);
}

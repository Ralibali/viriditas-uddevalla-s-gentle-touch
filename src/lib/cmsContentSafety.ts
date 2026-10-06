/** CMS links are content, so never permit executable URL schemes. */
export function safeContentUrl(value: unknown, media = false): string | undefined {
  if (typeof value !== "string") return undefined;
  const url = value.trim();
  // eslint-disable-next-line no-control-regex -- Reject characters that disguise executable URL schemes.
  if (!url || /[\u0000-\u001f\u007f\\]/.test(url)) return undefined;
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  if (!media && url.startsWith("#")) return url;
  try {
    const parsed = new URL(url);
    const allowed = media ? ["https:"] : ["https:", "mailto:", "tel:"];
    if (!allowed.includes(parsed.protocol) || parsed.username || parsed.password) return undefined;
    return url;
  } catch {
    return undefined;
  }
}

export function headingLevel(value: unknown): 1 | 2 | 3 {
  const level = Number(value);
  return level === 1 || level === 3 ? level : 2;
}

export function pageSlug(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100).replace(/-+$/g, "");
}

export function validPageSlug(value: string): boolean {
  return value.length > 0 && value.length <= 100 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

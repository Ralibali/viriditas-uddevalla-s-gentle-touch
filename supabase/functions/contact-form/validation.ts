// Validation and e-mail formatting for the contact form. Pure functions, no I/O.

export class InputError extends Error {}

// Control characters other than tab and newline are never valid in a message.
// deno-lint-ignore no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/; // eslint-disable-line no-control-regex

export function field(value: unknown, label: string, max: number, required = false): string {
  if (value === undefined || value === null) value = "";
  if (typeof value !== "string") throw new InputError(`Ogiltigt värde i fältet ${label}.`);
  const text = value.replace(/\r\n?/g, "\n").trim();
  if (CONTROL.test(text)) throw new InputError(`Fältet ${label} innehåller ogiltiga tecken.`);
  if (required && !text) throw new InputError(`Fyll i ${label}.`);
  if (text.length > max) throw new InputError(`Fältet ${label} får vara högst ${max} tecken.`);
  return text;
}

export function email(value: unknown): string {
  const text = field(value, "e-post", 254, true).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text)) throw new InputError("Ange en giltig e-postadress.");
  return text;
}

export function phone(value: unknown): string {
  const text = field(value, "telefon", 40);
  if (text && !/^[+()\d\s-]{6,40}$/.test(text)) throw new InputError("Ange telefonnumret med siffror, till exempel 070-123 45 67.");
  return text;
}

export function pagePath(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "";
  return value.split(/[?#]/)[0].slice(0, 200);
}

export type Submission = {
  kind: "question" | "gift_card";
  name: string;
  email: string;
  phone: string;
  message: string;
  details: Record<string, string>;
  page: string;
};

export function parse(payload: Record<string, unknown>): Submission {
  const kind = payload.kind;
  if (kind !== "question" && kind !== "gift_card") throw new InputError("Okänd typ av meddelande.");
  const base = {
    kind,
    name: field(payload.name, "namn", 120, true),
    email: email(payload.email),
    phone: phone(payload.phone),
    page: pagePath(payload.page),
  } as const;
  if (kind === "question") {
    return { ...base, message: field(payload.message, "meddelande", 4000, true), details: {} };
  }
  const details = (payload.details && typeof payload.details === "object" ? payload.details : {}) as Record<string, unknown>;
  const delivery = details.delivery === "pickup" ? "pickup" : details.delivery === "email" ? "email" : "";
  if (!delivery) throw new InputError("Välj hur presentkortet ska levereras.");
  return {
    ...base,
    message: field(payload.message, "övrigt", 2000),
    details: {
      gift: field(details.gift, "vad presentkortet ska gälla", 120, true),
      recipient: field(details.recipient, "mottagarens namn", 120),
      greeting: field(details.greeting, "hälsning", 500),
      delivery,
    },
  };
}

export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

export function emailBody(message: Submission): { subject: string; text: string; html: string } {
  const rows: [string, string][] = [
    ["Namn", message.name],
    ["E-post", message.email],
    ["Telefon", message.phone || "–"],
  ];
  if (message.kind === "gift_card") {
    rows.push(
      ["Presentkortet gäller", message.details.gift],
      ["Mottagare", message.details.recipient || "–"],
      ["Leverans", message.details.delivery === "pickup" ? "Hämtas på plats" : "Skickas med e-post"],
      ["Hälsning", message.details.greeting || "–"],
    );
  }
  if (message.message) rows.push([message.kind === "question" ? "Meddelande" : "Övrigt", message.message]);
  const subject = message.kind === "gift_card"
    ? `Presentkortsbeställning från ${message.name}`
    : `Ny fråga från webbplatsen – ${message.name}`;
  const intro = message.kind === "gift_card"
    ? "En besökare vill beställa ett presentkort via webbplatsen."
    : "En besökare har skickat en fråga via webbplatsen.";
  const footer = "Svara direkt på det här mejlet för att svara besökaren. Meddelandet finns också under Meddelanden i administrationen.";
  const text = [intro, "", ...rows.map(([label, value]) => `${label}: ${value}`), "", footer].join("\n");
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#17271D">
<p>${escapeHtml(intro)}</p>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([label, value]) => `<tr><td style="vertical-align:top;color:#5F6C57;padding-right:16px">${escapeHtml(label)}</td><td style="white-space:pre-wrap">${escapeHtml(value)}</td></tr>`)
    .join("")}</table>
<p style="color:#5F6C57">${escapeHtml(footer)}</p></div>`;
  return { subject, text, html };
}

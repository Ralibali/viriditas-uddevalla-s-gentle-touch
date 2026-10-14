import { callFunction } from "@/lib/backend";

export type FormKind = "question" | "gift_card";

export interface ContactValues {
  name: string;
  email: string;
  phone: string;
  message: string;
  gift: string;
  amount: string;
  recipient: string;
  greeting: string;
  delivery: "" | "email" | "pickup";
}

export const EMPTY_CONTACT: ContactValues = { name: "", email: "", phone: "", message: "", gift: "", amount: "", recipient: "", greeting: "", delivery: "" };

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

/** The same rules as the server, so mistakes are explained before anything is sent. */
export function validateContact(kind: FormKind, values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (!values.name.trim()) errors.name = "Fyll i ditt namn.";
  else if (values.name.trim().length > 120) errors.name = "Namnet får vara högst 120 tecken.";
  if (!values.email.trim()) errors.email = "Fyll i din e-postadress så att vi kan svara.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = "Ange en giltig e-postadress, till exempel namn@exempel.se.";
  if (values.phone.trim() && !/^[+()\d\s-]{6,40}$/.test(values.phone.trim())) errors.phone = "Ange telefonnumret med siffror, till exempel 070-123 45 67.";
  if (kind === "question") {
    if (!values.message.trim()) errors.message = "Skriv din fråga.";
    else if (values.message.length > 4000) errors.message = "Frågan får vara högst 4 000 tecken.";
  } else {
    if (!values.gift) errors.gift = "Välj vad presentkortet ska gälla.";
    if (values.gift === "amount" && !/^\d{2,5}$/.test(values.amount.trim())) errors.amount = "Ange beloppet i hela kronor, till exempel 500.";
    if (!values.delivery) errors.delivery = "Välj hur presentkortet ska levereras.";
    if (values.greeting.length > 500) errors.greeting = "Hälsningen får vara högst 500 tecken.";
    if (values.message.length > 2000) errors.message = "Texten får vara högst 2 000 tecken.";
  }
  return errors;
}

export function giftDescription(values: ContactValues, options: { value: string; label: string }[]): string {
  if (values.gift === "amount") return `Valfritt belopp: ${values.amount.trim()} kr`;
  return options.find((option) => option.value === values.gift)?.label ?? values.gift;
}

export function contactPayload(kind: FormKind, values: ContactValues, gift: string, startedAt: number, website: string) {
  return {
    kind,
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    message: values.message.trim(),
    page: window.location.pathname,
    website,
    elapsed_ms: Date.now() - startedAt,
    ...(kind === "gift_card" ? { details: { gift, recipient: values.recipient.trim(), greeting: values.greeting.trim(), delivery: values.delivery } } : {}),
  };
}

export function sendContact(payload: ReturnType<typeof contactPayload>) {
  return callFunction<{ success: boolean; notified?: boolean }>("contact-form", payload);
}

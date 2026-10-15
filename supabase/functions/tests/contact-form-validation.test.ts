// Run with: deno test supabase/functions/tests
import { deepStrictEqual, ok, throws } from "node:assert";
import { emailBody, InputError, parse } from "../contact-form/validation.ts";

const assertEquals = (actual: unknown, expected: unknown) => deepStrictEqual(actual, expected);
const assertStringIncludes = (actual: string, expected: string) => ok(actual.includes(expected), `expected "${actual}" to include "${expected}"`);
function assertThrows(work: () => unknown, kind: new (...args: never[]) => Error, includes = "") {
  throws(work, (error: unknown) => error instanceof kind && (error as Error).message.includes(includes));
}

Deno.test("accepts a question and trims its fields", () => {
  const message = parse({ kind: "question", name: "  Anna  ", email: "Anna@Example.se", message: "Har du tider på lördagar?\r\n", page: "/?utm=x" });
  assertEquals(message.name, "Anna");
  assertEquals(message.email, "anna@example.se");
  assertEquals(message.message, "Har du tider på lördagar?");
  assertEquals(message.page, "/");
});

Deno.test("requires a message for questions and a gift and delivery for gift cards", () => {
  assertThrows(() => parse({ kind: "question", name: "Anna", email: "anna@example.se", message: " " }), InputError, "Fyll i meddelande");
  assertThrows(() => parse({ kind: "gift_card", name: "Bo", email: "bo@example.se", details: { delivery: "email" } }), InputError, "Fyll i vad presentkortet ska gälla");
  assertThrows(() => parse({ kind: "gift_card", name: "Bo", email: "bo@example.se", details: { gift: "60 min" } }), InputError, "leverera");
  const gift = parse({ kind: "gift_card", name: "Bo", email: "bo@example.se", details: { gift: "Klassisk massage 60 min", delivery: "pickup", recipient: "Cia" } });
  assertEquals(gift.details, { gift: "Klassisk massage 60 min", recipient: "Cia", greeting: "", delivery: "pickup" });
});

Deno.test("rejects malformed contact details and unknown kinds", () => {
  assertThrows(() => parse({ kind: "spam", name: "X", email: "x@example.se", message: "Hej" }), InputError);
  assertThrows(() => parse({ kind: "question", name: "X", email: "inte-en-adress", message: "Hej" }), InputError, "giltig e-postadress");
  assertThrows(() => parse({ kind: "question", name: "X", email: "x@example.se", phone: "ring mig", message: "Hej" }), InputError, "telefonnumret");
  assertThrows(() => parse({ kind: "question", name: "X\u0007", email: "x@example.se", message: "Hej" }), InputError, "ogiltiga tecken");
  assertThrows(() => parse({ kind: "question", name: "X", email: "x@example.se", message: "a".repeat(4001) }), InputError, "högst 4000");
  assertEquals(parse({ kind: "question", name: "X", email: "x@example.se", message: "Hej", page: "//evil.example" }).page, "");
});

Deno.test("escapes visitor text in the notification e-mail", () => {
  const body = emailBody(parse({ kind: "question", name: "<script>alert(1)</script>", email: "x@example.se", message: "Hej & tack" }));
  assertStringIncludes(body.html, "&lt;script&gt;alert(1)&lt;/script&gt;");
  assertStringIncludes(body.html, "Hej &amp; tack");
  assertEquals(body.html.includes("<script>"), false);
  assertStringIncludes(body.subject, "Ny fråga från webbplatsen");
  assertStringIncludes(body.text, "Meddelande: Hej & tack");
});

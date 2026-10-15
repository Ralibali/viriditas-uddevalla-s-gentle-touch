// Public endpoint for the website's question form and gift card requests.
//
// Messages are stored privately (cms_private.contact_messages) and shown in the
// administration. When RESEND_API_KEY is set, a notification e-mail with the
// message goes to CONTACT_NOTIFY_EMAIL (or the site's public e-mail address),
// with the visitor's address as reply-to. Nothing is ever sent to the visitor's
// address, so the form cannot be used to send e-mail to strangers.
//
// Secrets (Supabase → Edge Functions → Secrets):
//   RESEND_API_KEY        optional, enables notification e-mails
//   CONTACT_NOTIFY_EMAIL  optional, recipient of notifications
//   CONTACT_FROM_EMAIL    optional, sender, e.g. "Viriditas <webbplats@viriditasmassage.se>"
//                         (the domain must be verified in Resend)

import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.99.1";
import { emailBody, InputError, parse, type Submission } from "./validation.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

async function clientKey(req: Request): Promise<string> {
  const ip = (req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || "unknown")
    .split(",")[0]
    .trim();
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`contact-form:${ip}`));
  return Array.from(new Uint8Array(digest)).map((n) => n.toString(16).padStart(2, "0")).join("");
}

async function notify(supabase: SupabaseClient, id: string, message: Submission): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) return false;
  let to = Deno.env.get("CONTACT_NOTIFY_EMAIL") || "";
  if (!to) {
    const { data } = await supabase.from("site_settings").select("setting_value").eq("setting_key", "email").maybeSingle();
    to = (data?.setting_value as string | undefined) || "";
  }
  if (!to) return false;
  const { subject, text, html } = emailBody(message);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: Deno.env.get("CONTACT_FROM_EMAIL") || "Viriditas <onboarding@resend.dev>",
      to: [to],
      reply_to: message.email,
      subject,
      text,
      html,
    }),
  });
  if (!response.ok) {
    console.error("Notification e-mail failed", response.status);
    return false;
  }
  await supabase.rpc("cms_mark_message_notified", { p_id: id });
  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const raw = await req.text();
    if (raw.length > 20000) return json({ error: "Meddelandet är för långt." }, 413);
    const payload = JSON.parse(raw);
    if (!payload || typeof payload !== "object") throw new InputError("Ogiltig begäran.");

    // Automated submissions fill the hidden field or post instantly. They get a
    // normal-looking answer but nothing is stored or sent.
    const elapsed = Number(payload.elapsed_ms);
    if ((typeof payload.website === "string" && payload.website.trim()) || !Number.isFinite(elapsed) || elapsed < 2500) {
      return json({ success: true });
    }

    const message = parse(payload);
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.rpc("cms_submit_message", {
      p_client: await clientKey(req),
      p_kind: message.kind,
      p_name: message.name,
      p_email: message.email,
      p_phone: message.phone,
      p_message: message.message,
      p_details: message.details,
      p_page: message.page,
    });
    if (error) throw error;
    if (data?.error) return json({ error: data.error }, data.status || 400);

    let notified = false;
    try {
      notified = await notify(supabase, data.id, message);
    } catch (notifyError) {
      console.error("Notification e-mail failed", notifyError instanceof Error ? notifyError.message : "unknown");
    }
    return json({ success: true, notified });
  } catch (error) {
    if (error instanceof InputError || error instanceof SyntaxError) return json({ error: error.message }, 400);
    const dbError = error as { code?: string };
    console.error("Contact form failed", dbError.code ?? "unknown");
    if (dbError.code === "PGRST202" || dbError.code === "42883") {
      return json({ error: "Formuläret är inte aktiverat ännu. Mejla gärna direkt i stället." }, 503);
    }
    return json({ error: "Meddelandet kunde inte skickas. Försök igen eller mejla direkt." }, 500);
  }
});

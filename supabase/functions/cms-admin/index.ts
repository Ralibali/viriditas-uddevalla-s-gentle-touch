import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), {
  status, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
});
class InputError extends Error {}
function text(value: unknown, name: string, max = 20000): string {
  if (typeof value !== "string" || value.length > max) throw new InputError(`Ogiltigt värde: ${name}`);
  return value;
}
function email(value: unknown): string {
  const result = text(value, "e-post", 254).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) throw new InputError("Ange en giltig e-postadress.");
  return result;
}
function safeUrl(value: string, name: string) {
  if (!value) return;
  if (/^\/(?!\/)/.test(value) || /^#[\w-]*$/.test(value) || /^(mailto:|tel:)/i.test(value)) return;
  try { if (new URL(value).protocol === "https:") return; } catch { /* invalid */ }
  throw new InputError(`Ange en säker länk för ${name} (https:// eller /sida).`);
}
function setting(row: { key?: unknown; value?: unknown }) {
  const key = text(row.key, "inställning", 160);
  if (!/^[a-zA-Z0-9_.-]+$/.test(key)) throw new InputError("Ogiltig inställning.");
  const value = text(row.value, key);
  if (/(_url|_image|\.image_\d+|\.href_\d+)$/.test(key)) safeUrl(value, key);
  if (key === "email" && value) email(value);
  return { setting_key: key, setting_value: value, updated_at: new Date().toISOString() };
}
function contentBlocks(raw: unknown) {
  const blocks = typeof raw === "string" ? JSON.parse(raw) : raw;
  const types = ["heading", "paragraph", "image", "video", "cta_button", "list", "quote", "divider", "faq"];
  if (!Array.isArray(blocks) || blocks.length > 200) throw new InputError("Ogiltigt sidinnehåll.");
  for (const block of blocks) {
    if (!block || !types.includes(block.type) || typeof block.id !== "string" || !block.data || typeof block.data !== "object") throw new InputError("Ogiltigt innehållsblock.");
    if (["image", "video"].includes(block.type)) safeUrl(text(block.data.src ?? "", "media"), "media");
    if (block.type === "cta_button") safeUrl(text(block.data.url ?? "", "knapplänk"), "knapplänk");
    if (block.type === "heading" && ![1, 2, 3].includes(Number(block.data.level))) throw new InputError("Ogiltig rubriknivå.");
  }
  if (JSON.stringify(blocks).length > 250000) throw new InputError("Sidans innehåll är för stort.");
  return blocks;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) return json({ error: "Logga in för att fortsätta." }, 401);
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    // Verify the live user with Auth. User-editable metadata never grants access.
    const { data: { user }, error: authError } = await supabase.auth.getUser(authorization.slice(7));
    if (authError || !user?.email || !user.email_confirmed_at) return json({ error: "Logga in och bekräfta din e-postadress." }, 401);
    const userEmail = user.email.toLowerCase();
    const { data: admin, error: roleError } = await supabase.from("cms_admins").select("email").eq("email", userEmail).maybeSingle();
    if (roleError) throw roleError;
    if (!admin) return json({ error: "Kontot saknar adminbehörighet. Kontakta webbplatsens ägare." }, 403);
    const bodyText = await req.text();
    if (bodyText.length > 7500000) return json({ error: "För stor uppladdning." }, 413);
    const { action, payload = {} } = JSON.parse(bodyText);
    switch (action) {
      case "check_access": return json({ email: userEmail });
      case "list_admins": {
        const { data, error } = await supabase.from("cms_admins").select("email,created_at").order("created_at");
        if (error) throw error;
        return json(data);
      }
      case "add_admin": {
        const target = email(payload.email);
        const { error } = await supabase.from("cms_admins").upsert({ email: target }, { onConflict: "email", ignoreDuplicates: true });
        if (error) throw error;
        return json({ success: true });
      }
      case "remove_admin": {
        const target = email(payload.email);
        if (target === userEmail) throw new InputError("Du kan inte ta bort din egen behörighet.");
        const { error } = await supabase.from("cms_admins").delete().eq("email", target);
        if (error) throw error;
        return json({ success: true });
      }
      case "list_pages": {
        const { data, error } = await supabase.from("site_pages").select("*").order("nav_order");
        if (error) throw error;
        return json(data);
      }
      case "upsert_page": {
        const slug = text(payload.slug, "sidans adress", 120).trim();
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new InputError("Sidans adress får bara innehålla gemener, siffror och bindestreck.");
        const title = text(payload.title, "titel", 250).trim();
        if (!title) throw new InputError("Sidan behöver en titel.");
        const page = {
          slug, title, content: contentBlocks(payload.content ?? []),
          meta_description: text(payload.meta_description ?? "", "metabeskrivning", 500) || null,
          nav_label: text(payload.nav_label ?? "", "menytext", 100) || null,
          nav_order: Number.isInteger(payload.nav_order) ? payload.nav_order : 0,
          is_published: payload.is_published === true,
          show_in_nav: payload.show_in_nav === true,
          updated_at: new Date().toISOString(),
        };
        if (payload.id) {
          const id = text(payload.id, "sid-id", 36);
          const { data: existing, error: readError } = await supabase.from("site_pages").select("slug").eq("id", id).single();
          if (readError) throw readError;
          if (existing.slug !== slug) throw new InputError("En befintlig sidas adress kan inte ändras. Skapa en ny sida för en annan adress.");
          const { data, error } = await supabase.from("site_pages").update(page).eq("id", id).select().single();
          if (error) throw error;
          return json(data);
        }
        const { data, error } = await supabase.from("site_pages").insert(page).select().single();
        if (error) throw error;
        return json(data);
      }
      case "delete_page": {
        const { error } = await supabase.from("site_pages").delete().eq("id", text(payload.id, "sid-id", 36));
        if (error) throw error;
        return json({ success: true });
      }
      case "update_setting":
      case "update_settings": {
        const incoming = action === "update_setting" ? [payload] : payload.settings;
        if (!Array.isArray(incoming) || incoming.length > 2000) throw new InputError("Ogiltiga inställningar.");
        const rows = incoming.map(setting);
        if (new Set(rows.map(row => row.setting_key)).size !== rows.length) throw new InputError("Dubblerade inställningar.");
        if (rows.length) {
          // One statement: either every setting saves or none does.
          const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "setting_key" });
          if (error) throw error;
        }
        return json({ success: true });
      }
      case "get_booking_clicks": {
        const { data, error } = await supabase.from("booking_clicks").select("id,source,clicked_at").order("clicked_at", { ascending: false }).limit(10000);
        if (error) throw error;
        return json(data);
      }
      case "export_content": {
        const [{ data: settings, error: settingsError }, { data: pages, error: pagesError }] = await Promise.all([
          supabase.from("site_settings").select("setting_key,setting_value").order("setting_key"),
          supabase.from("site_pages").select("*").order("nav_order"),
        ]);
        if (settingsError || pagesError) throw settingsError || pagesError;
        return json({ exported_at: new Date().toISOString(), settings, pages });
      }
      case "upload_image": {
        const mimeType = text(payload.mimeType, "bildtyp", 30);
        const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
        if (!extensions[mimeType]) throw new InputError("Välj en JPG-, PNG-, WebP- eller GIF-bild.");
        const base64 = text(payload.base64, "bild", 7000000);
        let bytes: Uint8Array;
        try { bytes = Uint8Array.from(atob(base64), char => char.charCodeAt(0)); } catch { throw new InputError("Bilden kunde inte läsas."); }
        if (bytes.length === 0 || bytes.length > 5 * 1024 * 1024) throw new InputError("Bilden får vara högst 5 MB.");
        const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
        const valid = mimeType === "image/jpeg" ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
          : mimeType === "image/png" ? [137,80,78,71,13,10,26,10].every((n,i) => bytes[i] === n)
          : mimeType === "image/webp" ? ascii(0,4) === "RIFF" && ascii(8,12) === "WEBP"
          : ["GIF87a","GIF89a"].includes(ascii(0,6));
        if (!valid) throw new InputError("Filen är inte en giltig bild av vald typ.");
        const path = `${crypto.randomUUID()}.${extensions[mimeType]}`;
        const { error } = await supabase.storage.from("site-media").upload(path, bytes, { contentType: mimeType, upsert: false });
        if (error) throw error;
        return json({ path, url: supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl });
      }
      default: return json({ error: "Okänd åtgärd." }, 400);
    }
  } catch (error) {
    if (error instanceof InputError || error instanceof SyntaxError) return json({ error: error.message }, 400);
    const dbError = error as { code?: string };
    if (dbError.code === "23505") return json({ error: "Det finns redan en sida med den adressen." }, 409);
    console.error("CMS operation failed", dbError.code ?? "unknown");
    return json({ error: "Åtgärden kunde inte slutföras. Försök igen." }, 500);
  }
});

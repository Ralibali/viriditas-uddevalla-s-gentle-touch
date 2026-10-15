import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.99.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cms-session",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
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
  try {
    if (new URL(value).protocol === "https:") return;
  } catch {
    /* invalid */
  }
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
function uuid(value: unknown, name: string): string {
  const result = text(value, name, 36);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(result)) throw new InputError(`Ogiltigt id för ${name}.`);
  return result;
}


/** Run one part of the overview; a part that fails (e.g. before a migration) is reported as unavailable. */
async function part<T>(work: () => PromiseLike<{ data: T | null; error: unknown; count?: number | null }>) {
  try {
    const { data, error, count } = await work();
    if (error) return { available: false as const };
    return { available: true as const, data, count: count ?? null };
  } catch {
    return { available: false as const };
  }
}

async function overview(supabase: SupabaseClient) {
  const day = 24 * 60 * 60 * 1000;
  const iso = (daysAgo: number) => new Date(Date.now() - daysAgo * day).toISOString();
  const clicks = (from: number, to?: number) =>
    part(() => {
      let query = supabase.from("booking_clicks").select("id", { count: "exact", head: true }).eq("click_type", "booking").gte("clicked_at", iso(from));
      if (to !== undefined) query = query.lt("clicked_at", iso(to));
      return query;
    });
  const [last7, previous7, last30, messages, reviews, settings, pages, jobs] = await Promise.all([
    clicks(7),
    clicks(14, 7),
    clicks(30),
    part(() => supabase.rpc("cms_message_counts")),
    part(() => supabase.from("reviews").select("*")),
    part(() => supabase.from("site_settings").select("setting_key,setting_value").in("setting_key", ["review_rating_value", "review_count"])),
    part(() => supabase.from("site_pages").select("is_published")),
    part(() => supabase.rpc("cms_job_status")),
  ]);
  const reviewRows = (reviews.available ? reviews.data : []) as { rating: number; is_hidden?: boolean }[];
  const settingMap = Object.fromEntries(
    ((settings.available ? settings.data : []) as { setting_key: string; setting_value: string | null }[]).map((row) => [row.setting_key, row.setting_value]),
  );
  const pageRows = (pages.available ? pages.data : []) as { is_published: boolean }[];
  return {
    booking_clicks: last7.available ? { last_7_days: last7.count, previous_7_days: previous7.count, last_30_days: last30.count } : null,
    messages: messages.available ? messages.data : null,
    reviews: reviews.available
      ? {
          imported: reviewRows.length,
          hidden: reviewRows.filter((row) => row.is_hidden).length,
          rating: settingMap.review_rating_value ? Number(settingMap.review_rating_value) : null,
          count: settingMap.review_count ? Number(settingMap.review_count) : null,
        }
      : null,
    pages: pages.available ? { published: pageRows.filter((row) => row.is_published).length, drafts: pageRows.filter((row) => !row.is_published).length } : null,
    jobs: jobs.available ? jobs.data : null,
  };
}

function contentBlocks(raw: unknown) {
  const blocks = typeof raw === "string" ? JSON.parse(raw) : raw;
  const types = ["heading", "paragraph", "image", "video", "cta_button", "list", "quote", "divider", "faq"];
  if (!Array.isArray(blocks) || blocks.length > 200) throw new InputError("Ogiltigt sidinnehåll.");
  for (const block of blocks) {
    if (
      !block ||
      !types.includes(block.type) ||
      typeof block.id !== "string" ||
      !block.data ||
      typeof block.data !== "object"
    )
      throw new InputError("Ogiltigt innehållsblock.");
    if (["image", "video"].includes(block.type)) safeUrl(text(block.data.src ?? "", "media"), "media");
    if (block.type === "cta_button") safeUrl(text(block.data.url ?? "", "knapplänk"), "knapplänk");
    if (block.type === "heading" && ![1, 2, 3].includes(Number(block.data.level)))
      throw new InputError("Ogiltig rubriknivå.");
  }
  if (JSON.stringify(blocks).length > 250000) throw new InputError("Sidans innehåll är för stort.");
  return blocks;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const bodyText = await req.text();
    if (bodyText.length > 7500000) return json({ error: "För stor uppladdning." }, 413);
    const body = JSON.parse(bodyText);
    if (!body || typeof body !== "object") throw new InputError("Ogiltig begäran.");
    const { action, payload = {} } = body;
    if (action === "login") {
      const password = text(payload.password, "lösenord", 256);
      const ip =
        req.headers.get("cf-connecting-ip") ||
        req.headers.get("x-real-ip") ||
        req.headers.get("x-forwarded-for") ||
        "unknown";
      const clientKey = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip))))
        .map((n) => n.toString(16).padStart(2, "0"))
        .join("");
      const { data, error } = await supabase.rpc("cms_login", { p_password: password, p_client: clientKey });
      if (error) throw error;
      if (data?.error) return json({ error: data.error }, data.status || 401);
      return json(data);
    }
    const token = req.headers.get("x-cms-session");
    if (!token || !/^[0-9a-f]{64}$/.test(token)) return json({ error: "Logga in för att fortsätta." }, 401);
    const { data: session, error: sessionError } = await supabase.rpc("cms_validate_session", { p_token: token });
    if (sessionError) throw sessionError;
    if (!session?.expires_at) return json({ error: "Sessionen har gått ut. Logga in igen." }, 401);
    switch (action) {
      case "check_access":
        return json(session);
      case "change_password": {
        const { data, error } = await supabase.rpc("cms_change_password", {
          p_token: token,
          p_current: text(payload.current_password, "nuvarande lösenord", 256),
          p_new: text(payload.new_password, "nytt lösenord", 256),
        });
        if (error) throw error;
        if (data?.error) return json({ error: data.error }, data.status || 400);
        return json(data);
      }
      case "logout": {
        const { error } = await supabase.rpc("cms_logout", { p_token: token });
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
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
          throw new InputError("Sidans adress får bara innehålla gemener, siffror och bindestreck.");
        const title = text(payload.title, "titel", 250).trim();
        if (!title) throw new InputError("Sidan behöver en titel.");
        const page = {
          slug,
          title,
          content: contentBlocks(payload.content ?? []),
          meta_description: text(payload.meta_description ?? "", "metabeskrivning", 500) || null,
          nav_label: text(payload.nav_label ?? "", "menytext", 100) || null,
          nav_order: Number.isInteger(payload.nav_order) ? payload.nav_order : 0,
          is_published: payload.is_published === true,
          show_in_nav: payload.show_in_nav === true,
          updated_at: new Date().toISOString(),
        };
        if (payload.id) {
          const id = text(payload.id, "sid-id", 36);
          const { data: existing, error: readError } = await supabase
            .from("site_pages")
            .select("slug")
            .eq("id", id)
            .single();
          if (readError) throw readError;
          if (existing.slug !== slug)
            throw new InputError("En befintlig sidas adress kan inte ändras. Skapa en ny sida för en annan adress.");
          const { data, error } = await supabase.from("site_pages").update(page).eq("id", id).select().single();
          if (error) throw error;
          return json(data);
        }
        const { data, error } = await supabase.from("site_pages").insert(page).select().single();
        if (error) throw error;
        return json(data);
      }
      case "delete_page": {
        const { error } = await supabase
          .from("site_pages")
          .delete()
          .eq("id", text(payload.id, "sid-id", 36));
        if (error) throw error;
        return json({ success: true });
      }
      case "update_setting":
      case "update_settings": {
        const incoming = action === "update_setting" ? [payload] : payload.settings;
        if (!Array.isArray(incoming) || incoming.length > 2000) throw new InputError("Ogiltiga inställningar.");
        const rows = incoming.map(setting);
        if (new Set(rows.map((row) => row.setting_key)).size !== rows.length)
          throw new InputError("Dubblerade inställningar.");
        if (rows.length) {
          // One statement: either every setting saves or none does.
          const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "setting_key" });
          if (error) throw error;
        }
        return json({ success: true });
      }
      case "get_booking_clicks": {
        const { data, error } = await supabase
          .from("booking_clicks")
          .select("id,source,clicked_at,click_type")
          .order("clicked_at", { ascending: false })
          .limit(10000);
        if (error) throw error;
        return json(data);
      }
      case "overview":
        return json(await overview(supabase));
      case "list_messages": {
        const status = payload.status === "new" || payload.status === "handled" ? payload.status : null;
        const { data, error } = await supabase.rpc("cms_list_messages", { p_status: status });
        if (error) throw error;
        return json(data ?? []);
      }
      case "update_message": {
        const { data, error } = await supabase.rpc("cms_update_message", {
          p_id: uuid(payload.id, "meddelande"),
          p_status: payload.status === "handled" ? "handled" : "new",
        });
        if (error) throw error;
        if (data?.error) return json({ error: data.error }, data.status || 400);
        return json({ success: true });
      }
      case "delete_message": {
        const { error } = await supabase.rpc("cms_delete_message", { p_id: uuid(payload.id, "meddelande") });
        if (error) throw error;
        return json({ success: true });
      }
      case "list_reviews": {
        const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        return json(data ?? []);
      }
      case "update_review": {
        const changes: Record<string, boolean> = {};
        if (typeof payload.is_hidden === "boolean") changes.is_hidden = payload.is_hidden;
        if (typeof payload.is_featured === "boolean") changes.is_featured = payload.is_featured;
        if (!Object.keys(changes).length) throw new InputError("Ingen ändring angavs.");
        const { error } = await supabase.from("reviews").update(changes).eq("id", uuid(payload.id, "omdöme"));
        if (error) throw error;
        return json({ success: true });
      }
      case "list_treatments": {
        const { data, error } = await supabase
          .from("treatments")
          .select("service_ref,title,duration_minutes,price_sek,description,last_synced_at")
          .order("duration_minutes", { ascending: true });
        if (error) throw error;
        return json(data ?? []);
      }
      case "export_content": {
        const [{ data: settings, error: settingsError }, { data: pages, error: pagesError }] = await Promise.all([
          supabase.from("site_settings").select("setting_key,setting_value").order("setting_key"),
          supabase.from("site_pages").select("*").order("nav_order"),
        ]);
        if (settingsError || pagesError) throw settingsError || pagesError;
        return json({ exported_at: new Date().toISOString(), settings, pages });
      }
      case "list_images": {
        const { data, error } = await supabase.storage
          .from("site-media")
          .list("", { limit: 1000, sortBy: { column: "created_at", order: "desc" } });
        if (error) throw error;
        return json(
          (data ?? [])
            .filter((file) => file.id)
            .map((file) => ({
              path: file.name,
              created_at: file.created_at,
              url: supabase.storage.from("site-media").getPublicUrl(file.name).data.publicUrl,
            })),
        );
      }
      case "delete_image": {
        const path = text(payload.path, "bild", 80);
        if (!/^[0-9a-f-]{36}\.(jpg|png|webp|gif)$/.test(path)) throw new InputError("Ogiltig bild.");
        const url = supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl;
        const [{ data: settings, error: settingsError }, { data: pages, error: pagesError }] = await Promise.all([
          supabase.from("site_settings").select("setting_key").eq("setting_value", url).limit(1),
          supabase.from("site_pages").select("content"),
        ]);
        if (settingsError || pagesError) throw settingsError || pagesError;
        if (settings?.length || pages?.some((page) => JSON.stringify(page.content).includes(url)))
          throw new InputError("Bilden används på webbplatsen. Byt eller ta bort den från innehållet först.");
        const { error } = await supabase.storage.from("site-media").remove([path]);
        if (error) throw error;
        return json({ success: true });
      }
      case "upload_image": {
        const mimeType = text(payload.mimeType, "bildtyp", 30);
        const extensions: Record<string, string> = {
          "image/jpeg": "jpg",
          "image/png": "png",
          "image/webp": "webp",
          "image/gif": "gif",
        };
        if (!extensions[mimeType]) throw new InputError("Välj en JPG-, PNG-, WebP- eller GIF-bild.");
        const base64 = text(payload.base64, "bild", 7000000);
        let bytes: Uint8Array;
        try {
          bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
        } catch {
          throw new InputError("Bilden kunde inte läsas.");
        }
        if (bytes.length === 0 || bytes.length > 5 * 1024 * 1024) throw new InputError("Bilden får vara högst 5 MB.");
        const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
        const valid =
          mimeType === "image/jpeg"
            ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
            : mimeType === "image/png"
              ? [137, 80, 78, 71, 13, 10, 26, 10].every((n, i) => bytes[i] === n)
              : mimeType === "image/webp"
                ? ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP"
                : ["GIF87a", "GIF89a"].includes(ascii(0, 6));
        if (!valid) throw new InputError("Filen är inte en giltig bild av vald typ.");
        const path = `${crypto.randomUUID()}.${extensions[mimeType]}`;
        const { error } = await supabase.storage
          .from("site-media")
          .upload(path, bytes, { contentType: mimeType, upsert: false });
        if (error) throw error;
        return json({ path, url: supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl });
      }
      default:
        return json({ error: "Okänd åtgärd." }, 400);
    }
  } catch (error) {
    if (error instanceof InputError || error instanceof SyntaxError) return json({ error: error.message }, 400);
    const dbError = error as { code?: string };
    if (dbError.code === "23505") return json({ error: "Det finns redan en sida med den adressen." }, 409);
    // A function or column that does not exist yet means the latest migration has not run.
    if (["PGRST202", "PGRST204", "42883", "42703"].includes(dbError.code ?? "")) {
      return json({ error: "Den här delen kräver den senaste databasuppdateringen. Kör migreringarna och försök igen." }, 503);
    }
    console.error("CMS operation failed", dbError.code ?? "unknown");
    return json({ error: "Åtgärden kunde inte slutföras. Försök igen." }, 500);
  }
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CMS_PASSWORD = "Annika";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { password, action, payload } = body;

    if (password !== CMS_PASSWORD) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    let result: any;

    switch (action) {
      // ---- Pages ----
      case "upsert_page": {
        const { id, ...pageData } = payload;
        if (id) {
          const { data, error } = await supabase
            .from("site_pages")
            .update({ ...pageData, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single();
          if (error) throw error;
          result = data;
        } else {
          const { data, error } = await supabase
            .from("site_pages")
            .insert({ ...pageData, updated_at: new Date().toISOString() })
            .select()
            .single();
          if (error) throw error;
          result = data;
        }
        break;
      }

      case "delete_page": {
        const { id } = payload;
        const { error } = await supabase.from("site_pages").delete().eq("id", id);
        if (error) throw error;
        result = { success: true };
        break;
      }

      case "list_pages": {
        const { data, error } = await supabase
          .from("site_pages")
          .select("*")
          .order("nav_order", { ascending: true });
        if (error) throw error;
        result = data;
        break;
      }

      // ---- Settings ----
      case "update_setting": {
        const { key, value } = payload;
        const { data: existing } = await supabase
          .from("site_settings")
          .select("id")
          .eq("setting_key", key)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase
            .from("site_settings")
            .update({ setting_value: value, updated_at: new Date().toISOString() })
            .eq("setting_key", key);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("site_settings")
            .insert({ setting_key: key, setting_value: value });
          if (error) throw error;
        }
        result = { success: true };
        break;
      }

      // ---- Stats ----
      case "get_booking_clicks": {
        const { data, error } = await supabase
          .from("booking_clicks")
          .select("*")
          .order("clicked_at", { ascending: false });
        if (error) throw error;
        result = data;
        break;
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

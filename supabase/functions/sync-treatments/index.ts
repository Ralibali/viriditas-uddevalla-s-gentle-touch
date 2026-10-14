import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.99.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cms-session',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const JOB = 'sync-treatments';
const JOB_INTERVAL_SECONDS = 6 * 60 * 60;

// Each run costs a Firecrawl credit. A signed-in administrator may refresh once a
// minute; anyone else (the scheduled job, or someone holding the public key) at
// most once per JOB_INTERVAL_SECONDS. The last result is kept for the admin view.
async function authorizeRun(req: Request, supabase: SupabaseClient, job: string): Promise<{ admin: boolean } | Response> {
  const token = req.headers.get("x-cms-session");
  let admin = false;
  if (token) {
    if (!/^[0-9a-f]{64}$/.test(token)) return respond({ success: false, error: "Logga in för att fortsätta." }, 401);
    const { data } = await supabase.rpc("cms_validate_session", { p_token: token });
    if (!data?.expires_at) return respond({ success: false, error: "Sessionen har gått ut. Logga in igen." }, 401);
    admin = true;
  }
  const { data: claimed, error } = await supabase.rpc("cms_claim_job", {
    p_job: job,
    p_min_interval_seconds: admin ? 60 : JOB_INTERVAL_SECONDS,
  });
  if (error) {
    // Before the job-run migration exists every run is allowed, as before.
    console.warn("Job throttling unavailable", error.code ?? "unknown");
    return { admin };
  }
  if (!claimed) {
    return respond(
      { success: false, skipped: true, error: admin ? "Hämtningen kördes nyss. Vänta en minut och försök igen." : "Hämtningen har redan körts nyligen." },
      429,
    );
  }
  return { admin };
}

async function finishRun(supabase: SupabaseClient, job: string, result: Record<string, unknown>) {
  const { error } = await supabase.rpc("cms_finish_job", { p_job: job, p_result: result });
  if (error) console.warn("Could not record job result", error.code ?? "unknown");
}

function respond(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" } });
}

const BOKADIREKT_URL = 'https://www.bokadirekt.se/places/viriditas-massage-136924';

interface ParsedTreatment {
  service_ref: string;
  title: string;
  duration_minutes: number | null;
  price_sek: number | null;
  description: string | null;
}

// Parse the Bokadirekt place page markdown into a list of services.
// Structure per service:
//   ## <title>
//   <n> min
//   <description paragraph(s)>
//   Pris<price> kr
//   Boka
function parseTreatments(markdown: string): ParsedTreatment[] {
  const lines = markdown.split('\n').map((l) => l.trim());
  const treatments: ParsedTreatment[] = [];

  let currentTitle: string | null = null;
  let currentDuration: number | null = null;
  let descLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      currentTitle = headingMatch[1].trim();
      currentDuration = null;
      descLines = [];
      continue;
    }

    if (!currentTitle) continue;

    const durMatch = line.match(/^(\d{1,3})\s*min$/i);
    if (durMatch && currentDuration === null) {
      currentDuration = parseInt(durMatch[1], 10);
      continue;
    }

    const priceMatch = line.match(/^Pris\s*([\d\s]+)\s*kr$/i);
    if (priceMatch && currentDuration !== null) {
      const price = parseInt(priceMatch[1].replace(/\s+/g, ''), 10);
      const slug = `${currentTitle}-${currentDuration}`
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      treatments.push({
        service_ref: `bd-${slug}`,
        title: currentTitle,
        duration_minutes: currentDuration,
        price_sek: Number.isNaN(price) ? null : price,
        description: descLines.join(' ').trim() || null,
      });
      currentTitle = null;
      currentDuration = null;
      descLines = [];
      continue;
    }

    // collect description text (skip images, links, tags, "Boka", "Friskvård")
    if (
      currentDuration !== null &&
      line.length > 20 &&
      !line.startsWith('#') &&
      !line.startsWith('![') &&
      !line.startsWith('[') &&
      !/^Boka$/i.test(line)
    ) {
      descLines.push(line);
    }
  }

  return treatments;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const access = await authorizeRun(req, supabase, JOB);
  if (access instanceof Response) return access;

  try {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) throw new Error('Automatisk hämtning är inte konfigurerad (FIRECRAWL_API_KEY saknas).');

    console.log(`Scraping treatments from Bokadirekt: ${BOKADIREKT_URL}`);

    const scrapeResponse = await fetch('https://api.firecrawl.dev/v2/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: BOKADIREKT_URL,
        formats: ['markdown'],
        onlyMainContent: true,
      }),
    });

    const scrapeData = await scrapeResponse.json();
    if (!scrapeResponse.ok) {
      throw new Error(`Firecrawl error: ${JSON.stringify(scrapeData)}`);
    }

    const markdown = scrapeData.data?.markdown || scrapeData.markdown || '';
    const parsed = parseTreatments(markdown);
    console.log(`Parsed ${parsed.length} treatments`);

    if (parsed.length === 0) {
      await finishRun(supabase, JOB, { success: true, count: 0 });
      return respond({ success: true, message: 'No treatments parsed', count: 0 });
    }

    const rows = parsed.map((p) => ({
      ...p,
      source_url: BOKADIREKT_URL,
      last_synced_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('treatments')
      .upsert(rows, { onConflict: 'service_ref' });

    if (error) throw new Error(`Database error: ${error.message}`);

    await finishRun(supabase, JOB, { success: true, count: rows.length });
    return respond({ success: true, count: rows.length, treatments: rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error:', message);
    await finishRun(supabase, JOB, { success: false, error: message.slice(0, 300) });
    return respond({ success: false, error: access.admin ? message : 'Hämtningen misslyckades.' }, 500);
  }
});

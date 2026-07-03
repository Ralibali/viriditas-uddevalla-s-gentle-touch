import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

  try {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) throw new Error('FIRECRAWL_API_KEY not configured');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
      return new Response(
        JSON.stringify({ success: true, message: 'No treatments parsed', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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

    return new Response(JSON.stringify({ success: true, count: rows.length, treatments: rows }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error:', message);
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

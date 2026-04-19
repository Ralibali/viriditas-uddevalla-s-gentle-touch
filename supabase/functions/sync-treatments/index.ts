import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Peach activity IDs to sync
const ACTIVITIES = [
  { peach_id: 'RAj5XBly6CCiiUTuCR3d', fallback_title: 'Återhämtningsmassage' },
  { peach_id: 'i8ZRmDih1m38czfIeJIq', fallback_title: 'Klassisk massage 45 min' },
  { peach_id: 'QazTNm4OmAb1ccXwks5D', fallback_title: 'Klassisk massage 60 min' },
];

interface ParsedTreatment {
  title: string;
  duration_minutes: number | null;
  price_sek: number | null;
  description: string | null;
}

function parseTreatment(markdown: string, fallbackTitle: string): ParsedTreatment {
  // Title: first H1
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : fallbackTitle;

  // Price: e.g. "100 kr" or "650 kr"
  const priceMatch = markdown.match(/(\d{2,5})\s*kr/i);
  const price_sek = priceMatch ? parseInt(priceMatch[1], 10) : null;

  // Duration: e.g. "60 min" or "45 min"
  const durationMatch = markdown.match(/(\d{1,3})\s*min\b/i);
  const duration_minutes = durationMatch ? parseInt(durationMatch[1], 10) : null;

  // Description: paragraph that comes after the price/duration block, before "Read more"
  // Look for a sentence ending with "Välkommen!" or just first long line after duration
  let description: string | null = null;
  const lines = markdown.split('\n').map((l) => l.trim());
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.length > 60 && !line.startsWith('#') && !line.startsWith('![') && !line.startsWith('[')) {
      description = line;
      break;
    }
  }

  return { title, duration_minutes, price_sek, description };
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

    const results: Array<Record<string, unknown>> = [];

    for (const activity of ACTIVITIES) {
      const url = `https://peach.nu/activities/${activity.peach_id}`;
      console.log(`Scraping ${url}`);

      const scrapeResponse = await fetch('https://api.firecrawl.dev/v2/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          formats: ['markdown'],
          onlyMainContent: true,
        }),
      });

      const scrapeData = await scrapeResponse.json();
      if (!scrapeResponse.ok) {
        console.error(`Firecrawl error for ${activity.peach_id}:`, scrapeData);
        results.push({ peach_id: activity.peach_id, success: false, error: scrapeData });
        continue;
      }

      const markdown = scrapeData.data?.markdown || scrapeData.markdown || '';
      const parsed = parseTreatment(markdown, activity.fallback_title);
      console.log(`Parsed for ${activity.peach_id}:`, parsed);

      const { error } = await supabase
        .from('treatments')
        .upsert(
          {
            peach_id: activity.peach_id,
            title: parsed.title,
            duration_minutes: parsed.duration_minutes,
            price_sek: parsed.price_sek,
            description: parsed.description,
            source_url: url,
            last_synced_at: new Date().toISOString(),
          },
          { onConflict: 'peach_id' }
        );

      if (error) {
        console.error(`DB error for ${activity.peach_id}:`, error);
        results.push({ peach_id: activity.peach_id, success: false, error: error.message });
      } else {
        results.push({ peach_id: activity.peach_id, success: true, ...parsed });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
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

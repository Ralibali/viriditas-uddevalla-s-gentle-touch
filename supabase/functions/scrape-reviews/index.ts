import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.99.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cms-session',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const JOB = 'scrape-reviews';
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
    if (!apiKey) {
      throw new Error('Automatisk hämtning är inte konfigurerad (FIRECRAWL_API_KEY saknas).');
    }

    console.log('Scraping reviews from Bokadirekt...');

    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://www.bokadirekt.se/places/viriditas-massage-136924',
        formats: ['markdown'],
        onlyMainContent: true,
      }),
    });

    const scrapeData = await scrapeResponse.json();
    if (!scrapeResponse.ok) {
      throw new Error(`Firecrawl error: ${JSON.stringify(scrapeData)}`);
    }

    const markdown = scrapeData.data?.markdown || scrapeData.markdown || '';
    console.log('Scraped markdown length:', markdown.length);

    const { reviews, aggregate } = parseReviews(markdown);
    console.log(`Parsed ${reviews.length} reviews, aggregate:`, aggregate);

    // Persist aggregate rating + count to site_settings (used by hero + JSON-LD)
    if (aggregate.rating !== null && aggregate.count !== null) {
      await supabase.from('site_settings').upsert(
        [
          { setting_key: 'review_rating_value', setting_value: aggregate.rating.toString() },
          { setting_key: 'review_count', setting_value: aggregate.count.toString() },
        ],
        { onConflict: 'setting_key' }
      );
    }

    if (reviews.length === 0) {
      await finishRun(supabase, JOB, { success: true, count: 0, aggregate });
      return respond({ success: true, message: 'No reviews found to update', count: 0, aggregate });
    }

    const { error } = await supabase
      .from('reviews')
      .upsert(reviews, { onConflict: 'reviewer_name,review_date' });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    console.log(`Successfully upserted ${reviews.length} reviews`);
    await finishRun(supabase, JOB, { success: true, count: reviews.length, aggregate });
    return respond({ success: true, count: reviews.length, aggregate });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error:', message);
    await finishRun(supabase, JOB, { success: false, error: message.slice(0, 300) });
    return respond({ success: false, error: access.admin ? message : 'Hämtningen misslyckades.' }, 500);
  }
});

function parseReviews(markdown: string): {
  reviews: Array<{
    reviewer_name: string;
    rating: number;
    review_text: string | null;
    review_date: string;
  }>;
  aggregate: { rating: number | null; count: number | null };
} {
  const reviews: Array<{
    reviewer_name: string;
    rating: number;
    review_text: string | null;
    review_date: string;
  }> = [];

  // Aggregate rating from header, e.g. "## 4.8" then "(28 omdömen)" / "(28 reviews)"
  let aggRating: number | null = null;
  let aggCount: number | null = null;
  const aggMatch = markdown.match(/##\s+(\d+(?:[.,]\d+)?)[\s\S]{0,80}?\((\d+)\s*(?:omdöme|omdömen|reviews?)\)/i);
  if (aggMatch) {
    aggRating = parseFloat(aggMatch[1].replace(',', '.'));
    aggCount = parseInt(aggMatch[2], 10);
  }

  // Keep ALL lines (including blanks) so we can preserve newlines inside multi-line review texts
  const rawLines = markdown.split('\n').map((l) => l.trim());

  const SWEDISH_DAYS = /(mån|tis|ons|tors|fre|lör|sön)/i;
  const SWEDISH_MONTHS = /(jan|feb|mars|apr|maj|jun|jul|aug|sep|okt|nov|dec)/i;

  // New Bokadirekt format is English, e.g. "Fri, Jun 19", "Wed, May 13"
  const EN_DAYS: Record<string, string> = {
    mon: 'mån', tue: 'tis', wed: 'ons', thu: 'tors', fri: 'fre', sat: 'lör', sun: 'sön',
  };
  const EN_MONTHS: Record<string, string> = {
    jan: 'jan.', feb: 'feb.', mar: 'mars', apr: 'apr.', may: 'maj', jun: 'juni',
    jul: 'juli', aug: 'aug.', sep: 'sep.', oct: 'okt.', nov: 'nov.', dec: 'dec.',
  };
  const englishDateRe = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})$/i;

  const isDateLine = (s: string) =>
    (SWEDISH_DAYS.test(s) && SWEDISH_MONTHS.test(s)) || englishDateRe.test(s);

  // Normalize an English date line to the existing Swedish format ("fre 19 juni")
  const normalizeDate = (s: string): string => {
    const m = s.match(englishDateRe);
    if (!m) return s;
    const day = EN_DAYS[m[1].toLowerCase()] ?? m[1].toLowerCase();
    const month = EN_MONTHS[m[2].toLowerCase()] ?? m[2].toLowerCase();
    return `${day} ${m[3]} ${month}`;
  };

  for (let i = 0; i < rawLines.length; i++) {
    const ratingMatch = rawLines[i].match(/^(\d)\/5$/);
    if (!ratingMatch) continue;
    const rating = parseInt(ratingMatch[1], 10);

    // Find the date line within the next few non-empty lines
    let dateIdx = -1;
    for (let j = i + 1; j < Math.min(i + 4, rawLines.length); j++) {
      if (rawLines[j] && isDateLine(rawLines[j])) {
        dateIdx = j;
        break;
      }
    }
    if (dateIdx === -1) continue;
    const date = normalizeDate(rawLines[dateIdx]);

    // Now find the "— Name" line. Scan up to 30 lines ahead (multi-line text + blank lines).
    let nameIdx = -1;
    let reviewerName: string | null = null;
    for (let j = dateIdx + 1; j < Math.min(dateIdx + 30, rawLines.length); j++) {
      // Stop if we hit the next rating block — means no name found
      if (/^\d\/5$/.test(rawLines[j])) break;
      const nameMatch = rawLines[j].match(/^—\s*(.+)$/);
      if (nameMatch) {
        reviewerName = nameMatch[1].trim();
        nameIdx = j;
        break;
      }
    }
    if (!reviewerName || nameIdx === -1) continue;

    // Review text = everything between date and name, joined with newlines, trimmed
    const textLines = rawLines.slice(dateIdx + 1, nameIdx).filter((l) => l.length > 0);
    const reviewText = textLines.length > 0 ? textLines.join('\n').trim() : null;

    reviews.push({
      reviewer_name: reviewerName,
      rating,
      review_text: reviewText,
      review_date: date,
    });

    i = nameIdx;
  }

  return { reviews, aggregate: { rating: aggRating, count: aggCount } };
}

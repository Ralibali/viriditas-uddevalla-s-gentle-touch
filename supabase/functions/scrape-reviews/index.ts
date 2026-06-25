import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      throw new Error('FIRECRAWL_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Scraping reviews from Peach...');

    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/reviews',
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
          { setting_key: 'peach_rating_value', setting_value: aggregate.rating.toString() },
          { setting_key: 'peach_review_count', setting_value: aggregate.count.toString() },
        ],
        { onConflict: 'setting_key' }
      );
    }

    if (reviews.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No reviews found to update', count: 0, aggregate }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { error } = await supabase
      .from('reviews')
      .upsert(reviews, { onConflict: 'reviewer_name,review_date' });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    console.log(`Successfully upserted ${reviews.length} reviews`);

    return new Response(
      JSON.stringify({ success: true, count: reviews.length, aggregate }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
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

  // Parse aggregate rating from header: "## 4.7" followed by "(17reviews)" or "(17 reviews)"
  let aggRating: number | null = null;
  let aggCount: number | null = null;
  const aggMatch = markdown.match(/##\s+(\d+(?:[.,]\d+)?)[\s\S]{0,80}?\((\d+)\s*reviews?\)/i);
  if (aggMatch) {
    aggRating = parseFloat(aggMatch[1].replace(',', '.'));
    aggCount = parseInt(aggMatch[2], 10);
  }

  // Keep ALL lines (including blanks) so we can preserve newlines inside multi-line review texts
  const rawLines = markdown.split('\n').map((l) => l.trim());

  const SWEDISH_DAYS = /(mån|tis|ons|tors|fre|lör|sön)/i;
  const SWEDISH_MONTHS = /(jan|feb|mars|apr|maj|jun|jul|aug|sep|okt|nov|dec)/i;

  // New Peach format is English, e.g. "Fri, Jun 19", "Wed, May 13"
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

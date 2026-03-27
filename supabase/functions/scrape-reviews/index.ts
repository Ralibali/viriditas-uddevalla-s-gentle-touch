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

    // Parse reviews from the markdown
    const reviews = parseReviews(markdown);
    console.log(`Parsed ${reviews.length} reviews`);

    if (reviews.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No reviews found to update', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Upsert reviews
    const { error } = await supabase
      .from('reviews')
      .upsert(reviews, { onConflict: 'reviewer_name,review_date' });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    console.log(`Successfully upserted ${reviews.length} reviews`);

    return new Response(
      JSON.stringify({ success: true, count: reviews.length }),
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

function parseReviews(markdown: string) {
  const reviews: Array<{
    reviewer_name: string;
    rating: number;
    review_text: string | null;
    review_date: string;
  }> = [];

  const lines = markdown.split('\n').map(l => l.trim()).filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    // Look for rating pattern like "5/5" or "4/5"
    const ratingMatch = lines[i].match(/^(\d)\/5$/);
    if (!ratingMatch) continue;

    const rating = parseInt(ratingMatch[1]);

    // Next line should be the date
    if (i + 1 >= lines.length) continue;
    const date = lines[i + 1];

    // Check if date looks like a date (contains Swedish day abbreviations or month names)
    if (!date.match(/(mån|tis|ons|tors|fre|lör|sön|jan|feb|mars|apr|maj|jun|jul|aug|sep|okt|nov|dec)/i)) continue;

    // Look for review text and reviewer name
    let reviewText: string | null = null;
    let reviewerName: string | null = null;

    // Check subsequent lines for "— Name" pattern
    for (let j = i + 2; j < Math.min(i + 5, lines.length); j++) {
      const nameMatch = lines[j].match(/^—\s*(.+)$/);
      if (nameMatch) {
        reviewerName = nameMatch[1].trim();
        // If there's a line between the date and the name, it's the review text
        if (j > i + 2) {
          reviewText = lines.slice(i + 2, j).join(' ').trim();
        }
        break;
      }
    }

    if (reviewerName) {
      reviews.push({
        reviewer_name: reviewerName,
        rating,
        review_text: reviewText || null,
        review_date: date,
      });
    }
  }

  return reviews;
}

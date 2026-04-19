import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SCHEDULE_URL = 'https://peach.nu/c/GOaYeiFjzzOBbtOPK0wZ/schedule';

interface Slot {
  booking_id: string;
  activity_peach_id: string | null;
  activity_title: string;
  starts_at: string; // ISO
  location: string | null;
  price_sek: number | null;
  booking_url: string;
}

const MONTHS_SV: Record<string, number> = {
  'jan': 1, 'jan.': 1, 'januari': 1,
  'feb': 2, 'feb.': 2, 'februari': 2,
  'mars': 3, 'mar': 3, 'mar.': 3,
  'apr': 4, 'apr.': 4, 'april': 4,
  'maj': 5,
  'jun': 6, 'jun.': 6, 'juni': 6,
  'jul': 7, 'jul.': 7, 'juli': 7,
  'aug': 8, 'aug.': 8, 'augusti': 8,
  'sep': 9, 'sep.': 9, 'sept': 9, 'sept.': 9, 'september': 9,
  'okt': 10, 'okt.': 10, 'oktober': 10,
  'nov': 11, 'nov.': 11, 'november': 11,
  'dec': 12, 'dec.': 12, 'december': 12,
};

// Convert "1:30 PM" -> {h:13, m:30}
function parse12h(timeStr: string): { h: number; m: number } | null {
  const m = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  const ap = m[3].toUpperCase();
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  return { h, m: mm };
}

// Build ISO string for Sweden timezone (handles DST: CET/CEST)
function toSwedenIso(year: number, month: number, day: number, h: number, m: number): string {
  // Determine DST offset for Sweden: last Sunday of March 01:00 UTC -> +02:00, last Sunday of October 01:00 UTC -> +01:00
  const lastSundayUtc = (y: number, mo: number) => {
    // mo: 1-12; find last Sunday at 01:00 UTC
    const d = new Date(Date.UTC(y, mo, 0)); // last day of month
    const day = d.getUTCDay(); // 0=Sun
    return new Date(Date.UTC(y, mo - 1, d.getUTCDate() - day, 1, 0, 0));
  };
  const dstStart = lastSundayUtc(year, 3);
  const dstEnd = lastSundayUtc(year, 10);
  // Build a tentative UTC instant assuming +02:00, check if DST applies
  const utcGuessSummer = new Date(Date.UTC(year, month - 1, day, h - 2, m, 0));
  const isDst = utcGuessSummer >= dstStart && utcGuessSummer < dstEnd;
  const offset = isDst ? 2 : 1;
  const utc = new Date(Date.UTC(year, month - 1, day, h - offset, m, 0));
  return utc.toISOString();
}

function parseSchedule(markdown: string): Slot[] {
  const slots: Slot[] = [];
  const lines = markdown.split('\n');

  // Track current date heading. Pattern: "Fre 24 apr." or "Lör 9 maj" or "Tis 12 maj"
  // The heading lines are short and contain a Swedish day abbrev + day + month.
  const dayHeaderRe = /^(?:Mån|Tis|Ons|Tors|Fre|Lör|Sön)\s+(\d{1,2})\s+([A-Za-zåäöÅÄÖ.]+)/;

  let currentMonth: number | null = null;
  let currentDay: number | null = null;
  let currentYear = new Date().getUTCFullYear();
  // If parsed month is earlier than today's month, assume next year
  const todayMonth = new Date().getUTCMonth() + 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const headerMatch = line.match(dayHeaderRe);
    if (headerMatch) {
      currentDay = parseInt(headerMatch[1], 10);
      const monthKey = headerMatch[2].toLowerCase();
      currentMonth = MONTHS_SV[monthKey] ?? null;
      if (currentMonth && currentMonth < todayMonth) currentYear = new Date().getUTCFullYear() + 1;
      else currentYear = new Date().getUTCFullYear();
      continue;
    }

    // Activity card: starts with "[![Title](imgurl)\\" — but markdown is folded,
    // so look for a line like "[![<title>](" — title is between '[' after '!' and '](':
    const titleMatch = line.match(/^\[!\[([^\]]+)\]\(/);
    if (!titleMatch || currentMonth === null || currentDay === null) continue;
    const title = titleMatch[1].trim();

    // The next several lines (within ~12) contain time, location, price, then a closing ](activityUrl)
    // and then a "[Book](https://peach.nu/p/class/<id>)"
    let timeStr: string | null = null;
    let location: string | null = null;
    let price: number | null = null;
    let activityUrl: string | null = null;
    let bookingUrl: string | null = null;

    for (let j = i + 1; j < Math.min(i + 25, lines.length); j++) {
      const l = lines[j].trim();
      if (!timeStr) {
        const tm = l.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))\s*GMT[^·]*·\s*(.+?)\\?\\?$/i);
        if (tm) {
          timeStr = tm[1];
          location = tm[2].replace(/\\$/g, '').trim();
          continue;
        }
      }
      if (price === null) {
        const pm = l.match(/(\d{2,5})\s*kr/i);
        if (pm && !l.startsWith('[!')) price = parseInt(pm[1], 10);
      }
      // Activity URL is at end of card: "...](https://peach.nu/activities/<id>)"
      const au = l.match(/\]\((https:\/\/peach\.nu\/activities\/([A-Za-z0-9_-]+))\)/);
      if (au && !activityUrl) {
        activityUrl = au[2];
      }
      const bm = l.match(/\[Book\]\((https:\/\/peach\.nu\/p\/class\/([A-Za-z0-9_-]+))\)/);
      if (bm) {
        bookingUrl = bm[1];
        // booking_id = path id
        const bookingId = bm[2];
        if (timeStr) {
          const t = parse12h(timeStr);
          if (t) {
            const startsAt = toSwedenIso(currentYear, currentMonth, currentDay, t.h, t.m);
            slots.push({
              booking_id: bookingId,
              activity_peach_id: activityUrl,
              activity_title: title,
              starts_at: startsAt,
              location,
              price_sek: price,
              booking_url: bookingUrl,
            });
          }
        }
        i = j; // jump ahead
        break;
      }
    }
  }

  return slots;
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

    console.log('Scraping schedule from Peach...');
    const scrapeResponse = await fetch('https://api.firecrawl.dev/v2/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: SCHEDULE_URL,
        formats: ['markdown'],
        onlyMainContent: true,
      }),
    });
    const scrapeData = await scrapeResponse.json();
    if (!scrapeResponse.ok) {
      throw new Error(`Firecrawl error: ${JSON.stringify(scrapeData)}`);
    }
    const markdown = scrapeData.data?.markdown || scrapeData.markdown || '';
    console.log('Markdown length:', markdown.length);

    const slots = parseSchedule(markdown);
    console.log(`Parsed ${slots.length} slots`);

    if (slots.length > 0) {
      const { error: upsertErr } = await supabase
        .from('schedule_slots')
        .upsert(slots, { onConflict: 'booking_id' });
      if (upsertErr) throw new Error(`Upsert error: ${upsertErr.message}`);

      // Remove past slots (older than yesterday) and any future slot not in the latest sync
      const bookingIds = slots.map((s) => s.booking_id);
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { error: delErr } = await supabase
        .from('schedule_slots')
        .delete()
        .or(`starts_at.lt.${cutoff},and(starts_at.gte.${cutoff},booking_id.not.in.(${bookingIds.join(',')}))`);
      if (delErr) console.error('Cleanup error:', delErr);
    }

    return new Response(JSON.stringify({ success: true, count: slots.length, slots: slots.slice(0, 5) }), {
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

# Viriditas massage – Uddevalla

Webbplats och administration för Viriditas, Andreas Håmans massagesalong i Uddevalla Folkets Hus. Publik adress: https://viriditasmassage.se.

## Administrationen

Administrationen finns på `/admin` (och `/dashboard`). Inloggning sker med ett lösenord som kontrolleras på servern; det finns aldrig i frontendkoden. Kunden kan byta det under **Åtkomst & hjälp**, vilket avslutar tidigare sessioner. Sessioner upphör efter åtta timmar och inloggningsförsök begränsas.

| Flik | Innehåll |
| --- | --- |
| Översikt | Klick på boka senaste veckan, betyget hos Bokadirekt, publicerade sidor och saker som behöver göras. |
| Meddelanden | Visas när ett formulär har skickat något. Svara med e-post, markera som hanterat eller ta bort. Raderas automatiskt efter tolv månader. |
| Innehåll | Texter, bilder, länkar, frågor och svar, sökinformation och synliga sektioner på webbplatsens sidor. |
| Statistik | Klick på bokning och kontakt. Klick visar intresse; genomförda bokningar finns i Bokadirekt. |
| Sidor | Egna artiklar och sidor med block, utkast, förhandsgranskning och menyval. |
| Omdömen | Omdömen från Bokadirekt. Välj vilka som visas på webbplatsen och vilka som visas först. Hämta nya med en knapp. |
| Priser | Jämför priserna på webbplatsen med Bokadirekt och uppdatera dem med ett klick. |
| Inställningar | Kontaktuppgifter, bokningslänk och behandlingspriser för hela webbplatsen. |
| Åtkomst & hjälp | Byt lösenord, ladda ner säkerhetskopia av innehållet och en kort guide. |

Ett bortglömt lösenord återställs av en serveradministratör (ny hash i `cms_private.credentials`), inte via en publik funktion. Grundtexternas prisuppgifter följer de gemensamma priserna; en text som redigerats separat är en egen formulering och behöver uppdateras om den innehåller ett pris.

## Teknik

- Vite, React 18, TypeScript, Tailwind CSS och TanStack Query.
- Supabase: Postgres med radnivåsäkerhet, Edge Functions (Deno) och Storage för bilder.
- `npm run build` bygger webbplatsen och förrenderar sidorna till statisk HTML med Puppeteer (`scripts/prerender.mjs`), inklusive `sitemap.xml` med publicerade sidor. Publikt innehåll läses från databasen vid besök, så kundens ändringar syns utan ny publicering.

### Edge Functions

| Funktion | Uppgift | JWT |
| --- | --- | --- |
| `cms-admin` | Inloggning, sessioner och allt i administrationen. | Av (egna sessioner) |
| `scrape-reviews` | Hämtar omdömen och betyg från Bokadirekt via Firecrawl. | På |
| `sync-treatments` | Hämtar behandlingar och priser från Bokadirekt via Firecrawl. | På |
| `contact-form` | Tar emot formulär för frågor och presentkort, med begränsning av antal och valfri e-postavisering via Resend. Förberedd; webbplatsen har inga sådana formulär ännu. | Av (publik) |

Hämtningarna från Bokadirekt kan köras högst var sjätte timme av schemat och en gång i minuten av en inloggad administratör, så att Firecrawl-krediter inte kan förbrukas utifrån.

## Utveckling

```sh
npm ci
npm run dev          # http://localhost:8080
```

Utan inställningar används Viriditas Supabase-projekt. För ett annat projekt: kopiera `.env.example` till `.env` och fyll i adressen och den publika nyckeln.

### Kontroller

```sh
npm run typecheck    # TypeScript
npm run lint         # ESLint
npm test             # Vitest
npm run test:db      # alla migrationer och SQL-tester i en lokal Postgres (PGlite)
npm run build        # bygge och förrendering
deno check supabase/functions/*/index.ts
deno test supabase/functions/tests/
```

Samma kontroller körs i GitHub Actions vid varje push till main och varje pull request.

## Publicering

Frontend och backend publiceras var för sig. En push till GitHub uppdaterar inte databasen eller funktionerna.

1. **Databas.** Kör `supabase db push` mot projektet. Nya migrationer:
   `20261014150000_contact_messages.sql` (meddelanden och begränsning av formulär),
   `20261014150100_review_moderation_and_click_limits.sql` (dolda och framhävda omdömen, regler för klickstatistik),
   `20261014150200_server_job_runs.sql` (logg och spärr för hämtningarna) och
   `20261015090000_privacy_text_without_platform_name.sql` (integritetstexten).
   Ett nytt adminlösenord provisioneras separat i `cms_private.credentials`; inget standardlösenord finns i repot.
2. **Funktioner.** `supabase functions deploy cms-admin scrape-reviews sync-treatments` (och `contact-form` när formulär läggs till).
3. **Hemligheter.** `supabase secrets set FIRECRAWL_API_KEY=…`. För e-post från formulär: `RESEND_API_KEY`, `CONTACT_NOTIFY_EMAIL` och `CONTACT_FROM_EMAIL`.
4. **Schema.** Kör hämtningarna regelbundet, till exempel var sjätte timme (SQL-editorn i Supabase):
   ```sql
   select cron.schedule('viriditas-reviews', '10 */6 * * *', $$
     select net.http_post(
       url := 'https://rrnlxpdxbyzclhkwnkal.supabase.co/functions/v1/scrape-reviews',
       headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer <publik anon-nyckel>'),
       body := '{}'::jsonb)
   $$);
   select cron.schedule('viriditas-treatments', '40 */6 * * *', $$
     select net.http_post(
       url := 'https://rrnlxpdxbyzclhkwnkal.supabase.co/functions/v1/sync-treatments',
       headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer <publik anon-nyckel>'),
       body := '{}'::jsonb)
   $$);
   ```
   Finns det redan scheman (`select * from cron.job`) behöver de inte läggas till igen.
5. **Frontend.** `npm run build` och publicera `dist/`. Okända adresser ska falla tillbaka till `index.html`.
6. **Kontroll.** Logga in på `/admin`, spara en text och ladda om, dölj och visa ett omdöme, hämta omdömen och priser, och gå igenom webbplatsen.

Domän, hostingkonto och Bokadirekt-konto överlåts separat från webbplatsens adminlösenord.

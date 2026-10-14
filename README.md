# Viriditas massage – Uddevalla

Webbplats och administration för Viriditas, Andreas Håmans massagesalong i Uddevalla Folkets Hus. Publik adress: https://viriditasmassage.se.

## Webbplatsen

- **Startsida** med behandlingar och priser, återhämtningsmassage, omdömen från Bokadirekt, friskvårdsbidrag, presentkort, kontakt med karta, frågor och svar.
- **Om Andreas** och sidor för klassisk massage, avslappningsmassage, nackspänning, friskvårdsbidrag och Ljungskile.
- **Kunskapsbank** med artiklar som skrivs i administrationen (`/kunskapsbank`, `/p/<adress>`).
- **Formulär** för frågor och presentkortsbeställningar. Meddelandena sparas i databasen och kan skickas vidare med e-post.
- Bokning sker hos Bokadirekt. Klick på boka, ring och mejla räknas för statistiken när besökaren har sagt ja till statistik.

Formen bygger på salongens namn: ordet *viriditas* i punktskrift som präglade gröna pärlor, Fraunces för rubriker och Atkinson Hyperlegible Next för brödtext. Typsnitten ligger på webbplatsen själv (`public/fonts`, SIL Open Font License). Inga animationer vid scroll; den enda rörelsen är när sidans rubrik glider fram och punktskriften trycks in.

## Administrationen

Administrationen finns på `/admin` (och `/dashboard`). Inloggning sker med ett lösenord som kontrolleras på servern; det finns aldrig i frontendkoden. Sessioner upphör efter åtta timmar och inloggningsförsök begränsas.

| Flik | Innehåll |
| --- | --- |
| Översikt | Nya meddelanden, klick på boka senaste veckan, betyget och en lista över saker att göra. |
| Meddelanden | Frågor och presentkortsbeställningar. Svara med e-post, markera som hanterade eller ta bort. Raderas automatiskt efter tolv månader. |
| Innehåll | Texter, bilder, länkar och synliga sektioner på varje sida. Ändrade fält markeras och kan ångras innan de sparas. |
| Sidor | Artiklar och egna sidor byggda av block (rubrik, text, bild, lista, citat, frågor och svar, knapp, film). Utkast, förhandsgranskning och publicering. |
| Omdömen | Omdömen från Bokadirekt. Välj vilka som visas och vilka som visas först. Hämta nya med en knapp. |
| Priser | Jämför priserna på webbplatsen med Bokadirekt och uppdatera dem med ett klick. |
| Statistik | Klick på boka, samtal och mejl per dag och per plats på webbplatsen, för 7, 30 eller 90 dagar. |
| Inställningar | Kontaktuppgifter, adress, bokningslänk, karta, delningsbild och priser för hela webbplatsen. |
| Åtkomst & hjälp | Byt lösenord, ladda ner säkerhetskopia och en kort guide. |

Ett bortglömt lösenord återställs av en serveradministratör (ny hash i `cms_private.credentials`), inte via en publik funktion.

## Teknik

- Vite 5, React 18, TypeScript, Tailwind CSS 3, TanStack Query, lucide-ikoner.
- Supabase: Postgres med radnivåsäkerhet, Edge Functions (Deno) och Storage för bilder. Frontend pratar direkt med PostgREST för publika data; allt som kräver inloggning går genom funktionen `cms-admin`.
- Varje sida har sina texter definierade i `src/content/`. Standardtexterna ligger i koden och kundens ändringar i tabellen `site_settings`, så äldre sparade ändringar fortsätter att gälla.
- `npm run build` bygger webbplatsen och förrenderar varje sida till statisk HTML med Puppeteer (`scripts/prerender.mjs`), inklusive `sitemap.xml` med publicerade artiklar.

### Edge Functions

| Funktion | Uppgift | JWT |
| --- | --- | --- |
| `cms-admin` | Inloggning, sessioner och allt i administrationen. | Av (egna sessioner) |
| `contact-form` | Tar emot formulären, validerar, begränsar antal och skickar e-post via Resend om det är inställt. | Av (publik) |
| `scrape-reviews` | Hämtar omdömen och betyg från Bokadirekt via Firecrawl. | På |
| `sync-treatments` | Hämtar behandlingar och priser från Bokadirekt via Firecrawl. | På |

Hämtningarna kan köras högst var sjätte timme av schemat och en gång i minuten av en inloggad administratör, så att Firecrawl-krediter inte kan förbrukas utifrån.

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
npm test             # Vitest: innehåll, admin, formulär, statistik
npm run test:db      # alla migrationer och SQL-tester i en lokal Postgres (PGlite)
npm run build        # bygge och förrendering
deno check supabase/functions/*/index.ts
deno test supabase/functions/tests/
```

Samma kontroller körs i GitHub Actions vid varje pull request.

## Publicering

Frontend och backend publiceras var för sig. En push till GitHub uppdaterar inte databasen eller funktionerna.

1. **Databas.** Kör `supabase db push` mot projektet. Nya i den här versionen:
   `20261014150000_contact_messages.sql` (meddelanden och begränsning av formulär),
   `20261014150100_review_moderation_and_click_limits.sql` (dolda och framhävda omdömen) och
   `20261014150200_server_job_runs.sql` (logg och spärr för hämtningarna).
2. **Funktioner.** `supabase functions deploy cms-admin contact-form scrape-reviews sync-treatments`
3. **Hemligheter.**
   ```sh
   supabase secrets set FIRECRAWL_API_KEY=…
   # Valfritt, för e-post när någon skickar ett formulär:
   supabase secrets set RESEND_API_KEY=… CONTACT_NOTIFY_EMAIL=… CONTACT_FROM_EMAIL="Viriditas <webb@viriditasmassage.se>"
   ```
   Utan Resend sparas meddelandena ändå och visas under Meddelanden. Utan `CONTACT_NOTIFY_EMAIL` skickas e-posten till adressen under Inställningar.
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
   Finns det redan scheman från tidigare (`select * from cron.job`) behöver de inte läggas till igen.
5. **Frontend.** `npm run build` och publicera `dist/`. Okända adresser ska falla tillbaka till `index.html` (single page app).
6. **Kontroll efter publicering.** Logga in på `/admin`, spara en text och ladda om, skicka en fråga från startsidan och se att den kommer in under Meddelanden, hämta omdömen och priser, och dela startsidan i en chatt för att se delningsbilden.

## Integritet

- Statistik och Google Analytics används bara efter samtycke. Valet kan ändras via Cookieinställningar i sidfoten.
- Meddelanden från formulären sparas i ett privat schema som bara servern når och raderas efter tolv månader. IP-adresser sparas aldrig i klartext, bara som hash för begränsningen av antal.
- Kartan från Google laddas först när besökaren väljer att visa den.
- Se `docs/analytics-ga4.md` för detaljer om Google Analytics.

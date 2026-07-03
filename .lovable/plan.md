# SEO till topp 1 – implementeringsplan

Grunden är redan stark (schema, meta/OG, geo, robots, llms.txt, SeoHead per route). Den här planen stänger de fyra kodbara gapen i din analys. Off-page (Google Business Profile, citations, lokala länkar, GSC) är inte kod och ligger utanför planen – men det är den checklistan som i praktiken avgör "massage Uddevalla", så prioritera den parallellt.

Jag delar upp i två leveranser, precis som dina prompts.

---

## Leverans 1 – Prerendering + on-page-fixar

### 1. Build-time prerendering (störst teknisk effekt)
- Lägg till `puppeteer` som devDependency.
- Skapa `scripts/prerender.mjs` som körs efter `vite build`:
  - Serverar `dist/` lokalt (statisk server på en ledig port).
  - Hämtar alla publicerade slugs från `site_pages` via anon-klienten.
  - Routelista: `/`, `/om-andreas`, `/klassisk-massage`, de fyra nya landningssidorna (leverans 2), samt `/p/<slug>` för varje publicerad CMS-sida.
  - Kör Puppeteer mot varje route, väntar på `networkidle0` så Bokadirekt-betyg + CMS-innehåll hinner in i DOM:en, sparar färdig HTML till `dist/<route>/index.html`.
- Lägg `"postbuild": "node scripts/prerender.mjs"` i `package.json`.

**Riskflagga:** prerender körs i build-miljön och kräver att Chromium kan startas där. Om postbuild inte kan köra Puppeteer i hostingens build faller vi tillbaka på att behålla SPA + säkerställa att SeoHead/JSON-LD är korrekt (mindre effekt). Jag verifierar att build går igenom innan jag markerar klart.

### 2. H1 med huvudnyckelord på startsidan
- Ändra `hero_title`-default till **"Massage i Uddevalla"** och `hero_subtitle` till **"– hos Uddevallas blinde massör Andreas Håman"**.
- CMS-overriden via `t()` lämnas orörd – defaults ändras bara.

### 3. Dynamisk sitemap
- Generera `sitemap.xml` direkt i prerender-scriptet och skriv till `dist/` (enklare än edge-routing till `/sitemap.xml`).
- Inkluderar statiska sidor + alla publicerade `site_pages` med `updated_at` som `lastmod`. Då hamnar nya CMS-sidor automatiskt i sitemapen.
- Den manuella `public/sitemap.xml` ersätts av den genererade i build.

### 4. OG-bild på egen domän
- Ladda ner nuvarande externa r2.dev-bild, lägg som `public/og-image.jpg` (1200×630).
- Uppdatera `index.html` och `SeoHead.DEFAULT_OG_IMAGE` till `https://viriditasmassage.se/og-image.jpg`.

### 5. "Kunskapsbank" i Footer
- Ny sektion i `Footer.tsx` som listar publicerade `site_pages` (titel + länk till `/p/<slug>`) → interna länkar från alla sidor till artiklarna.

---

## Leverans 2 – Innehållsutbyggnad (efter leverans 1)

Fyra nya **statiska routes**, samma designspråk som `/klassisk-massage`, var och en med SeoHead, Service-schema, FAQPage-schema, BreadcrumbList-schema, egen canonical, unik H1 med nyckelord, 500–800 ord naturlig svensk text, 3–4 FAQ, intern länkning till boka-CTA och till varandra:

1. `/avslappningsmassage-uddevalla` – stress, sömn, återhämtning
2. `/massage-mot-nackspanning` – nacke/axlar/spänningshuvudvärk, kontorsmålgrupp
3. `/friskvardsbidrag-massage-uddevalla` – hur friskvårdsbidraget funkar, kvitto, arbetsgivarportaler
4. `/massage-ljungskile` – ortssida, restid, parkering vid Folkets Hus

- Registreras i `App.tsx`, läggs till i prerender-routelistan och i sitemap-genereringen.

---

## Tekniska detaljer
- Filer: `scripts/prerender.mjs` (ny), `package.json` (postbuild + puppeteer), `src/components/SeoHead.tsx`, `src/components/Footer.tsx`, `src/pages/Index.tsx` (hero defaults), `public/og-image.jpg` (ny), 4 nya sidor under `src/pages/`, `public/sitemap.xml` (ersätts av build-output).
- Prerender hämtar `site_pages` med samma filter som appen (`is_published = true`).
- Inga DB-migrationer behövs.

## Utanför kod (gör parallellt – avgör local pack)
Google Business Profile (kategori "Massör", adress, öppettider, tjänster+priser, foton, bokningslänk), 20+ recensioner med text, NAP-citations (hitta.se, eniro, merinfo, ratsit, reco.se, Bokadirekt), lokala länkar (Folkets Hus, kommunens friskvårdslistor, Bohusläningen-pitch), GSC: skicka in sitemap + begär indexering.

---

Vill du att jag kör hela leverans 1 + 2 i en följd, eller leverans 1 först så du hinner verifiera att prerendern går igenom i build innan vi lägger på de nya sidorna?

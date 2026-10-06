# Viriditas Massage – Uddevalla

Webbplats för Viriditas och Andreas Håman. Publik adress: https://viriditasmassage.se.

## Kundens administration

Administration finns på `/admin` och `/dashboard`. Inloggning sker med ett gemensamt lösenord som kontrolleras på servern. Lösenordet finns inte i frontendkoden. Kunden kan byta det under **Åtkomst & hjälp**; bytet avslutar tidigare sessioner. Sessioner upphör efter åtta timmar och inloggningsförsök begränsas på servern.

- **Innehåll:** webbplatsens befintliga sidor, texter, bilder, länkar, frågor och svar, sökinformation samt synliga sektioner på startsidan.
- **Inställningar:** gemensamma kontaktuppgifter, bokningslänk och behandlingspriser.
- **Sidor:** egna artiklar och sidor med block, utkast, förhandsgranskning och menyval.
- **Bilder:** ladda upp och återanvänd bilder. Uppladdade bilder som används i sparat innehåll kan inte raderas.
- **Statistik:** klick på bokningsknappar; genomförda bokningar visas i Bokadirekt.
- **Åtkomst & hjälp:** lösenordsbyte, innehållsexport och kundguide. Exporten innehåller texter och bildadresser, inte bildfiler eller bokningsdata.

Grundtexternas prisuppgifter följer gemensamma priser. En text som kunden redigerat separat är en egen formulering och behöver uppdateras om den innehåller ett pris.

## Utveckling och kontroll

Vite, React 18, TypeScript, Tailwind och Supabase/Lovable Cloud.

```sh
npm ci
npm run dev
npm test
npx tsc --noEmit -p tsconfig.app.json
npm run build
```

Bygget skapar sidrenderingar och en sitemap för publicerade sidor. Publikt innehåll läses från databasen vid besök; kundens innehållsändringar behöver ingen frontendpublicering. Sparade statiska sidrenderingar behöver ett nytt bygge för att uppdateras.

## Publicering

Frontend och backend publiceras separat. En push till GitHub är inte ett bevis på att den publika sajten eller en Edge Function uppdaterats.

1. Tillämpa `supabase/migrations/20261006200458_customer_admin_handover.sql` på rätt databas. Den skapar privata sessionstabeller och funktioner för lösenordsinloggning, med åtkomst endast för `service_role`.
2. Provisionera initialt lösenord separat i `cms_private.credentials`; inget standardlösenord lagras i repot.
3. Publicera `supabase/functions/cms-admin/index.ts`. `verify_jwt=false` krävs eftersom funktionen verifierar sina egna slumpmässiga CMS-sessioner. Service-nyckeln används bara på servern.
4. Publicera frontend via projektets befintliga hosting.
5. Kontrollera `/admin`, fel lösenord, inloggning, sparning och omladdning, bildhantering samt lösenordsbyte och utloggning mot den publicerade versionen.

Återställ ett bortglömt adminlösenord genom en behörig serveradministratör, inte via en publik återställningsfunktion. Domän, hostingkonto och Bokadirekt-konto överlåts separat från webbplatsens adminlösenord.

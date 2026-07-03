# Viriditas Massage – Uddevalla

Webbplats för Viriditas, klassisk massage i Uddevalla med Andreas Håman, diplomerad massageterapeut. Adress: Uddevalla Folkets Hus, Göteborgsvägen 11B.

Live: <https://viriditasmassage.se>

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- React Router (BrowserRouter)
- Lovable Cloud (Supabase) – CMS-sidor, omdömen, bokningsklick, schedule sync
- Edge functions för CMS admin, Bokadirekt-synk och Firecrawl-omdömen

## Utveckling

```sh
npm install
npm run dev
```

## Deploy

Hostas via Lovable. Pushar till `main` deployar automatiskt.

## SEO

- `public/robots.txt` och `public/sitemap.xml` underhålls manuellt.
- All metadata sätts via `src/components/SeoHead.tsx` (title, description, canonical, robots, Open Graph, Twitter).
- Standardvärden för start/ej-renderade sökmotorbesök ligger i `index.html`.

// Build-time prerendering + sitemap generation.
// Runs after `vite build` (postbuild). Serves dist/ locally, renders every
// route with Puppeteer (waiting for networkidle0 so Peach rating + CMS
// content land in the DOM) and writes fully-rendered HTML to
// dist/<route>/index.html. Also writes dist/sitemap.xml.
//
// Failures here never break the build — we fall back to the plain SPA output.

import { createServer } from "node:http";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";

const DIST = "dist";
const BASE_URL = "https://viriditasmassage.se";

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || "https://rrnlxpdxbyzclhkwnkal.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybmx4cGR4Ynl6Y2xoa3dua2FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NTU4MDAsImV4cCI6MjA4OTIzMTgwMH0.ypjTZxvcedCxdkhIpiiWGc0HzCijayUaBExRFZch_lk";

const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/om-andreas", changefreq: "monthly", priority: "0.8" },
  { path: "/klassisk-massage", changefreq: "monthly", priority: "0.8" },
  { path: "/avslappningsmassage-uddevalla", changefreq: "monthly", priority: "0.8" },
  { path: "/massage-mot-nackspanning", changefreq: "monthly", priority: "0.8" },
  { path: "/friskvardsbidrag-massage-uddevalla", changefreq: "monthly", priority: "0.8" },
  { path: "/massage-ljungskile", changefreq: "monthly", priority: "0.8" },
];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

async function fetchPublishedPages() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/site_pages?select=slug,updated_at&is_published=eq.true`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      },
    );
    if (!res.ok) throw new Error(`status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("[prerender] could not fetch site_pages:", err.message);
    return [];
  }
}

function buildSitemap(entries) {
  const urls = entries
    .map((e) =>
      [
        "  <url>",
        `    <loc>${BASE_URL}${e.path}</loc>`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
        e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
        e.priority ? `    <priority>${e.priority}</priority>` : null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function startServer(indexHtml) {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      const ext = extname(urlPath);
      if (ext) {
        const filePath = join(DIST, urlPath);
        if (existsSync(filePath)) {
          const data = await readFile(filePath);
          res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
          res.end(data);
          return;
        }
        res.writeHead(404);
        res.end("not found");
        return;
      }
      // SPA route — serve index.html
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(indexHtml);
    } catch (err) {
      res.writeHead(500);
      res.end(String(err));
    }
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

async function main() {
  if (!existsSync(DIST)) {
    console.warn("[prerender] dist/ not found, skipping.");
    return;
  }

  const pages = await fetchPublishedPages();
  const cmsRoutes = pages.map((p) => ({
    path: `/p/${p.slug}`,
    lastmod: p.updated_at ? p.updated_at.slice(0, 10) : undefined,
    changefreq: "monthly",
    priority: "0.7",
  }));

  const allEntries = [...STATIC_ROUTES, ...cmsRoutes];

  // Always write the sitemap, even if Puppeteer is unavailable.
  await writeFile(join(DIST, "sitemap.xml"), buildSitemap(allEntries));
  console.log(`[prerender] sitemap.xml written (${allEntries.length} entries)`);

  let puppeteer;
  try {
    puppeteer = (await import("puppeteer")).default;
  } catch (err) {
    console.warn("[prerender] puppeteer not available, skipping HTML prerender:", err.message);
    return;
  }

  const indexHtml = await readFile(join(DIST, "index.html"), "utf-8");
  const server = await startServer(indexHtml);
  const { port } = server.address();
  const origin = `http://127.0.0.1:${port}`;

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const routes = allEntries.map((e) => e.path);
    for (const route of routes) {
      const page = await browser.newPage();
      try {
        await page.goto(`${origin}${route}`, {
          waitUntil: "networkidle0",
          timeout: 30000,
        });
        const html = await page.content();
        const outDir = route === "/" ? DIST : join(DIST, route);
        await mkdir(outDir, { recursive: true });
        await writeFile(join(outDir, "index.html"), html);
        console.log(`[prerender] ${route} -> ${join(outDir, "index.html")}`);
      } catch (err) {
        console.warn(`[prerender] failed ${route}:`, err.message);
      } finally {
        await page.close();
      }
    }
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.warn("[prerender] aborted:", err.message);
  // Never fail the build.
  process.exit(0);
});

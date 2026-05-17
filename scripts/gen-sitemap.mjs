// scripts/gen-sitemap.mjs
import fs from "node:fs/promises";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://aitechhive.com";
const cards = JSON.parse(await fs.readFile("data/cards.json", "utf-8").catch(() => "[]"));

const urls = [
  { loc: `${BASE}/`, changefreq: "hourly", priority: 1.0 },
  { loc: `${BASE}/privacy`, changefreq: "monthly", priority: 0.3 },
  { loc: `${BASE}/terms`, changefreq: "monthly", priority: 0.3 },
  ...cards.map((c) => ({
    loc: `${BASE}/c/${encodeURIComponent(c.id)}`,
    lastmod: c.published_at,
    changefreq: "weekly",
    priority: 0.7,
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

await fs.mkdir("public", { recursive: true });
await fs.writeFile("public/sitemap.xml", xml);
console.log(`✓ Sitemap with ${urls.length} URLs`);

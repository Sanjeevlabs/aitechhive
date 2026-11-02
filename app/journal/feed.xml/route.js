import { posts } from "../lib/posts";
const xml = (s) =>
  s.replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );
export function GET() {
  const origin = "https://newsletter.aitechhive.com";
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>AITechHive — Agent Ground Truth</title><link>${origin}</link><description>Working notes on AI in financial systems.</description>${posts.map((p) => `<item><title>${xml(p.title)}</title><link>${origin}/p/${p.slug}</link><guid>${origin}/p/${p.slug}</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate><description>${xml(p.description)}</description></item>`).join("")}</channel></rss>`,
    {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}

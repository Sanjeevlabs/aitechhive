export function GET() {
  return new Response(
    "User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /unsubscribe\nSitemap: https://newsletter.aitechhive.com/sitemap.xml\n",
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
}

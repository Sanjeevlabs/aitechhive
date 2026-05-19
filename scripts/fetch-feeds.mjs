// scripts/fetch-feeds.mjs
// Pulls RSS, HuggingFace papers API, and ATS job feeds (Greenhouse/Lever/Ashby/Workable).

import Parser from "rss-parser";
import fs from "node:fs/promises";

const parser = new Parser({
  timeout: 15000,
  headers: { "User-Agent": "AITechHive/2.0 (+https://aitechhive.com)" },
});

// Curated tier-1 sources only. No vendor PR, no consumer-tech, no personal blogs.
// Focus: BFSI trade press, Fortune-1000 wire (Reuters/Bloomberg/FT/WSJ/Economist),
// fintech investment signal, top financial firm research, regulator official feeds,
// and frontier AI lab blogs.
const RSS_SOURCES = [
  // ── Tier 1 wire & financial press (Google News site-scoped, fresh window) ─
  { name: "Reuters Finance/AI", url: "https://news.google.com/rss/search?q=when:1d+site:reuters.com+(bank+OR+fintech+OR+%22artificial+intelligence%22+OR+regulation)&hl=en-US&gl=US&ceid=US:en" },
  { name: "Bloomberg Finance/AI", url: "https://news.google.com/rss/search?q=when:1d+site:bloomberg.com+(bank+OR+fintech+OR+%22artificial+intelligence%22)&hl=en-US&gl=US&ceid=US:en" },
  { name: "FT Banking/AI", url: "https://news.google.com/rss/search?q=when:1d+site:ft.com+(bank+OR+fintech+OR+%22artificial+intelligence%22+OR+regulation)&hl=en-US&gl=US&ceid=US:en" },
  { name: "WSJ Finance/AI", url: "https://news.google.com/rss/search?q=when:1d+site:wsj.com+(bank+OR+fintech+OR+%22artificial+intelligence%22)&hl=en-US&gl=US&ceid=US:en" },
  { name: "Economist Finance", url: "https://news.google.com/rss/search?q=when:2d+site:economist.com+(bank+OR+fintech+OR+%22artificial+intelligence%22)&hl=en-US&gl=US&ceid=US:en" },
  { name: "CNBC Tech/Finance", url: "https://www.cnbc.com/id/19854910/device/rss/rss.html" },
  { name: "Forbes Fintech", url: "https://news.google.com/rss/search?q=when:1d+site:forbes.com+(fintech+OR+%22AI+banking%22+OR+%22AI+insurance%22)&hl=en-US&gl=US&ceid=US:en" },
  { name: "Fortune Tech/AI", url: "https://news.google.com/rss/search?q=when:1d+site:fortune.com+(%22artificial+intelligence%22+OR+fintech+OR+bank)&hl=en-US&gl=US&ceid=US:en" },

  // ── BFSI trade press (native, high-signal-to-noise) ──────────────────────
  { name: "Finextra", url: "https://www.finextra.com/rss/headlines.aspx" },
  { name: "American Banker", url: "https://www.americanbanker.com/feed" },
  { name: "Bank Automation News", url: "https://bankautomationnews.com/feed/" },
  { name: "Banking Dive", url: "https://www.bankingdive.com/feeds/news/" },
  { name: "PYMNTS", url: "https://www.pymnts.com/feed/" },
  { name: "Tearsheet", url: "https://tearsheet.co/feed/" },
  { name: "The Financial Brand", url: "https://thefinancialbrand.com/feed/" },
  { name: "Sifted (EU fintech)", url: "https://sifted.eu/feed" },

  // ── Fintech investment / funding signal ──────────────────────────────────
  { name: "Fintech Funding", url: "https://news.google.com/rss/search?q=when:1d+(%22fintech+raises%22+OR+%22fintech+funding%22+OR+%22Series+A+fintech%22+OR+%22Series+B+fintech%22+OR+%22Series+C+fintech%22+OR+%22fintech+IPO%22)&hl=en-US&gl=US&ceid=US:en" },
  { name: "Fintech M&A", url: "https://news.google.com/rss/search?q=when:1d+(%22fintech+acquires%22+OR+%22fintech+acquisition%22+OR+%22bank+acquires+AI%22+OR+%22bank+buys+AI%22)&hl=en-US&gl=US&ceid=US:en" },
  { name: "Bank-AI Deployments", url: "https://news.google.com/rss/search?q=when:2d+(%22deploys+AI%22+OR+%22rolls+out+AI%22+OR+%22launches+AI%22)+(bank+OR+insurer+OR+payments)&hl=en-US&gl=US&ceid=US:en" },

  // ── Frontier AI / enterprise tech ────────────────────────────────────────
  { name: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/" },
  { name: "VentureBeat AI", url: "https://venturebeat.com/category/ai/feed/" },
  { name: "Wired AI", url: "https://www.wired.com/feed/tag/ai/latest/rss" },

  // ── Top financial firm AI moves — news ABOUT them (wire-service-sourced;
  //    we never scrape proprietary research/insights pages directly).
  { name: "Goldman AI Moves", url: "https://news.google.com/rss/search?q=when:3d+%22Goldman+Sachs%22+(AI+OR+%22artificial+intelligence%22+OR+%22GS+AI+Assistant%22)+-site:goldmansachs.com&hl=en-US&gl=US&ceid=US:en" },
  { name: "JPMorgan AI Moves", url: "https://news.google.com/rss/search?q=when:3d+%22JPMorgan%22+(AI+OR+%22artificial+intelligence%22+OR+LLM+OR+%22IndexGPT%22)+-site:jpmorgan.com&hl=en-US&gl=US&ceid=US:en" },
  { name: "McKinsey Cited", url: "https://news.google.com/rss/search?q=when:3d+%22McKinsey%22+(report+OR+study+OR+survey)+(AI+OR+banking+OR+fintech)+-site:mckinsey.com&hl=en-US&gl=US&ceid=US:en" },
  { name: "BCG Cited", url: "https://news.google.com/rss/search?q=when:3d+(%22BCG%22+OR+%22Boston+Consulting%22)+(report+OR+study)+(AI+OR+banking+OR+fintech)+-site:bcg.com&hl=en-US&gl=US&ceid=US:en" },
  { name: "BlackRock AI Moves", url: "https://news.google.com/rss/search?q=when:3d+%22BlackRock%22+(AI+OR+%22artificial+intelligence%22+OR+fintech+OR+%22Aladdin%22)+-site:blackrock.com&hl=en-US&gl=US&ceid=US:en" },
  { name: "Citi AI Moves", url: "https://news.google.com/rss/search?q=when:3d+(%22Citi%22+OR+%22Citigroup%22)+(AI+OR+%22artificial+intelligence%22+OR+agentic+OR+%22Citi+GPS%22)&hl=en-US&gl=US&ceid=US:en" },

  // ── Regulator official channels (canonical for the Regulation category) ──
  { name: "FCA UK", url: "https://news.google.com/rss/search?q=when:3d+site:fca.org.uk&hl=en-US&gl=US&ceid=US:en" },
  { name: "Bank of England", url: "https://news.google.com/rss/search?q=when:3d+site:bankofengland.co.uk+(AI+OR+%22artificial+intelligence%22+OR+supervisory)&hl=en-US&gl=US&ceid=US:en" },
  { name: "ECB Supervision", url: "https://news.google.com/rss/search?q=when:3d+(site:bankingsupervision.europa.eu+OR+site:ecb.europa.eu)+(AI+OR+banking)&hl=en-US&gl=US&ceid=US:en" },
  { name: "OCC US", url: "https://news.google.com/rss/search?q=when:3d+site:occ.gov&hl=en-US&gl=US&ceid=US:en" },
  { name: "Federal Reserve", url: "https://news.google.com/rss/search?q=when:3d+site:federalreserve.gov+(AI+OR+%22artificial+intelligence%22+OR+%22SR+letter%22)&hl=en-US&gl=US&ceid=US:en" },
  { name: "RBI India", url: "https://news.google.com/rss/search?q=when:3d+site:rbi.org.in+(AI+OR+%22artificial+intelligence%22+OR+technology)&hl=en-US&gl=US&ceid=US:en" },
  { name: "MAS Singapore", url: "https://news.google.com/rss/search?q=when:3d+site:mas.gov.sg+(AI+OR+fintech)&hl=en-US&gl=US&ceid=US:en" },

  // ── Frontier AI labs (official channels — golden source for Research) ────
  { name: "Google DeepMind", url: "https://deepmind.google/blog/rss.xml" },
  { name: "Google Research", url: "https://research.google/blog/rss/" },
  { name: "Anthropic", url: "https://www.anthropic.com/news/rss.xml" },
  { name: "OpenAI", url: "https://openai.com/news/rss.xml" },
  { name: "Microsoft Research", url: "https://www.microsoft.com/en-us/research/feed/" },
  { name: "MIT Tech Review", url: "https://www.technologyreview.com/feed/" },

  // ── Preprints / academic ─────────────────────────────────────────────────
  { name: "arXiv cs.AI", url: "http://export.arxiv.org/rss/cs.AI" },
  { name: "arXiv q-fin", url: "http://export.arxiv.org/rss/q-fin" },

  // ── Trending signal proxy (no free X/Twitter API; Google News most-cited) ─
  // Real-time Twitter/X trends require the paid X API. Closest free proxy:
  // Google News "trending" queries, which surface stories with high outlet density.
  { name: "AI Trending Now", url: "https://news.google.com/rss/search?q=when:6h+(%22artificial+intelligence%22)+(viral+OR+%22most+discussed%22+OR+%22goes+viral%22+OR+breaking)&hl=en-US&gl=US&ceid=US:en" },
];

const FRESHNESS_HOURS = 48;
const cutoff = Date.now() - FRESHNESS_HOURS * 3600 * 1000;

async function fetchHuggingFace() {
  try {
    const r = await fetch("https://huggingface.co/api/daily_papers");
    if (!r.ok) return [];
    const data = await r.json();
    return (data || []).slice(0, 10).map((p) => ({
      source: "HuggingFace Papers",
      title: sanitize(p.paper?.title || p.title || "", 200),
      link: `https://huggingface.co/papers/${p.paper?.id || p.id}`,
      pub: p.publishedAt || p.paper?.publishedAt,
      summary: sanitize(p.paper?.summary || p.summary || ""),
    }));
  } catch (e) {
    console.log(`✗ HuggingFace: ${e.message}`);
    return [];
  }
}

const ATS_KEYWORDS = /\b(AI|ML|machine learning|LLM|GenAI|risk|compliance|fraud|model risk|quant|agentic|data scien|MLOps)\b/i;
const ATS_TIMEOUT_MS = 8000;

function withTimeout(promise, ms, label) {
  const t = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
  );
  return Promise.race([promise, t]);
}

async function fetchATS(companies) {
  // Run all ATS fetches in parallel — sequential was causing 4+ minute waits
  const results = await Promise.allSettled(
    companies.map((c) =>
      withTimeout(fetchOneATS(c), ATS_TIMEOUT_MS, c.name)
        .then((items) => {
          const matching = items.filter((j) => ATS_KEYWORDS.test(j.title)).slice(0, 3);
          console.log(`✓ ${c.name} (${c.ats}): ${matching.length}/${items.length} matching`);
          return matching;
        })
    )
  );

  const all = [];
  for (let i = 0; i < results.length; i++) {
    if (results[i].status === "fulfilled") {
      all.push(...results[i].value);
    } else {
      console.log(`✗ ${companies[i].name}: ${results[i].reason.message}`);
    }
  }
  return all;
}

async function fetchOneATS({ name, ats, slug }) {
  if (ats === "greenhouse") {
    const r = await fetch(`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    return (data.jobs || []).map((j) => ({
      source: name,
      title: j.title,
      link: j.absolute_url,
      pub: j.updated_at,
      summary: (j.location?.name || "") + (j.metadata?.find((m) => /salary/i.test(m.name))?.value || ""),
    }));
  }
  if (ats === "lever") {
    const r = await fetch(`https://api.lever.co/v0/postings/${slug}?mode=json&limit=30`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    return (data || []).map((j) => ({
      source: name,
      title: j.text,
      link: j.hostedUrl,
      pub: new Date(j.createdAt).toISOString(),
      summary: (j.categories?.location || "") + " · " + (j.categories?.team || ""),
    }));
  }
  if (ats === "ashby") {
    const r = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${slug}?includeCompensation=true`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    return (data.jobs || []).map((j) => ({
      source: name,
      title: j.title,
      link: j.jobUrl,
      pub: j.publishedAt,
      summary: (j.locationName || "") + (j.compensation?.compensationTierSummary ? " · " + j.compensation.compensationTierSummary : ""),
    }));
  }
  if (ats === "workable") {
    const r = await fetch(`https://${slug}.workable.com/spi/v3/jobs`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    return (data.results || []).map((j) => ({
      source: name,
      title: j.title,
      link: j.url,
      pub: j.published_on,
      summary: (j.location?.city || "") + ", " + (j.location?.country || ""),
    }));
  }
  return [];
}

// ============================================================
// Input sanitization — strip prompt-injection patterns from
// untrusted external content before it reaches the LLM
// ============================================================
const INJECTION_RE = /\b(ignore|disregard|forget)\s+(previous|above|all|prior)\s+(instructions?|prompts?|context)\b|\bsystem\s+prompt\b|\bact\s+as\b.{0,40}\b(AI|GPT|Claude|assistant)\b|\byou\s+are\s+now\b/gi;

function sanitize(str, max = 700) {
  if (!str) return "";
  return str
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "") // control chars
    .replace(INJECTION_RE, "[…]")
    .slice(0, max)
    .trim();
}

// ============================================================
// Main
// ============================================================
const all = [];

await Promise.all(
  RSS_SOURCES.map(async (src) => {
    try {
      const feed = await parser.parseURL(src.url);
      const items = (feed.items || []).slice(0, 15).map((i) => ({
        source: src.name,
        title: sanitize((i.title || "").replace(/\s+/g, " "), 200),
        link: i.link,
        pub: i.isoDate || i.pubDate,
        summary: sanitize((i.contentSnippet || i.summary || "").replace(/\s+/g, " ")),
      }));
      all.push(...items);
      console.log(`✓ ${src.name}: ${items.length}`);
    } catch (e) {
      console.log(`✗ ${src.name}: ${e.message}`);
    }
  })
);

const hfPapers = await fetchHuggingFace();
all.push(...hfPapers);
console.log(`✓ HuggingFace Papers: ${hfPapers.length}`);

let companies = [];
try {
  companies = JSON.parse(await fs.readFile("scripts/companies.json", "utf-8"));
} catch {
  console.log("⚠ scripts/companies.json missing — skipping ATS feeds");
}
if (companies.length) {
  const jobs = await fetchATS(companies);
  all.push(...jobs);
  console.log(`Jobs collected: ${jobs.length}`);
}

const fresh = all.filter((i) => {
  if (!i.pub) return true;
  const t = new Date(i.pub).getTime();
  return !isNaN(t) && t >= cutoff;
});

// Normalize title for similarity dedup: strips punctuation, lowercases, collapses whitespace.
// Catches the same story scraped from multiple RSS sources or Google News search queries.
function normalizeTitle(t) {
  return (t || "").toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
}

const seen = new Set();
const seenTitles = new Set();
const unique = fresh.filter((i) => {
  if (!i.link || seen.has(i.link)) return false;
  seen.add(i.link);
  const nt = normalizeTitle(i.title);
  // Only block on title similarity if the title is meaningfully long (>12 chars)
  if (nt.length > 12 && seenTitles.has(nt)) return false;
  if (nt) seenTitles.add(nt);
  return true;
});

unique.sort((a, b) => new Date(b.pub || 0) - new Date(a.pub || 0));
const trimmed = unique.slice(0, 100);

await fs.mkdir("scripts", { recursive: true });
await fs.writeFile("scripts/raw-feed.json", JSON.stringify(trimmed, null, 2));
console.log(`\n→ ${trimmed.length} items to scripts/raw-feed.json (from ${all.length} total, ${fresh.length} fresh)`);

// scripts/fetch-feeds.mjs
// Pulls RSS, HuggingFace papers API, and ATS job feeds (Greenhouse/Lever/Ashby/Workable).

import Parser from "rss-parser";
import fs from "node:fs/promises";

const parser = new Parser({
  timeout: 15000,
  headers: { "User-Agent": "AITechHive/2.0 (+https://aitechhive.com)" },
});

const RSS_SOURCES = [
  // BFSI / fintech
  { name: "Finextra", url: "https://www.finextra.com/rss/headlines.aspx" },
  { name: "PYMNTS", url: "https://www.pymnts.com/feed/" },
  { name: "Tearsheet", url: "https://tearsheet.co/feed/" },
  { name: "Bank Automation News", url: "https://bankautomationnews.com/feed/" },
  { name: "American Banker", url: "https://www.americanbanker.com/feed" },
  // AI / enterprise
  { name: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/" },
  { name: "VentureBeat AI", url: "https://venturebeat.com/category/ai/feed/" },
  // Research labs
  { name: "Google Research", url: "https://research.google/blog/rss/" },
  { name: "DeepMind", url: "https://deepmind.google/blog/rss.xml" },
  { name: "Anthropic", url: "https://www.anthropic.com/news/rss.xml" },
  { name: "OpenAI", url: "https://openai.com/news/rss.xml" },
  { name: "Meta AI", url: "https://ai.meta.com/blog/rss/" },
  // arXiv
  { name: "arXiv cs.AI", url: "http://export.arxiv.org/rss/cs.AI" },
  { name: "arXiv q-fin", url: "http://export.arxiv.org/rss/q-fin" },
  // Curated
  { name: "HN BFSI/AI", url: "https://hnrss.org/newest?q=bank+OR+insurer+OR+finance+AI&points=20" },
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
      title: p.paper?.title || p.title,
      link: `https://huggingface.co/papers/${p.paper?.id || p.id}`,
      pub: p.publishedAt || p.paper?.publishedAt,
      summary: (p.paper?.summary || p.summary || "").slice(0, 700),
    }));
  } catch (e) {
    console.log(`✗ HuggingFace: ${e.message}`);
    return [];
  }
}

const ATS_KEYWORDS = /\b(AI|ML|machine learning|LLM|GenAI|risk|compliance|fraud|model risk|quant|agentic|data scien|MLOps)\b/i;

async function fetchATS(companies) {
  const all = [];
  for (const c of companies) {
    try {
      const items = await fetchOneATS(c);
      const matching = items.filter((j) => ATS_KEYWORDS.test(j.title));
      all.push(...matching.slice(0, 3));
      console.log(`✓ ${c.name} (${c.ats}): ${matching.length}/${items.length} matching`);
    } catch (e) {
      console.log(`✗ ${c.name}: ${e.message}`);
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
// Main
// ============================================================
const all = [];

await Promise.all(
  RSS_SOURCES.map(async (src) => {
    try {
      const feed = await parser.parseURL(src.url);
      const items = (feed.items || []).slice(0, 15).map((i) => ({
        source: src.name,
        title: (i.title || "").trim(),
        link: i.link,
        pub: i.isoDate || i.pubDate,
        summary: (i.contentSnippet || i.summary || "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 700),
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

const seen = new Set();
const unique = fresh.filter((i) => {
  if (!i.link || seen.has(i.link)) return false;
  seen.add(i.link);
  return true;
});

unique.sort((a, b) => new Date(b.pub || 0) - new Date(a.pub || 0));
const trimmed = unique.slice(0, 100);

await fs.mkdir("scripts", { recursive: true });
await fs.writeFile("scripts/raw-feed.json", JSON.stringify(trimmed, null, 2));
console.log(`\n→ ${trimmed.length} items to scripts/raw-feed.json (from ${all.length} total, ${fresh.length} fresh)`);

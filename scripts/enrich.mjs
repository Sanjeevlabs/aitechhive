// scripts/enrich.mjs
// Loads raw-feed.json → LLM (via adapter) → merges into data/cards.json.

import fs from "node:fs/promises";
import { generateCards, getProviderInfo } from "./llm.mjs";

const SYSTEM_PROMPT = `You are AITechHive's editor. Audience: mid-senior BFSI engineers, risk officers, compliance pros, fintech operators, investors. They want quick scannable signal.

For each batch of raw items, select the 8-12 most consequential ones across these 7 categories:
- regulation  : new rules, deadlines, enforcement (EU AI Act, RBI, FCA, OCC, Fed)
- deployment  : named bank/insurer ships AI capability in production
- vendor      : funding, acquisition, product launch from BFSI-AI vendor
- career      : real job posting (ATS source), comp data, hiring trend
- tool        : open-source repo, eval benchmark, library worth knowing
- research    : paper, model release, lab announcement (HuggingFace, arXiv, Google, DeepMind, Anthropic, OpenAI, Meta)
- insight     : production reality nugget, jargon explainer, "did you know"

CARD SCHEMA (return JSON object with key "cards" containing the array):

{
  "id": "stable-slug-with-yyyy-mm-dd-prefix",
  "category": "regulation|deployment|vendor|career|tool|research|insight",
  "jurisdiction": "US|EU|UK|IN|APAC|Global",
  "severity": "low|med|high",
  "published_at": "ISO 8601 from source",
  "headline": "≤90 chars. Reuters-style. No clickbait. No acronyms without context.",
  "plain_english": "≤260 chars. For busy mid-senior BFSI engineer. Define jargon inline.",
  "why_it_matters": "≤180 chars. ONE concrete second-order effect.",
  "jargon": [{ "term": "...", "def": "≤90 chars plain English" }],
  "source": { "name": "Source · YYYY-MM-DD", "url": "..." },

  /* OPTIONAL — only if source supports. NEVER fabricate. */
  "effective_date": "YYYY-MM-DD",                              // regulation
  "scale": { "metric": "employees|markets|customers", "value": "60K" },  // deployment
  "amount": "$42M",                                            // vendor
  "round": "Series B",                                         // vendor
  "comp_low": 220000, "comp_high": 320000, "currency": "USD",  // career
  "stars": 3200, "stars_delta_7d": 400,                        // tool
  "benchmark_name": "fin-bench", "delta_pts": 12,              // research
  "stat_value": "73%", "stat_label": "of bank LLM pilots stall" // insight
}

CRITICAL RULES:
- Output: JSON object {"cards":[...]}. No prose. No code fences.
- Headlines: Reuters-style. No exclamation. No emoji. No "BREAKING:".
- Skip vendor PR fluff. Skip consumer fintech drama. Skip listicles.
- Never invent dates, names, money, comp numbers. Omit fields if source lacks data.
- Define every acronym used in the card itself.
- Mix categories. Don't return 8 regulation cards in one batch.
- Order newest first.`;

async function main() {
  const provider = getProviderInfo();
  console.log(`Using ${provider.name} (${provider.model}). Web search native: ${provider.supportsWebSearch}\n`);

  const raw = JSON.parse(await fs.readFile("scripts/raw-feed.json", "utf-8"));
  console.log(`Loaded ${raw.length} raw items.\n`);

  const HOUR_UTC = new Date().getUTCHours();
  const isMorning = HOUR_UTC === 0 || HOUR_UTC === 1;
  const doWebSearch = isMorning;

  let newCards = [];
  try {
    newCards = await generateCards({
      systemPrompt: SYSTEM_PROMPT,
      items: raw.slice(0, 70),
      doWebSearch,
    });
  } catch (e) {
    console.error("LLM call failed:", e.message);
    process.exit(1);
  }

  const valid = newCards.filter(
    (c) => c.id && c.category && c.headline && c.plain_english && c.source?.url
  );
  console.log(`✓ ${valid.length} valid cards from LLM (of ${newCards.length} returned)\n`);

  let archive = [];
  try {
    archive = JSON.parse(await fs.readFile("data/cards.json", "utf-8"));
    if (!Array.isArray(archive)) archive = [];
  } catch {
    archive = [];
  }

  const merged = [];
  const seen = new Set();
  for (const c of valid) {
    if (!seen.has(c.id)) { seen.add(c.id); merged.push(c); }
  }
  for (const c of archive) {
    if (!seen.has(c.id)) { seen.add(c.id); merged.push(c); }
  }

  const capped = merged.slice(0, 500);

  await fs.mkdir("data", { recursive: true });
  await fs.writeFile("data/cards.json", JSON.stringify(capped, null, 2));
  console.log(`✓ Wrote ${capped.length} cards (${valid.length} new, ${capped.length - valid.length} archived)`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});

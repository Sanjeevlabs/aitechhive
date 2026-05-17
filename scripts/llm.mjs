// scripts/llm.mjs
// Provider-agnostic LLM adapter. ONE env var (LLM_PROVIDER) swaps providers.
// Zero code changes for callers. Common JSON output contract.

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

const PROVIDERS = {
  anthropic: {
    label: "Anthropic",
    defaultModel: "claude-haiku-4-5",
    webSearch: true,
    rates: { in: 1.0, out: 5.0 },
  },
  openai: {
    label: "OpenAI",
    defaultModel: "gpt-4o-mini",
    baseURL: "https://api.openai.com/v1",
    webSearch: true,
    rates: { in: 0.15, out: 0.6 },
  },
  gemini: {
    label: "Google Gemini",
    defaultModel: "gemini-2.5-flash",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    webSearch: false,
    rates: { in: 0.075, out: 0.3 },
  },
  groq: {
    label: "Groq",
    defaultModel: "llama-3.3-70b-versatile",
    baseURL: "https://api.groq.com/openai/v1",
    webSearch: false,
    rates: { in: 0.59, out: 0.79 },
  },
  deepseek: {
    label: "DeepSeek",
    defaultModel: "deepseek-chat",
    baseURL: "https://api.deepseek.com/v1",
    webSearch: false,
    rates: { in: 0.27, out: 1.1 },
  },
  openrouter: {
    label: "OpenRouter",
    defaultModel: "anthropic/claude-haiku-4-5",
    baseURL: "https://openrouter.ai/api/v1",
    webSearch: false,
    rates: { in: 1.0, out: 5.0 },
  },
};

const PROVIDER = process.env.LLM_PROVIDER || "anthropic";
const API_KEY = process.env.LLM_API_KEY || process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.LLM_MODEL || PROVIDERS[PROVIDER]?.defaultModel;

if (!PROVIDERS[PROVIDER]) {
  throw new Error(`Unknown LLM_PROVIDER "${PROVIDER}". Valid: ${Object.keys(PROVIDERS).join(", ")}`);
}
if (!API_KEY) {
  throw new Error(`LLM_API_KEY missing for provider "${PROVIDER}"`);
}

export function getProviderInfo() {
  return {
    name: PROVIDERS[PROVIDER].label,
    provider: PROVIDER,
    model: MODEL,
    supportsWebSearch: PROVIDERS[PROVIDER].webSearch,
  };
}

// ============================================================
// Brave Search fallback for providers without native search
// ============================================================
async function braveSearch(query, count = 5) {
  if (!process.env.BRAVE_API_KEY) return [];
  try {
    const r = await fetch(
      `https://api.search.brave.com/res/v1/news/search?q=${encodeURIComponent(query)}&count=${count}&freshness=pd`,
      { headers: { "X-Subscription-Token": process.env.BRAVE_API_KEY, Accept: "application/json" } }
    );
    if (!r.ok) return [];
    const data = await r.json();
    return (data.results || []).map((x) => ({
      source: x.meta_url?.hostname || "web",
      title: x.title,
      link: x.url,
      pub: x.age,
      summary: (x.description || "").slice(0, 600),
    }));
  } catch {
    return [];
  }
}

// ============================================================
// Provider-specific call
// ============================================================
async function callAnthropic({ systemPrompt, userContent, doWebSearch }) {
  const client = new Anthropic({ apiKey: API_KEY });
  const params = {
    model: MODEL,
    max_tokens: 16000,
    system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: userContent }],
  };
  if (doWebSearch && PROVIDERS.anthropic.webSearch) {
    params.tools = [{ type: "web_search_20250305", name: "web_search", max_uses: 5 }];
  }
  const resp = await client.messages.create(params);
  const text = (resp.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
  return { text, usage: resp.usage };
}

async function callOpenAICompatible({ systemPrompt, userContent, doWebSearch }) {
  const cfg = PROVIDERS[PROVIDER];
  const client = new OpenAI({ apiKey: API_KEY, baseURL: cfg.baseURL });

  let webContext = "";
  if (doWebSearch && !cfg.webSearch) {
    const results = await braveSearch("BFSI banking insurance AI regulation deployment funding past 24 hours");
    if (results.length > 0) {
      webContext = `\n\nADDITIONAL WEB SEARCH RESULTS (Brave, last 24h):\n${JSON.stringify(results, null, 2)}`;
    }
  }

  const resp = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent + webContext },
    ],
    response_format: { type: "json_object" },
    max_tokens: 16000,
  });
  const text = resp.choices?.[0]?.message?.content || "";
  return { text, usage: resp.usage };
}

// ============================================================
// Public API
// ============================================================
export async function generateCards({ systemPrompt, items, doWebSearch = false }) {
  const userContent = `Raw items (newest first):\n\n${JSON.stringify(items, null, 2)}\n\nReturn a JSON object with key "cards" containing the array.`;

  let result;
  if (PROVIDER === "anthropic") {
    result = await callAnthropic({ systemPrompt, userContent, doWebSearch });
  } else {
    result = await callOpenAICompatible({ systemPrompt, userContent, doWebSearch });
  }

  const cleaned = result.text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error(`[${PROVIDER}] Parse failed. Raw:`, cleaned.slice(0, 400));
    throw new Error(`LLM returned invalid JSON: ${e.message}`);
  }

  const cards = Array.isArray(parsed) ? parsed : parsed.cards || [];
  logCost(result.usage);
  return cards;
}

function logCost(usage) {
  if (!usage) return;
  const cfg = PROVIDERS[PROVIDER];
  const inTok = usage.input_tokens || usage.prompt_tokens || 0;
  const outTok = usage.output_tokens || usage.completion_tokens || 0;
  const cacheRead = usage.cache_read_input_tokens || 0;
  const cacheWrite = usage.cache_creation_input_tokens || 0;

  const cost =
    ((inTok - cacheRead) * cfg.rates.in +
      cacheWrite * cfg.rates.in * 1.25 +
      cacheRead * cfg.rates.in * 0.1 +
      outTok * cfg.rates.out) /
    1_000_000;

  console.log(`[${cfg.label}] ${inTok} in (${cacheRead} cached) + ${outTok} out → $${cost.toFixed(4)}`);
}

# AITechHive

> Six refreshes a day. Live. No inbox required.

The live web alternative to AI/BFSI email newsletters. Swipeable Tinder-format deck. 7 categories. Refreshed every 4 hours by an autonomous Claude pipeline.

**Live:** [aitechhive.com](https://aitechhive.com) · **Weekly deep-dive:** [newsletter.aitechhive.com](https://newsletter.aitechhive.com)

---

## Stack

| Layer | Choice | Cost |
|---|---|---|
| Hosting | Cloudflare Pages | $0 |
| Auth + DB | Supabase (free tier) | $0 |
| LLM | Provider-agnostic (Anthropic, OpenAI, Gemini, Groq, DeepSeek, OpenRouter) | $1-3/mo depending on provider |
| Web search | Native (Anthropic/OpenAI) or Brave free tier | $0 |
| Card archive | `data/cards.json` in git | $0 |
| Cron | GitHub Actions | $0 |
| Analytics | Plausible | $0 (free tier) |
| **Total** | | **~$3/mo, $50 lasts ~15 months** |

---

## How it works

```
GitHub Actions cron (6×/day, every 4h)
    ↓
fetch-feeds.mjs       Pulls 16 RSS sources + HuggingFace papers + ATS job feeds
    ↓
enrich.mjs            Calls LLM via scripts/llm.mjs (provider-agnostic adapter)
                      → generates 8-14 cards matching schema
    ↓
data/cards.json       Auto-committed (newest first, capped at 500)
    ↓
Cloudflare Pages      Auto-deploys static site
    ↓
aitechhive.com        Swipeable feed: 7 categories, mobile-first, glass chrome
```

---

## Swap LLM providers (no code changes)

Set in GitHub Secrets:

```
LLM_PROVIDER=gemini       # or anthropic, openai, groq, deepseek, openrouter
LLM_API_KEY=<your-key>
```

Done. Next cron run uses the new provider. See `.env.local.example` for defaults.

---

## Categories

| Category | What it covers |
|---|---|
| **Regulation** | EU AI Act, RBI FREE-AI, FCA, OCC, Fed SR letters |
| **Deployment** | Named bank/insurer ships AI in production |
| **Vendor** | Funding, M&A, BFSI-AI vendor launches |
| **Career** | Real job postings from Greenhouse/Lever/Ashby/Workable + comp data |
| **Tool** | Open-source repos, eval suites, libraries |
| **Research** | HuggingFace papers, arXiv, Google/DeepMind/Anthropic/OpenAI/Meta releases |
| **Insight** | Production reality nuggets, jargon explainers |

---

## Swipe actions

| Direction | Action |
|---|---|
| Right → / `→` | Save (syncs across devices) |
| Left ← / `←` | Next (stays in archive forever) |
| Up ↑ / `↑` | Share (generates 1080×1080 PNG with branding) |
| Down ↓ / `↓` | Decode (expand jargon inline) |

All also accessible via keyboard or the bottom action bar.

---

## Repo layout

```
app/
├── layout.jsx              # Fonts, metadata, Plausible
├── page.jsx                # Server entry (reads cards.json)
├── page-client.jsx         # Deck UI (use client)
├── globals.css
├── privacy/page.jsx
├── terms/page.jsx
├── c/[id]/page.jsx         # Per-card SEO page
└── api/auth/callback/route.js   # Supabase OAuth callback

data/cards.json             # Auto-written by cron

scripts/
├── companies.json          # ATS seed list
├── fetch-feeds.mjs         # RSS + HuggingFace + ATS pull
├── llm.mjs                 # PROVIDER-AGNOSTIC adapter (6 providers)
├── enrich.mjs              # Cards generator
├── gen-sitemap.mjs
└── supabase-schema.sql

.github/workflows/refresh.yml   # 6×/day cron

middleware.js                   # Supabase session refresh
```

---

## Setup

See `BUILD.md` for the complete Claude Code rebuild prompt and the 5 manual steps (Supabase, GitHub secrets, Cloudflare Pages, Plausible, trigger first run).

---

## Acknowledgments

Built fast. WSJ for the editorial discipline, Spotify for the card stack mechanics, Apple for the system-style sheets. All summaries are editorial — always read the original source for binding details.

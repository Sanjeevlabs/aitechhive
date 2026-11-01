# AITechHive

> Two finite editions a day. No inbox required.

An editorial daily brief for AI and banking technology. Scan the lead story and five essentials, search the full archive, and open any story in a focused reading panel. The existing automated pipeline refreshes content at 8 a.m. and 8 p.m. IST.

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
GitHub Actions cron (2×/day, 08:00 and 20:00 IST)
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
aitechhive.com        Editorial brief, searchable feed, focused reading panel
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
| **Trending** | The single most-discussed AI story of the last 24h (Reuters/Bloomberg/FT signal) |
| **Learner** | Plain-English explainer of one foundational concept (RAG, embeddings, agents, MCP) for newcomers |
| **Regulation** | EU AI Act, RBI FREE-AI, FCA, OCC, Fed SR letters |
| **Deployment** | Named bank/insurer ships AI in production |
| **Vendor** | Funding, M&A, BFSI-AI vendor launches |
| **Career** | Real job postings from Greenhouse/Lever/Ashby/Workable + comp data |
| **Tool** | Open-source repos, eval suites, libraries |
| **Research** | HuggingFace papers, arXiv, Google/DeepMind/Anthropic/OpenAI/Meta releases |
| **Insight** | Production reality nuggets, jargon explainers |
| **Frontier AI** | General AI breakthroughs and major lab news beyond BFSI |

---

## Reading experience

- Lead story and five essentials, with a different topic prioritized for each essential.
- Search headlines, summaries, implications, source names and jurisdictions. All words in a query must match.
- Topic filters, newest/oldest sorting and incremental loading across the full archive.
- Reading panel with editorial implications, expandable jargon, related stories and original sources.
- Guest bookmarks stay on the current device. Signing in switches to existing Supabase account bookmarks; signing out restores the guest collection. Guest bookmarks are not uploaded automatically.
- Native sharing where available, with clipboard link sharing as fallback.
- Keyboard: `/` focuses search, `Escape` closes a dialog, and dialogs keep keyboard focus inside.
- Edition timestamps reflect the newest story in the dataset, not an unverified pipeline success time. Older editions are labelled as latest available stories.
- Fonts are bundled through Fontsource, avoiding build-time Google Fonts requests.

### Validation

```sh
node --test tests/brief-utils.test.mjs
npm run build
```

## Repo layout

```
app/
├── layout.jsx              # Fonts, metadata, Plausible
├── page.jsx                # Server entry (reads cards.json)
├── page-client.jsx         # Daily Brief UI (use client)
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

## Finite editions

`data/edition.json` freezes at most 12 story IDs per edition. Newest stories within a 24-hour window are chosen with topic diversity; the archive remains opt-in. Read progress is device-local and retained between editions for repeated stories. Opening a briefing marks it read; readers can also mark stories read/unread explicitly.

The refresh workflow runs at 02:30 and 14:30 UTC (08:00 and 20:00 IST). GitHub may delay scheduled runs. Code pushes do not publish extra editions; manual dispatch remains available. `scripts/publish-edition.mjs` preserves publication time when the selected IDs have not changed.

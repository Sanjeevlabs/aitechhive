# AITechHive v2 — Product Requirements Doc

**One-liner**: The live web alternative to AI/BFSI email newsletters. Tinder-format. Six daily refreshes. No inbox.

**Replaces**: v1 (dark cards / mixed RSS) at `Sanjeevlabs/aitechhive`.

**Tagline**: *"Six refreshes a day. Live. No inbox required."*

---

## 1. Why this exists

The Superhuman AI / The Neuron / TLDR AI / Ben's Bites newsletters all cram a daily digest into an email. AITechHive bets the inbox is the worst place for curated content — it competes with work email, gets buried, can't be shared inside, and forces reading in one sitting.

AITechHive is the same content category, different surface: a swipeable web app refreshed six times daily, with a BFSI/enterprise-AI angle no general newsletter has.

### Positioning vs newsletter.aitechhive.com
The newsletter (live, weekly, Beehiiv-hosted) is the **deep-weekly** product. This app is the **scan-daily** product. They feed each other — never cannibalize.

---

## 2. The seven categories

| ID | Label | Light tint | Accent | What it covers |
|---|---|---|---|---|
| `regulation` | Regulation | `#FAF7EE` | `#8B6F1F` (gold) | EU AI Act, RBI FREE-AI, FCA, OCC, Fed SR letters |
| `deployment` | Deployment | `#F2F6F4` | `#3F6E5F` (forest) | Named bank/insurer ships AI capability |
| `vendor` | Vendor | `#F8F1EC` | `#8E4A2A` (terracotta) | Funding, M&A, BFSI-AI vendor launches |
| `career` | Career | `#F8F1F3` | `#8E3A52` (rose) | Real job postings (ATS feeds), comp data, hiring trends |
| `tool` | Tool / OSS | `#EFF2F8` | `#3F4F7E` (slate blue) | Repos, eval suites, libraries |
| `research` | Research | `#F0F3F6` | `#3D5A6E` (deep teal) | HuggingFace papers, arXiv, Google/DeepMind/Anthropic/OpenAI/Meta |
| `insight` | Insight | `#F5F4F0` | `#5C544A` (stone) | Production reality nuggets, jargon explainers |

Card backgrounds are these light tints — Kindle-page legibility. Dark glass chrome surrounds them.

---

## 3. User flows

### 3.1 First-time visitor (soft wall)
```
Land → see deck immediately
  → Swipe cards 1–3 freely
  → Card 4 = signup gate (in-deck, not modal)
  → "Continue with Google" OR "Email magic link"
  → Authed → cookie + Supabase session set
  → Continue with cards 5–14
```

### 3.2 Returning visitor (signed in)
```
Land → cookie identifies → Supabase fetches saves/dismissed
  → Active deck shown, minus already-dismissed
  → Saved drawer pre-populated
  → Saves sync mobile ↔ desktop
```

### 3.3 The four actions (renamed)

| Direction | Name | Icon | What it does |
|---|---|---|---|
| Right → / `→` | **Save** | Bookmark | Adds to `saves`, syncs across devices |
| Left ← / `←` | **Next** | ArrowRight (forward, not X) | Removes from active deck. Stays in archive forever. |
| Up ↑ / `↑` | **Share** | Share2 | Generates 1080×1080 PNG, opens native share sheet |
| Down ↓ / `↓` | **Decode** | ChevronDown | Inline jargon expansion. Doesn't advance. |

### 3.4 Shareable card (free promotion)

Up swipe → client-side `html-to-image` renders 1080×1080 PNG with:
- Serif headline
- Category chip + jurisdiction
- 2-line plain English
- "Why it matters" callout
- `AITechHive` monogram bottom-left
- `aitechhive.com/c/{cardId}` bottom-right

Mobile triggers native share. Desktop offers Download + Copy link. Every share carries our wordmark.

---

## 4. Card system

### 4.1 Card content (medium density)

Default view:
1. Category badge (chip + icon, top-left)
2. Jurisdiction + severity dot (top-right)
3. Headline — Source Serif 4, 26-28px
4. Plain English — sans-serif, ~15px
5. Why it matters — tinted block, max 180 chars
6. **One micro-visualization** — when data supports it
7. Source footer

Expanded:
8. Jargon list

### 4.2 Micro-visualizations (data-driven only, NEVER faked)

| Category | Micro-viz | Trigger field |
|---|---|---|
| `regulation` | Countdown bar to effective date | `effective_date` |
| `deployment` | Scale numerals | `scale: { metric, value }` |
| `vendor` | Big money + round | `amount`, `round` |
| `career` | Comp range bar | `comp_low`, `comp_high`, `currency` |
| `tool` | Stars + 7d delta | `stars`, `stars_delta_7d` |
| `research` | Benchmark delta | `benchmark_name`, `delta_pts` |
| `insight` | Big stat | `stat_value`, `stat_label` |

If field absent → no placeholder. Slot skipped.

### 4.3 Deck ordering algorithm

```
1. Score every card:
   score = severity_weight + freshness_weight
   severity: high=3, med=2, low=1
   freshness: <12h=1.0, <24h=0.7, <48h=0.4, older=0.2

2. Subtract user's dismissed IDs.
3. Take top 14.
4. Greedy interleave: no 3 consecutive same-category.
5. Position 1 = highest score (anchor).
6. Position 4 = signup gate (unauth only).
7. Position 8 = newsletter cross-promo.
8. End-of-deck = stats + archive CTA.
```

---

## 5. Card lifecycle (your "hour 1, 3, 5, 10" question)

| Time | What happens |
|---|---|
| **T+0** (cron) | 6–10 fresh cards appended to `data/cards.json`. Active deck = top 14 by score. |
| **Hour 1** | Active deck heavy on new cards. Yesterday's high-severity items still show if unswiped. |
| **Hour 3** | Freshness decay kicks in. Older cards drop unless high-severity. |
| **Hour 5** (pre-cron) | Deck thinning for swiped-through users. Empty state shows "Next refresh in 47m" + archive button. |
| **Hour 24** | Card drops from active deck. **Lives in archive forever** (cap 500 = ~80 days). |
| **Day 80+** | Oldest age out. Saved cards stay (saved status pins them in archive). |

**Critical**: dismissed/swiped cards never deleted. Removed from active deck only. Archive shows everything.

---

## 6. Visual design system

### 6.1 Tokens
```
--bg            #0E0D0C    /* deep ink */
--bg-2          #1A1816    /* chrome */
--ink-light     #F5F1E8    /* on dark */
--ink-dim       #8A857C    /* on dark, secondary */
--glass-bg      rgba(245, 241, 232, 0.06)
--glass-border  rgba(245, 241, 232, 0.12)
--card-ink      #1A1816
--card-ink-mid  #57544E
--card-border   rgba(0, 0, 0, 0.06)
```

### 6.2 Typography
- **Source Serif 4** (500, 600): headlines, big numerals, micro-viz values
- **Geist Sans** (400, 500): body, UI
- **Geist Mono** (400, 500): labels, dates, chips, source attribution

Tabular numerals everywhere financial.

### 6.3 Glassmorphism placement
| Element | Material |
|---|---|
| Top masthead | Dark glass (backdrop-blur 24px) |
| Bottom action bar | Dark glass |
| Bottom sheets | Light glass (cream 95%) |
| Modals | Light glass |
| **Cards themselves** | **Opaque category tints. Legibility wins.** |
| Primary CTAs | **Opaque solid ink.** |

### 6.4 Anti-vibe-coded rules
- No emoji icons. Lucide-react only.
- No gradient backgrounds on content.
- No decorative animations.
- One accent color per card.
- No font sizes 13–16px (forces hierarchy).
- 4px grid spacing.
- All copy passes "would a Reuters editor approve?" filter.

---

## 7. Backend & data model (Supabase)

### 7.1 Why Supabase
Single vendor for auth + DB. Free tier covers 50K MAU. Built-in Google OAuth. Magic-link email auth. Postgres underneath with RLS.

### 7.2 Schema (see `scripts/supabase-schema.sql`)

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz default now(),
  last_active_at timestamptz default now()
);

create table saves (
  user_id uuid references auth.users(id) on delete cascade,
  card_id text not null,
  saved_at timestamptz default now(),
  primary key (user_id, card_id)
);

create table dismissed (
  user_id uuid references auth.users(id) on delete cascade,
  card_id text not null,
  dismissed_at timestamptz default now(),
  primary key (user_id, card_id)
);

create table shares (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  card_id text not null,
  shared_at timestamptz default now()
);

-- RLS: users see only own rows.
```

**Cards stay in `data/cards.json`** (not Supabase). Free, version-controlled, public, no read cost. Supabase holds per-user state only.

---

## 8. Content pipeline (provider-agnostic)

### 8.1 Sources (all free, no auth)

| Source | Categories fed |
|---|---|
| Finextra, PYMNTS, Tearsheet, Bank Automation News, American Banker | regulation, deployment, vendor |
| TechCrunch AI, VentureBeat AI | vendor, deployment |
| HuggingFace papers API, arXiv cs.AI, arXiv q-fin | research |
| Google Research, DeepMind, Anthropic, OpenAI, Meta AI blogs | research |
| HN BFSI/AI search | catch-all |
| **ATS feeds** — Greenhouse, Lever, Ashby, Workable (public JSON, no auth) | career |

### 8.2 ATS company seed list

`scripts/companies.json` — ~20 BFSI/AI hiring hubs (Stripe, Plaid, Brex, Affirm, Block, Anthropic, OpenAI, Mercury, Ramp, etc). Filter by `AI|ML|risk|compliance|fraud|model risk|quant|agentic`.

### 8.3 LLM adapter — the "model freedom"

`scripts/llm.mjs`: one function `generateCards()`. One env var `LLM_PROVIDER` switches between:
- `anthropic` (default — Claude Haiku 4.5)
- `openai` (GPT-4o-mini)
- `gemini` (Gemini 2.0 Flash)
- `groq` (Llama 3.3 70B)
- `deepseek` (DeepSeek Chat)
- `openrouter` (anything via passthrough)

5 of 6 providers use OpenAI-compatible endpoints, so we use the `openai` npm package against their base URLs. Anthropic gets its own SDK. Common output schema.

### 8.4 Web search by provider

- **Anthropic, OpenAI**: native server-side web search. Morning pass uses it.
- **Others**: Brave Search API fallback (free 2K/mo) if `BRAVE_API_KEY` set; else skip.

### 8.5 Cron — 6×/day, every 4 hours

`cron: '30 0,4,8,12,16,20 * * *'` UTC.

### 8.6 Cost model

| Provider | Per day | Per month |
|---|---|---|
| Anthropic Haiku 4.5 | $0.04 | $1.20 |
| Anthropic + Sonnet web search (1× daily) | +$0.07 | +$2.10 |
| Total Anthropic | **$0.11** | **$3.30** |
| Gemini Flash equivalent | $0.03 | $1.00 |
| DeepSeek Chat | $0.05 | $1.50 |
| OpenAI GPT-4o-mini | $0.07 | $2.00 |

Your $50 lasts 15+ months on Anthropic, 50 months on Gemini.

---

## 9. Pre-launch checklist (from your screenshots)

| Item | Status | Notes |
|---|---|---|
| Privacy Policy | ✅ | `/privacy` static page |
| Terms & Conditions | ✅ | `/terms` static page |
| Cookie consent | ✅ | One-line banner for EU IPs |
| Contact email | ✅ | `hello@aitechhive.com` in footer |
| Bug report | ✅ | "Report issue" mailto link |
| Page view tracking | ✅ | Plausible free tier |
| User event tracking | ✅ | Plausible custom events: save, share, next, signup |
| Google Search Console submission | ✅ | `sitemap.xml` auto-generated |
| SEO basics | ✅ | OG tags, JSON-LD `Article` per card, canonical URLs |
| Signup/login | ✅ | Supabase Google OAuth + magic link |
| Email verification | ⏸ v3 | Trust at signup |
| Rate limiting | ✅ | Cloudflare per-IP + Supabase RLS |
| OAuth (Google) | ✅ | Primary signup path |
| Payment flow | ❌ N/A | No payments in v2 |

---

## 10. Out of scope for v2

- Daily/weekly email digest (v3)
- Push notifications
- Mobile native (PWA install enough)
- Sponsored cards / monetization
- Multi-language
- Comments
- Public "top shared" page

---

## 11. Success criteria

- [ ] First refresh produces ≥10 cards across ≥4 categories
- [ ] Soft wall fires at card 4 for unsigned users
- [ ] Google OAuth signin works on mobile + desktop
- [ ] Saves persist mobile → desktop sign-in
- [ ] All 4 actions work via swipe + keyboard + tap
- [ ] Shareable PNG generates in <2s on mid-range phone
- [ ] Lighthouse mobile ≥90 perf & accessibility
- [ ] Cron 6× per day without failure for 7 days
- [ ] Month-1 cost ≤ $5
- [ ] Privacy + Terms + Contact live pre-launch

# AITechHive v2 — Dismantle & Rebuild Instructions for Claude Code

## What this is

A complete dismantle-and-rebuild of `Sanjeevlabs/aitechhive`. The v1 (dark cards, KV signup) is being replaced with v2 (WSJ × Spotify × Apple, Supabase auth, 7 categories including Research, provider-agnostic LLM, shareable PNG export, full pre-launch checklist).

---

## Run this in Claude Code

Open Claude Code in an empty folder. Paste the prompt below in full:

```
You are dismantling and rebuilding the GitHub repository Sanjeevlabs/aitechhive.

STEP 1. Clone the repo:
  gh repo clone Sanjeevlabs/aitechhive aitechhive-v2
  cd aitechhive-v2

STEP 2. Inventory what's there:
  ls -la
  git log --oneline -10
  Report what you find. Confirm you see existing files before destroying anything.

STEP 3. Delete EVERYTHING except:
  - .git/
  - LICENSE (if present)

Use: find . -mindepth 1 -maxdepth 1 ! -name '.git' ! -name 'LICENSE' -exec rm -rf {} +

STEP 4. Copy these v2 files from this conversation (preserve directory structure):

  01-PRD.md                                    [reference only, top-level]
  02-TRD.md                                    [reference only, top-level]
  README.md                                    [generate from PRD summary]
  package.json
  next.config.mjs
  tailwind.config.js
  postcss.config.js
  middleware.js
  .gitignore
  .env.local.example

  app/layout.jsx
  app/page.jsx
  app/page-client.jsx
  app/globals.css
  app/privacy/page.jsx
  app/terms/page.jsx
  app/c/[id]/page.jsx
  app/api/auth/callback/route.js

  data/cards.json                              [seed empty array]

  public/robots.txt

  scripts/companies.json
  scripts/fetch-feeds.mjs
  scripts/llm.mjs
  scripts/enrich.mjs
  scripts/gen-sitemap.mjs
  scripts/supabase-schema.sql

  .github/workflows/refresh.yml

STEP 5. Install dependencies:
  npm install

STEP 6. Try a local build to verify:
  npm run build

  If you hit errors:
  - Missing peer dep → install it explicitly
  - Type errors → these are .jsx so types shouldn't apply; check Node version is 20+
  - Supabase env errors → expected without .env.local; build should still pass

STEP 7. Commit and push:
  git add -A
  git commit -m "rebuild: v2 WSJ×Apple swipeable BFSI feed with Supabase auth, 7 categories, provider-agnostic LLM, shareable PNG export"
  git push origin main --force-with-lease

STEP 8. Print:
  - Final commit SHA
  - List of files committed
  - Confirm the .github/workflows/refresh.yml exists
  - Remind the user of the 4 manual steps below

DO NOT skip the inventory step.
DO NOT commit node_modules or .env.local.
If anything is ambiguous, ask before destroying files.
```

---

## What you (Sanjeev) need to do manually after Claude Code finishes

### 1. Set up Supabase (one-time, ~5 minutes)

1. Create a new project at supabase.com — free tier
2. Project Settings → API → copy:
   - Project URL → goes into `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → goes into `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → goes into `SUPABASE_SERVICE_ROLE_KEY`
3. SQL Editor → paste contents of `scripts/supabase-schema.sql` → Run
4. Authentication → Providers:
   - Email: enable, set "Confirm email" to OFF (we use magic link not signup confirmation)
   - Google: enable, follow Supabase's wizard. You'll need a Google Cloud Console OAuth client. Add `https://xxx.supabase.co/auth/v1/callback` as authorized redirect URI.
5. Authentication → URL Configuration:
   - Site URL: `https://aitechhive.com`
   - Redirect URLs: add `https://aitechhive.com/api/auth/callback`

### 2. GitHub secrets

Repo → Settings → Secrets and variables → Actions → New repository secret. Add:

| Name | Value |
|---|---|
| `LLM_PROVIDER` | `anthropic` (or `gemini`, `openai`, etc.) |
| `LLM_API_KEY` | your provider key |
| `LLM_MODEL` | (optional) override default model |
| `BRAVE_API_KEY` | (optional) for web search fallback |

The cron uses these on every run.

### 3. Cloudflare Pages

1. Cloudflare dashboard → Pages → "Create a project" → Connect to Git → `Sanjeevlabs/aitechhive`
2. Build configuration:
   - Framework preset: **Next.js**
   - Build command: `npx @cloudflare/next-on-pages@1`
   - Build output: `.vercel/output/static`
   - Root directory: `/`
   - Environment variables (Production):
     - `NODE_VERSION` = `20`
     - `NEXT_PUBLIC_SUPABASE_URL` = (from step 1)
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (from step 1)
     - `NEXT_PUBLIC_APP_URL` = `https://aitechhive.com`
     - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` = `aitechhive.com` (optional)

3. After first deploy works on `*.pages.dev`, attach custom domain `aitechhive.com` in Cloudflare Pages → Custom Domains.

### 4. Plausible Analytics (optional, 2 minutes, free)

1. plausible.io → Sign up free
2. Add site: `aitechhive.com`
3. The script is already wired in `app/layout.jsx`. Just deploy.

### 5. Trigger first refresh

GitHub → Actions tab → "Refresh AITechHive cards" → **Run workflow** button.

Within ~60 seconds you'll have a populated `data/cards.json` committed. Cloudflare auto-redeploys. Site is live.

---

## Switching LLM providers (the model-freedom feature)

To change from Anthropic to Gemini (or any other provider) — **no code changes needed**:

1. GitHub Secrets → Update:
   - `LLM_PROVIDER=gemini`
   - `LLM_API_KEY=<your-gemini-key>`
2. Manually trigger the workflow once to test.
3. Done. Every cron run from now on uses Gemini.

Cost comparison (same workload, 6 runs/day):

| Provider | Per month |
|---|---|
| Anthropic Haiku 4.5 | $3.30 |
| OpenAI GPT-4o-mini | $2.00 |
| Google Gemini 2.0 Flash | $1.00 |
| DeepSeek Chat | $1.50 |
| Groq Llama 3.3 70B | $2.50 |

---

## Sanity-check after the first cron run

1. Visit aitechhive.com → should see deck immediately
2. Swipe through 3 cards → card 4 should be the signup gate
3. Click "Continue with Google" → completes OAuth → returns to deck
4. Save a card on mobile → open desktop, sign in with same Google → saved card should appear
5. Swipe up on a card → share modal opens → "Share image" generates a 1080×1080 PNG with branding
6. Footer link to `newsletter.aitechhive.com` works

If any of these break, check Cloudflare Pages logs first, then Supabase logs, then GitHub Actions logs.

---

## What's NOT in v2 (and why)

| Item | Why deferred |
|---|---|
| Daily email digest | Adds Resend cost. Newsletter does this weekly already. |
| Push notifications | iOS web push is half-broken; PWA install enough. |
| Monetization | Premature. Get users first. |
| Multi-language | English audience first. |
| Email verification | Magic link IS verification. |
| User-submitted content | Quality control nightmare. |
| Comments | Distracts from scan-mode. |

All of these are open for v3 once you have signal on what users actually want.

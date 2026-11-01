"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  ArrowUpRight,
  ArrowRight,
  Bookmark,
  Search,
  X,
  Share2,
  Check,
  Mail,
  LogOut,
  ChevronDown,
} from "lucide-react";
import {
  selectEdition,
  TOPICS,
  prepareCards,
  filterCards,
  timestamp,
  sourceName,
  safeSource,
  dateLabel,
  readingTime,
} from "./brief-utils.mjs";

const STORAGE = "ath-bookmarks-v1";
const TOPIC_ORDER = [
  "frontier",
  "deployment",
  "regulation",
  "tool",
  "research",
  "vendor",
  "shift",
  "learner",
  "insight",
  "trending",
];

function Mark() {
  return (
    <svg
      viewBox="0 0 40 40"
      width="34"
      height="34"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 3 35 11.5v17L20 37 5 28.5v-17L20 3Z"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <path
        d="m12 25 8-14 8 14M15 20h10M20 11v19"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function Meta({ card }) {
  return (
    <div className="story-meta">
      <span>{TOPICS[card.category] || "Briefing"}</span>
      <i /> <span>{sourceName(card)}</span>
      <span className="meta-date">{dateLabel(card)}</span>
    </div>
  );
}
function SaveButton({ card, saved, onSave, text = false }) {
  const active = saved.has(card.id);
  return (
    <button
      className={`icon-button ${active ? "is-saved" : ""}`}
      aria-label={`${active ? "Unsave" : "Save"}: ${card.headline}`}
      aria-pressed={active}
      onClick={() => onSave(card)}
    >
      <Bookmark size={17} fill={active ? "currentColor" : "none"} />
      {text && (active ? "Saved" : "Save story")}
    </button>
  );
}
function Modal({ children, onClose, title, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const prior = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const nodes = [
        ...ref.current.querySelectorAll(
          'button:not(:disabled), a[href], input, [tabindex="0"]',
        ),
      ];
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (
        e.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === ref.current)
      ) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      prior?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={`modal ${className}`}
      >
        <header className="modal-top">
          <span id="dialog-title">{title}</span>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
function Reader({ card, saved, onSave, onClose, onShare, related, onRead }) {
  const url = safeSource(card);
  return (
    <Modal onClose={onClose} title="THE READING ROOM" className="reader">
      <div className="reader-body">
        <Meta card={card} />
        <h2>{card.headline}</h2>
        <div className="reader-tools">
          <span>{readingTime(card)} min read</span>
          <SaveButton card={card} saved={saved} onSave={onSave} text />
          <button className="icon-button" onClick={() => onShare(card)}>
            <Share2 size={16} /> Share
          </button>
        </div>
        <p className="reader-summary">{card.plain_english}</p>
        {card.why_it_matters && (
          <section className="implication">
            <p className="eyebrow">
              WHY IT MATTERS <span>EDITORIAL ANALYSIS</span>
            </p>
            <p>{card.why_it_matters}</p>
          </section>
        )}
        {card.jargon?.length > 0 && (
          <section className="glossary">
            <h3>A little context</h3>
            {card.jargon.map((j, i) => (
              <details key={`${j.term}-${i}`}>
                <summary>
                  {j.term}
                  <ChevronDown size={16} />
                </summary>
                <p>{j.def}</p>
              </details>
            ))}
          </section>
        )}
        <div className="source-box">
          <p>Go deeper at the source.</p>
          <span>
            AI-assisted summaries can miss context. Read the original reporting
            for the full picture.
          </span>
          {url ? (
            <a
              className="button dark"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read {sourceName(card)} <ArrowUpRight size={17} />
            </a>
          ) : (
            <p>Source link unavailable.</p>
          )}
          <a className="permalink" href={`/c/${encodeURIComponent(card.id)}`}>
            Open story permalink <ArrowUpRight size={13} />
          </a>
        </div>
        {related.length > 0 && (
          <section className="related">
            <p className="eyebrow">KEEP READING</p>
            {related.map((c) => (
              <button key={c.id} onClick={() => onRead(c)}>
                {c.headline}
                <ArrowRight size={18} />
              </button>
            ))}
          </section>
        )}
      </div>
    </Modal>
  );
}
function SignIn({ supabase, onClose, initialError }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(initialError || "");
  async function login(google = false) {
    setBusy(true);
    setError("");
    try {
      const redirectTo = `${window.location.origin}/api/auth/callback`;
      const result = google
        ? await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo },
          })
        : await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: redirectTo },
          });
      if (result.error) throw result.error;
      if (!google) setSent(true);
    } catch (e) {
      setError(e.message || "Sign-in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      onClose={onClose}
      title="YOUR AITECHHIVE ACCOUNT"
      className="auth-modal"
    >
      <div className="auth-body">
        <Mail size={28} />
        <h2>Your reading, everywhere.</h2>
        <p>
          Sign in to access your account bookmarks across devices. Reading is
          always open.
        </p>
        {sent ? (
          <p role="status" className="success-message">
            Check your inbox for your sign-in link.
          </p>
        ) : (
          <>
            <button
              className="button"
              disabled={busy}
              onClick={() => login(true)}
            >
              Continue with Google
            </button>
            <div className="or">or with email</div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                login();
              }}
            >
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
              <button className="button dark" disabled={busy}>
                {busy ? "Connecting…" : "Send sign-in link"}
                <ArrowRight size={17} />
              </button>
            </form>
          </>
        )}
        {error && (
          <p role="alert" className="error-message">
            {error}
          </p>
        )}
        <small>
          No password needed. <a href="/privacy">Privacy policy</a>
        </small>
      </div>
    </Modal>
  );
}

export default function PageClient({ initialCards, edition }) {
  const archive = useMemo(() => prepareCards(initialCards), [initialCards]);
  const cards = useMemo(
    () =>
      edition?.ids?.length
        ? edition.ids
            .map((id) => archive.find((c) => c.id === id))
            .filter(Boolean)
            .slice(0, 12)
        : selectEdition(archive),
    [archive, edition],
  );
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [read, setRead] = useState(new Set());
  const [unreadOnly, setUnreadOnly] = useState(false);
  useEffect(() => {
    try {
      const ids = JSON.parse(localStorage.getItem("ath-read-v1") || "[]");
      if (Array.isArray(ids)) setRead(new Set(ids));
    } catch {}
  }, []);
  function openStory(card) {
    setActive(card);
    markRead(card);
  }
  function markRead(card) {
    setRead((previous) => {
      const next = new Set(previous);
      next.add(card.id);
      try {
        localStorage.setItem(
          "ath-read-v1",
          JSON.stringify([...next].slice(-1200)),
        );
      } catch {}
      return next;
    });
  }
  const readCount = cards.filter((c) => read.has(c.id)).length;
  const remaining = cards.length - readCount;
  const editionDate = edition?.published_at || cards[0]?.published_at;
  const editionText = `AITechHive — ${editionDate ? new Date(editionDate).toLocaleDateString("en-GB", { timeZone: "Asia/Kolkata" }) : "Daily brief"}\n${cards.length} stories. Two editions a day.\n\n${cards.map((c, i) => `${i + 1}. ${c.headline}\nhttps://aitechhive.com/c/${encodeURIComponent(c.id)}`).join("\n\n")}`;
  async function shareEdition() {
    try {
      if (navigator.share)
        await navigator.share({
          title: "AITechHive daily brief",
          text: editionText,
        });
      else {
        await navigator.clipboard.writeText(editionText);
        setNotice("Edition copied — paste into WhatsApp, LinkedIn or email.");
      }
    } catch (e) {
      if (e.name !== "AbortError")
        setNotice("Could not copy. Use the WhatsApp sharing button.");
    }
  }
  const [topic, setTopic] = useState("all");
  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState(new Set());
  const [user, setUser] = useState(null);
  const [active, setActive] = useState(null);
  const [signIn, setSignIn] = useState(false);
  const [authError, setAuthError] = useState("");
  const [notice, setNotice] = useState("");
  const [limit, setLimit] = useState(15);
  const [now, setNow] = useState(null);
  const [sort, setSort] = useState("newest");
  const searchRef = useRef(null);
  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
      key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return url && key ? createBrowserClient(url, key) : null;
  }, []);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 60000);
    try {
      const ids = JSON.parse(localStorage.getItem(STORAGE) || "[]");
      if (Array.isArray(ids))
        setSaved(new Set(ids.filter((id) => typeof id === "string")));
    } catch {
      /* storage may be unavailable */
    }
    if (new URLSearchParams(window.location.search).has("auth_error")) {
      setAuthError(
        "Your sign-in link expired or was already used. Please request another.",
      );
      setSignIn(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase.auth.getUser().then(({ data }) => {
      if (alive) setUser(data.user || null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (event === "SIGNED_IN") setSignIn(false);
      if (event === "SIGNED_OUT") {
        try {
          setSaved(new Set(JSON.parse(localStorage.getItem(STORAGE) || "[]")));
        } catch {
          setSaved(new Set());
        }
      }
    });
    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, [supabase]);
  useEffect(() => {
    if (!user || !supabase) return;
    let alive = true;
    supabase
      .from("saves")
      .select("card_id")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) {
          setNotice("Could not load account bookmarks. Please try again.");
          return;
        }
        setSaved(new Set((data || []).map((row) => row.card_id)));
      });
    return () => {
      alive = false;
    };
  }, [user, supabase]);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(t);
  }, [notice]);
  useEffect(() => {
    setLimit(15);
  }, [topic, query, savedOnly, sort]);
  useEffect(() => {
    const onKey = (e) => {
      if (
        e.key === "/" &&
        !active &&
        !signIn &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, signIn]);
  const [saving, setSaving] = useState(new Set());
  async function toggleSave(card) {
    if (saving.has(card.id)) return;
    const wasSaved = saved.has(card.id);
    const next = new Set(saved);
    wasSaved ? next.delete(card.id) : next.add(card.id);
    setSaved(next);
    if (!user) {
      try {
        localStorage.setItem(STORAGE, JSON.stringify([...next]));
        setNotice(
          wasSaved ? "Removed from saved stories." : "Saved on this device.",
        );
      } catch {
        setNotice(
          "Browser storage is unavailable. This bookmark lasts for this visit.",
        );
      }
      return;
    }
    setSaving((prev) => new Set([...prev, card.id]));
    try {
      const result = wasSaved
        ? await supabase
            .from("saves")
            .delete()
            .eq("user_id", user.id)
            .eq("card_id", card.id)
        : await supabase
            .from("saves")
            .insert({ user_id: user.id, card_id: card.id });
      if (result.error) throw result.error;
      setNotice(
        wasSaved ? "Removed from your account." : "Saved to your account.",
      );
    } catch {
      setSaved((prev) => {
        const reverted = new Set(prev);
        wasSaved ? reverted.add(card.id) : reverted.delete(card.id);
        return reverted;
      });
      setNotice("Could not sync your bookmark. Please try again.");
    } finally {
      setSaving((prev) => {
        const next = new Set(prev);
        next.delete(card.id);
        return next;
      });
    }
  }
  async function share(card) {
    const url = `${window.location.origin}/c/${encodeURIComponent(card.id)}`;
    try {
      if (navigator.share) await navigator.share({ title: card.headline, url });
      else {
        await navigator.clipboard.writeText(url);
        setNotice("Story link copied.");
      }
    } catch (e) {
      if (e.name !== "AbortError")
        setNotice(
          "Could not share automatically. Open the story permalink to copy its address.",
        );
    }
  }
  const filtered = useMemo(() => {
    const list = filterCards(savedOnly || archiveOpen ? archive : cards, {
      topic,
      query,
      savedOnly,
      saved,
    }).filter((c) => !unreadOnly || !read.has(c.id));
    return sort === "oldest" ? [...list].reverse() : list;
  }, [
    cards,
    archive,
    archiveOpen,
    topic,
    query,
    savedOnly,
    saved,
    sort,
    unreadOnly,
    read,
  ]);
  const editionCutoff = timestamp(cards[0] || {}) - 24 * 3600 * 1000;
  const lead =
    cards.find(
      (c) => c.category === "trending" && timestamp(c) >= editionCutoff,
    ) || cards[0];
  const essential = [];
  const used = new Set([lead?.category]);
  // Start with the latest story from each topic, then fill any remaining slots.
  for (const c of cards) {
    if (c.id !== lead?.id && !used.has(c.category)) {
      essential.push(c);
      used.add(c.category);
    }
    if (essential.length === 5) break;
  }
  for (const c of cards) {
    if (essential.length === 5) break;
    if (c.id !== lead?.id && !essential.some((e) => e.id === c.id))
      essential.push(c);
  }
  const overview =
    topic === "all" &&
    !query.trim() &&
    !savedOnly &&
    !archiveOpen &&
    !unreadOnly;
  const latest = editionDate ? { published_at: editionDate } : cards[0];
  const stale =
    now !== null && latest && now - timestamp(latest) > 24 * 3600 * 1000;
  const available = TOPIC_ORDER.filter((t) =>
    cards.some(
      (c) => c.category === t || (t === "shift" && c.category === "career"),
    ),
  );
  const closeReader = useMemo(() => () => setActive(null), []);
  const closeAuth = useMemo(
    () => () => {
      setSignIn(false);
      setAuthError("");
    },
    [],
  );
  return (
    <div className="daily-brief">
      <a className="skip-link" href="#stories">
        Skip to stories
      </a>
      <header className="masthead">
        <div className="shell header-inner">
          <a href="/" className="brand" aria-label="AITechHive home">
            <Mark />
            <span>
              AI<span className="brand-light">Tech</span>Hive
              <span className="brand-dot">.</span>
            </span>
          </a>
          <nav className="header-nav" aria-label="Main navigation">
            <button
              className={!savedOnly ? "nav-active" : ""}
              onClick={() => {
                setSavedOnly(false);
                setArchiveOpen(false);
                setUnreadOnly(false);
                setTopic("all");
                setQuery("");
              }}
            >
              The brief
            </button>
            <button
              className={savedOnly ? "nav-active" : ""}
              onClick={() => setSavedOnly(true)}
            >
              <Bookmark size={15} /> Saved{" "}
              <span className="count">{saved.size}</span>
            </button>
            <a
              href="https://newsletter.aitechhive.com"
              target="_blank"
              rel="noopener noreferrer"
              className="newsletter-link"
            >
              The weekly edition <ArrowUpRight size={14} />
            </a>
          </nav>
          {supabase &&
            (user ? (
              <button
                className="account-button"
                onClick={async () => {
                  const { error } = await supabase.auth.signOut();
                  if (error) setNotice("Could not sign out. Please try again.");
                }}
                aria-label="Sign out"
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            ) : (
              <button
                className="account-button"
                onClick={() => setSignIn(true)}
              >
                Sign in <ArrowUpRight size={14} />
              </button>
            ))}
        </div>
      </header>
      <main className="shell">
        <section className="intro">
          <div>
            <p className="eyebrow">
              <span className="amber-square" /> THE DAILY BRIEF{" "}
              <span className="edition-label">/ AI, WITH CONTEXT</span>
            </p>
            <h1>
              {savedOnly ? (
                <>
                  Worth coming <em>back to.</em>
                </>
              ) : (
                <>
                  Stay ahead.
                  <br className="mobile-break" /> Skip the <em>noise.</em>
                </>
              )}
            </h1>
            <p className="intro-description">
              {savedOnly
                ? "Your own collection of ideas, developments and things to explore."
                : "The developments shaping AI. What happened, why it matters, and where to go deeper."}
            </p>
          </div>
          <div className="edition">
            <span className="edition-title">LATEST EDITION</span>
            <strong>{latest ? dateLabel(latest, true) : "Coming soon"}</strong>
            <span className={stale ? "stale" : ""}>
              <span className={`status-dot ${stale ? "status-stale" : ""}`} />
              {latest
                ? `${stale ? "Latest available stories" : "Published"} · ${new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(timestamp(latest))} IST`
                : "Waiting for the first briefing"}
            </span>
          </div>
        </section>
        <section
          className="edition-progress"
          aria-label="Edition reading progress"
        >
          <div>
            <p className="eyebrow">TWO EDITIONS. THEN YOU’RE DONE.</p>
            <h2>
              {remaining
                ? `${remaining} stories left to read`
                : "You’re all caught up."}
            </h2>
            <p>
              {cards.length} stories in this edition (12 at most) · Scheduled
              for 8 a.m. &amp; 8 p.m. IST. No endless feed.
            </p>
          </div>
          <div className="progress-actions">
            <span aria-live="polite">
              {readCount} of {cards.length} read <small>on this device</small>
            </span>
            <progress
              max={Math.max(1, cards.length)}
              value={readCount}
              aria-label={`${readCount} of ${cards.length} stories read`}
            />
            <button
              className="button"
              aria-pressed={unreadOnly}
              onClick={() => setUnreadOnly((v) => !v)}
            >
              {unreadOnly ? "Show all" : "Unread only"}
            </button>
            <button className="button dark" onClick={shareEdition}>
              <Share2 size={17} /> Share edition
            </button>
            <a
              className="button"
              href={`https://wa.me/?text=${encodeURIComponent(editionText)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp <ArrowUpRight size={16} />
            </a>
          </div>
        </section>
        <div className="discovery-bar">
          <nav className="topic-nav" aria-label="Story topics">
            <button
              aria-pressed={topic === "all"}
              className={topic === "all" ? "selected" : ""}
              onClick={() => setTopic("all")}
            >
              All stories
            </button>
            {available.map((t) => (
              <button
                key={t}
                aria-pressed={topic === t}
                className={topic === t ? "selected" : ""}
                onClick={() => setTopic(t)}
              >
                {TOPICS[t]}
              </button>
            ))}
          </nav>
          <label className="search-box">
            <Search size={17} />
            <input
              ref={searchRef}
              aria-label="Search stories"
              placeholder="Search the brief"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query ? (
              <button aria-label="Clear search" onClick={() => setQuery("")}>
                <X size={15} />
              </button>
            ) : (
              <kbd>/</kbd>
            )}
          </label>
        </div>
        {overview && lead && (
          <section className="front-page" aria-label="Edition highlights">
            <article className="lead-story">
              <div className="lead-label">
                <span className="eyebrow">IN FOCUS</span>
                <span className="issue-mark">01 / THE BIG PICTURE</span>
              </div>
              <Meta card={lead} />
              <button
                className="headline-button"
                onClick={() => openStory(lead)}
              >
                <h2>{lead.headline}</h2>
              </button>
              <p className="lead-summary">{lead.plain_english}</p>
              {lead.why_it_matters && (
                <div className="lead-context">
                  <span className="eyebrow">WHY IT MATTERS</span>
                  <p>{lead.why_it_matters}</p>
                </div>
              )}
              <div className="lead-bottom">
                <button className="text-link" onClick={() => openStory(lead)}>
                  Read the briefing <ArrowUpRight size={18} />
                </button>
                <SaveButton card={lead} saved={saved} onSave={toggleSave} />
              </div>
            </article>
            <aside className="essentials">
              <div className="section-heading">
                <h2>The essentials</h2>
                <span>{String(essential.length).padStart(2, "0")} STORIES</span>
              </div>
              {essential.map((c, i) => (
                <article className="essential" key={c.id}>
                  <span className="essential-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="eyebrow">
                      {TOPICS[c.category] || "Briefing"}
                    </p>
                    <button
                      className="headline-button"
                      onClick={() => openStory(c)}
                    >
                      <h3>{c.headline}</h3>
                    </button>
                    <span className="essential-source">{sourceName(c)}</span>
                  </div>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </article>
              ))}
            </aside>
          </section>
        )}
        <section id="stories" className="stories-section">
          <div className="feed-heading">
            <div>
              <p className="eyebrow">
                {savedOnly
                  ? "YOUR COLLECTION"
                  : query.trim()
                    ? "SEARCH RESULTS"
                    : "THIS EDITION"}
              </p>
              <h2>
                {savedOnly
                  ? "Saved stories"
                  : query.trim()
                    ? `Results for “${query.trim()}”`
                    : topic === "all"
                      ? archiveOpen
                        ? "Older stories — optional reading"
                        : "Your finite daily brief."
                      : TOPICS[topic]}
              </h2>
            </div>
            <label className="sort-control">
              {filtered.length} stories{" "}
              <select
                aria-label="Sort stories"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>
          </div>
          {savedOnly && (
            <p className="collection-note">
              {user
                ? "Your account bookmarks, synced across devices."
                : supabase
                  ? "Bookmarks are stored on this device. Sign in to view your account collection."
                  : "Bookmarks are stored on this device."}
            </p>
          )}
          <div className="feed-layout">
            <div className="story-list">
              {filtered.slice(0, limit).map((c) => (
                <article className="story-row" key={c.id}>
                  <div className="story-content">
                    <Meta card={c} />
                    <button
                      className="headline-button"
                      onClick={() => openStory(c)}
                    >
                      <h3>{c.headline}</h3>
                    </button>
                    <p>{c.plain_english}</p>
                    <button className="read-link" onClick={() => openStory(c)}>
                      Read briefing <ArrowUpRight size={14} />
                    </button>
                  </div>
                  <div className="row-actions">
                    <button
                      className="icon-button read-toggle"
                      aria-pressed={read.has(c.id)}
                      aria-label={`Mark ${read.has(c.id) ? "unread" : "read"}: ${c.headline}`}
                      onClick={() => {
                        if (!read.has(c.id)) markRead(c);
                        else
                          setRead((previous) => {
                            const next = new Set(previous);
                            next.delete(c.id);
                            try {
                              localStorage.setItem(
                                "ath-read-v1",
                                JSON.stringify([...next]),
                              );
                            } catch {}
                            return next;
                          });
                      }}
                    >
                      <Check size={17} />
                      {read.has(c.id) ? "Read" : "Mark read"}
                    </button>
                    <SaveButton card={c} saved={saved} onSave={toggleSave} />
                    <button
                      className="icon-button"
                      aria-label={`Share: ${c.headline}`}
                      onClick={() => share(c)}
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </article>
              ))}
              {filtered.length === 0 && (
                <div className="empty-state">
                  <Search size={28} />
                  <h3>
                    {savedOnly
                      ? "Room for your next good find."
                      : "No stories found."}
                  </h3>
                  <p>
                    {savedOnly && !query
                      ? "Save a story using its bookmark button. It will be waiting here."
                      : "Try another topic or a broader search."}
                  </p>
                  <button
                    className="button"
                    onClick={() => {
                      setQuery("");
                      setTopic("all");
                      setSavedOnly(false);
                    }}
                  >
                    Explore all stories <ArrowRight size={16} />
                  </button>
                </div>
              )}
              {!archiveOpen && !savedOnly && !query && topic === "all" && (
                <div className="edition-end">
                  <Check size={26} />
                  <h3>
                    {remaining
                      ? "That’s the whole edition."
                      : "You’re all caught up."}
                  </h3>
                  <p>
                    {remaining
                      ? `${remaining} unread stories above. Open a briefing or mark it read when you’re finished.`
                      : "Close the tab with a clear head. We’ll bring the next edition at the scheduled update."}
                  </p>
                  <button
                    className="button"
                    onClick={() => {
                      setArchiveOpen(true);
                      setUnreadOnly(false);
                    }}
                  >
                    Browse older stories (optional)
                  </button>
                </div>
              )}
              {archiveOpen && (
                <button
                  className="button"
                  onClick={() => setArchiveOpen(false)}
                >
                  Back to this edition
                </button>
              )}
              {filtered.length > limit && (
                <button
                  className="load-more"
                  onClick={() => setLimit((n) => n + 15)}
                >
                  More perspective{" "}
                  <span>{filtered.length - limit} remaining</span>
                  <ChevronDown size={17} />
                </button>
              )}
            </div>
            <aside className="sidebar">
              <div className="sidebar-note">
                <span className="eyebrow">LESS SCROLLING. MORE SIGNAL.</span>
                <h3>
                  A little context
                  <br />
                  goes a long way.
                </h3>
                <p>
                  Every brief brings together the development, its implications
                  and the original source.
                </p>
                <div className="sidebar-rule" />
                <p className="sidebar-small">
                  Summaries are AI-assisted. Implications are editorial
                  analysis, not verified predictions.
                </p>
              </div>
              <a
                className="weekly-card"
                href="https://newsletter.aitechhive.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail size={22} />
                <span className="eyebrow">THE WEEKLY EDITION</span>
                <h3>
                  Step back.
                  <br />
                  See the bigger picture.
                </h3>
                <p>Go deeper with the AITechHive newsletter.</p>
                <span className="text-link">
                  Explore the newsletter <ArrowUpRight size={16} />
                </span>
              </a>
            </aside>
          </div>
        </section>
        <footer className="footer">
          <a href="/" className="brand footer-brand">
            <Mark />
            <span>AITechHive.</span>
          </a>
          <p>Intelligence worth your attention.</p>
          <nav aria-label="Legal">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/dmca">DMCA</a>
            <a
              href="https://github.com/Sanjeevlabs/aitechhive"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <ArrowUpRight size={12} />
            </a>
          </nav>
        </footer>
      </main>
      {active && (
        <Reader
          key={active.id}
          card={active}
          saved={saved}
          onSave={toggleSave}
          onClose={closeReader}
          onShare={share}
          related={cards
            .filter((c) => c.category === active.category && c.id !== active.id)
            .slice(0, 2)}
          onRead={openStory}
        />
      )}
      {signIn && supabase && (
        <SignIn
          supabase={supabase}
          initialError={authError}
          onClose={closeAuth}
        />
      )}
      <div
        className={`toast ${notice ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {notice && (
          <>
            <Check size={16} />
            {notice}
          </>
        )}
      </div>
    </div>
  );
}

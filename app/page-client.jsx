"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark, ChevronDown, Share2, Scale, Building2, Coins, Briefcase,
  Terminal, BookOpen, FlaskConical, ExternalLink, Zap, Inbox, Mail,
  Loader2, Check, X, Archive, Sparkles, Sun, Moon,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

/* ── THEME ───────────────────────────────────────────────────── */
function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const sys = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : sys;
    setDark(isDark);
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
  }, []);
  const toggle = useCallback(() => {
    setDark((d) => {
      const next = !d;
      localStorage.setItem("theme", next ? "dark" : "light");
      document.documentElement.dataset.theme = next ? "dark" : "light";
      return next;
    });
  }, []);
  return { dark, toggle };
}

/* ── CATEGORY CONFIG ─────────────────────────────────────────── */
const CATS = {
  regulation: { label: "Regulation", Icon: Scale,        color: "var(--blue)",   soft: "var(--blue-soft)"   },
  deployment: { label: "Deployment", Icon: Building2,    color: "var(--green)",  soft: "var(--green-soft)"  },
  vendor:     { label: "Vendor",     Icon: Coins,        color: "var(--orange)", soft: "var(--orange-soft)" },
  career:     { label: "Career",     Icon: Briefcase,    color: "var(--purple)", soft: "var(--purple-soft)" },
  tool:       { label: "Tool",       Icon: Terminal,     color: "var(--indigo)", soft: "var(--indigo-soft)" },
  research:   { label: "Research",   Icon: FlaskConical, color: "var(--teal)",   soft: "var(--teal-soft)"   },
  insight:    { label: "Insight",    Icon: BookOpen,     color: "var(--gray)",   soft: "var(--gray-soft)"   },
};

// Hardcoded for html-to-image (CSS vars not resolved in off-screen capture)
const SHARE_HEX = {
  regulation: "#007AFF", deployment: "#34C759", vendor: "#FF9500",
  career:     "#AF52DE", tool:       "#5856D6", research: "#32ADE6",
  insight:    "#8E8E93",
};

const SEV_COLOR = { high: "var(--red)", med: "var(--orange)", low: "var(--gray)" };

/* ── DECK ORDERING ───────────────────────────────────────────── */
function orderDeck(cards, dismissedIds = new Set()) {
  const now = Date.now();
  return cards
    .filter((c) => !dismissedIds.has(c.id))
    .map((c) => {
      const ageH = (now - new Date(c.published_at || c.source?.date || 0).getTime()) / 3600000;
      const freshW = ageH < 12 ? 1.0 : ageH < 24 ? 0.7 : ageH < 48 ? 0.4 : 0.2;
      const sevW = c.severity === "high" ? 3 : c.severity === "med" ? 2 : 1;
      return { ...c, _score: sevW + freshW };
    })
    .sort((a, b) => b._score - a._score)
    .slice(0, 14);
}

function fmtDate() {
  return new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

/* ── MICRO-VIZ ───────────────────────────────────────────────── */
function MicroViz({ card }) {
  const meta = CATS[card.category] || CATS.insight;
  const color = meta.color;

  if (card.category === "regulation" && card.effective_date) {
    const days = Math.round((new Date(card.effective_date) - Date.now()) / 86400000);
    const fill = days < 0 ? 100 : Math.max(0, 100 - (days / 365) * 100);
    const bar = days < 0 ? "var(--green)" : days < 90 ? "var(--red)" : days < 180 ? "var(--orange)" : "var(--gray)";
    return (
      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Effective</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: bar }}>{days < 0 ? "In force" : `In ${days} days`}</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: "var(--separator)", overflow: "hidden" }}>
          <div style={{ width: `${fill}%`, height: "100%", background: bar, borderRadius: 2, transition: "width 0.6s ease" }} />
        </div>
      </div>
    );
  }

  if (card.category === "vendor" && card.amount) return (
    <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", gap: 8 }}>
      <span style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>{card.amount}</span>
      {card.round && <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>{card.round}</span>}
    </div>
  );

  if (card.category === "career" && card.comp_low && card.comp_high) {
    const cur = { USD: "$", GBP: "£", EUR: "€" }[card.currency] || "";
    const fmt = (n) => n >= 1000 ? `${cur}${Math.round(n / 1000)}K` : `${cur}${n}`;
    return (
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Total comp</div>
        <div style={{ fontSize: 22, fontWeight: 800, color }}>{fmt(card.comp_low)} – {fmt(card.comp_high)}</div>
      </div>
    );
  }

  if (card.category === "tool" && card.stars) {
    const d = card.stars_delta_7d;
    const s = card.stars >= 1000 ? `${(card.stars / 1000).toFixed(1)}K` : card.stars;
    return (
      <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: 26, fontWeight: 800, color }}>{s} ★</span>
        {d != null && <span style={{ fontSize: 12, fontWeight: 600, color: d > 0 ? "var(--green)" : "var(--gray)" }}>{d > 0 ? `+${d}` : d}/wk</span>}
      </div>
    );
  }

  if (card.category === "research" && card.delta_pts != null) return (
    <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", gap: 8 }}>
      <span style={{ fontSize: 26, fontWeight: 800, color }}>{card.delta_pts > 0 ? "+" : ""}{card.delta_pts} pts</span>
      {card.benchmark_name && <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>on {card.benchmark_name}</span>}
    </div>
  );

  if (card.category === "insight" && card.stat_value) return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontSize: 32, fontWeight: 800, color }}>{card.stat_value}</div>
      {card.stat_label && <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>{card.stat_label}</div>}
    </div>
  );

  return null;
}

/* ── STORY CARD ──────────────────────────────────────────────── */
function StoryCard({ card, onDecode, expanded }) {
  const meta = CATS[card.category] || CATS.insight;
  const { Icon } = meta;

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      background: "var(--card)", borderRadius: 20,
      border: "1px solid var(--separator)",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderBottom: "1px solid var(--separator)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: meta.soft, color: meta.color, fontSize: 11, fontWeight: 700 }}>
            <Icon size={11} strokeWidth={2.5} />{meta.label}
          </span>
          {card.jurisdiction && (
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)" }}>{card.jurisdiction}</span>
          )}
        </div>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: SEV_COLOR[card.severity] || "var(--gray)", flexShrink: 0 }} />
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "16px 16px 0", WebkitOverflowScrolling: "touch" }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.018em", color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}>
          {card.headline}
        </h2>

        <p style={{ margin: "11px 0 0", fontSize: 15, lineHeight: 1.6, color: "var(--text-secondary)" }}>
          {card.plain_english}
        </p>

        <MicroViz card={card} />

        <div style={{ marginTop: 14, padding: "11px 13px", borderRadius: 12, background: meta.soft, borderLeft: `3px solid ${meta.color}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: meta.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3, display: "flex", alignItems: "center", gap: 3 }}>
            <Zap size={10} />Why it matters
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--text-primary)" }}>{card.why_it_matters}</p>
        </div>

        <AnimatePresence>
          {expanded && card.jargon?.length > 0 && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} style={{ overflow: "hidden" }}>
              <div style={{ margin: "12px 0 4px", padding: "12px 13px", borderRadius: 12, background: "var(--card-secondary)", border: "1px solid var(--separator)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Jargon decoded</div>
                {card.jargon.map((j, i) => (
                  <div key={i} style={{ marginBottom: i < card.jargon.length - 1 ? 10 : 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{j.term}</div>
                    <div style={{ fontSize: 13, lineHeight: 1.4, color: "var(--text-secondary)", marginTop: 2 }}>{j.def}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div style={{ flexShrink: 0, padding: "10px 16px 13px", borderTop: "1px solid var(--separator)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href={card.source?.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
          style={{ fontSize: 12, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
          {card.source?.name}<ExternalLink size={10} />
        </a>
        {card.jargon?.length > 0 && (
          <button onClick={onDecode} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: meta.color, padding: 0 }}>
            {expanded ? "Hide" : "Jargon"}
            <ChevronDown size={12} style={{ transition: "transform 0.18s", transform: expanded ? "rotate(180deg)" : "none" }} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ── SIGNUP GATE ─────────────────────────────────────────────── */
function SignupGate({ supabase, onClose }) {
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState("idle");
  const [error, setError] = useState("");

  const signInGoogle = async () => {
    setPhase("loading");
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/api/auth/callback` } });
    if (error) { setError(error.message); setPhase("error"); }
  };

  const signInEmail = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email."); return; }
    setPhase("loading"); setError("");
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` } });
    if (error) { setError(error.message); setPhase("error"); }
    else setPhase("sent");
  };

  return (
    <div style={{ padding: "28px 22px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
        <Sparkles size={13} style={{ color: "var(--blue)" }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Keep reading</span>
      </div>
      <h2 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 800, lineHeight: 1.1, color: "var(--text-primary)", letterSpacing: "-0.025em" }}>Sign in to continue.</h2>
      <p style={{ margin: "0 0 22px", fontSize: 15, lineHeight: 1.55, color: "var(--text-secondary)" }}>Free. No newsletters. Saves sync across devices.</p>

      {phase === "sent" ? (
        <div style={{ padding: "16px", borderRadius: 14, background: "var(--green-soft)", border: "1px solid var(--green)", display: "flex", flexDirection: "column", gap: 8 }}>
          <Check size={20} style={{ color: "var(--green)" }} />
          <p style={{ margin: 0, fontSize: 15, color: "var(--text-primary)" }}>Magic link sent — check your inbox.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={signInGoogle} disabled={phase === "loading"}
            style={{ width: "100%", padding: "13px 16px", borderRadius: 13, background: "var(--card-secondary)", border: "1px solid var(--separator)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: "var(--separator)" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "var(--separator)" }} />
          </div>
          <input type="email" inputMode="email" autoComplete="email" value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="you@company.com"
            style={{ width: "100%", padding: "13px 14px", borderRadius: 13, fontSize: 15, background: "var(--card-secondary)", border: `1px solid ${error ? "var(--red)" : "var(--separator)"}`, color: "var(--text-primary)", outline: "none" }} />
          <button onClick={signInEmail} disabled={phase === "loading"}
            style={{ width: "100%", padding: "13px 16px", borderRadius: 13, background: "var(--blue)", color: "white", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {phase === "loading" ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
            Send Magic Link
          </button>
          {error && <p style={{ margin: 0, fontSize: 13, color: "var(--red)" }}>{error}</p>}
        </div>
      )}

      <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
          <a href="/privacy" style={{ color: "inherit" }}>Privacy</a>{" · "}<a href="/terms" style={{ color: "inherit" }}>Terms</a>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", padding: 0 }}>Skip for now</button>
      </div>
    </div>
  );
}

/* ── BOTTOM SHEET ────────────────────────────────────────────── */
function Sheet({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} />
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 38 }}
            style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 50, maxWidth: 480, margin: "0 auto", background: "var(--card)", borderRadius: "22px 22px 0 0", boxShadow: "0 -4px 32px rgba(0,0,0,0.15)", maxHeight: "85vh", display: "flex", flexDirection: "column", paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--separator)", margin: "12px auto 0", flexShrink: 0 }} />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── SAVED SHEET ─────────────────────────────────────────────── */
function SavedSheet({ open, onClose, items, onClear }) {
  return (
    <Sheet open={open} onClose={onClose}>
      <div style={{ flexShrink: 0, padding: "12px 18px 10px", borderBottom: "1px solid var(--separator)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Saved · {items.length}</div>
          <h3 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.015em" }}>Reading list</h3>
        </div>
        {items.length > 0 && <button onClick={onClear} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "var(--red)", padding: 0 }}>Clear</button>}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
        {items.length === 0 && <p style={{ textAlign: "center", padding: "40px 0", fontSize: 15, color: "var(--text-secondary)" }}>Tap Save to bookmark stories.</p>}
        {items.map((c) => {
          const meta = CATS[c.category] || CATS.insight;
          return (
            <a key={c.id} href={c.source?.url} target="_blank" rel="noreferrer"
              style={{ display: "block", padding: "12px 14px", borderRadius: 14, background: "var(--card-secondary)", border: "1px solid var(--separator)", textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                <meta.Icon size={11} style={{ color: meta.color }} strokeWidth={2.5} />
                <span style={{ fontSize: 11, fontWeight: 700, color: meta.color }}>{meta.label}</span>
              </div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, lineHeight: 1.3, color: "var(--text-primary)" }}>{c.headline}</p>
            </a>
          );
        })}
      </div>
    </Sheet>
  );
}

/* ── ARCHIVE SHEET ───────────────────────────────────────────── */
function ArchiveSheet({ open, onClose, allCards, savedIds }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let xs = allCards;
    if (filter !== "all") xs = xs.filter((c) => c.category === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      xs = xs.filter((c) => (c.headline || "").toLowerCase().includes(q) || (c.plain_english || "").toLowerCase().includes(q));
    }
    return [...xs].sort((a, b) => {
      const s = (savedIds.has(b.id) ? 1 : 0) - (savedIds.has(a.id) ? 1 : 0);
      return s !== 0 ? s : new Date(b.published_at || 0) - new Date(a.published_at || 0);
    });
  }, [allCards, filter, search, savedIds]);

  return (
    <Sheet open={open} onClose={onClose}>
      <div style={{ flexShrink: 0, padding: "12px 18px 10px", borderBottom: "1px solid var(--separator)" }}>
        <h3 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.015em" }}>Archive · {allCards.length}</h3>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search headlines..."
          style={{ width: "100%", padding: "9px 13px", borderRadius: 11, fontSize: 14, background: "var(--card-secondary)", border: "1px solid var(--separator)", color: "var(--text-primary)", outline: "none" }} />
        <div style={{ display: "flex", gap: 6, overflowX: "auto", marginTop: 10, scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
          {["all", ...Object.keys(CATS)].map((k) => (
            <button key={k} onClick={() => setFilter(k)}
              style={{ flexShrink: 0, padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "none", background: filter === k ? "var(--blue)" : "var(--card-secondary)", color: filter === k ? "white" : "var(--text-secondary)" }}>
              {k === "all" ? "All" : CATS[k].label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 18px", display: "flex", flexDirection: "column", gap: 7 }}>
        {filtered.length === 0 && <p style={{ textAlign: "center", padding: "40px 0", fontSize: 15, color: "var(--text-secondary)" }}>No matches.</p>}
        {filtered.map((c) => {
          const meta = CATS[c.category] || CATS.insight;
          return (
            <a key={c.id} href={c.source?.url} target="_blank" rel="noreferrer"
              style={{ display: "flex", gap: 11, padding: "11px 13px", borderRadius: 13, background: "var(--card-secondary)", border: "1px solid var(--separator)", textDecoration: "none", alignItems: "flex-start" }}>
              <meta.Icon size={13} style={{ color: meta.color, marginTop: 2, flexShrink: 0 }} strokeWidth={2.5} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: meta.color }}>{meta.label}</span>
                  {savedIds.has(c.id) && <Bookmark size={10} fill={meta.color} style={{ color: meta.color }} />}
                </div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, lineHeight: 1.3, color: "var(--text-primary)" }}>{c.headline}</p>
              </div>
            </a>
          );
        })}
      </div>
    </Sheet>
  );
}

/* ── SHARE MODAL ─────────────────────────────────────────────── */
function ShareModal({ open, onClose, card }) {
  const captureRef = useRef(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!card) return null;
  const meta = CATS[card.category] || CATS.insight;
  const hex = SHARE_HEX[card.category] || "#8E8E93";

  const handleShare = async () => {
    if (!captureRef.current) return;
    setGenerating(true);
    try {
      const { toPng } = await import("html-to-image");
      // captureRef is a fixed 540×540 div off-screen → pixelRatio:2 = 1080×1080 clean output
      const dataUrl = await toPng(captureRef.current, { pixelRatio: 2, cacheBust: true });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `aitechhive-${card.id}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: card.headline, url: `${window.location.origin}/c/${card.id}` });
      } else {
        const a = document.createElement("a");
        a.href = dataUrl; a.download = `aitechhive-${card.id}.png`; a.click();
      }
    } catch (e) { console.error(e); }
    finally { setGenerating(false); }
  };

  const handleCopyLink = async () => {
    try { await navigator.clipboard.writeText(`${window.location.origin}/c/${card.id}`); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  return (
    <>
      {/* Off-screen 540×540 capture target → 1080×1080 @2x */}
      <div ref={captureRef} style={{
        position: "fixed", left: -9999, top: 0, width: 540, height: 540,
        background: "white", fontFamily: "-apple-system,system-ui,sans-serif",
        padding: 36, display: "flex", flexDirection: "column", borderRadius: 0, overflow: "hidden",
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 20, background: `${hex}18`, marginBottom: 16, alignSelf: "flex-start" }}>
          <meta.Icon size={12} style={{ color: hex }} strokeWidth={2.5} />
          <span style={{ fontSize: 12, fontWeight: 700, color: hex }}>{meta.label}{card.jurisdiction ? ` · ${card.jurisdiction}` : ""}</span>
        </div>
        <h2 style={{ margin: "0 0 12px", fontSize: 26, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em", color: "#000" }}>{card.headline}</h2>
        <p style={{ margin: "0 0 14px", fontSize: 14, lineHeight: 1.6, color: "#3C3C43", flex: 1 }}>
          {(card.plain_english || "").slice(0, 220)}{(card.plain_english || "").length > 220 ? "…" : ""}
        </p>
        <div style={{ padding: "11px 13px", borderRadius: 12, background: `${hex}12`, borderLeft: `3px solid ${hex}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: hex, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Why it matters</div>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "#000" }}>
            {(card.why_it_matters || "").slice(0, 150)}{(card.why_it_matters || "").length > 150 ? "…" : ""}
          </p>
        </div>
        <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#000" }}>AITechHive</span>
          <span style={{ fontSize: 12, color: "#8E8E93" }}>aitechhive.com</span>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
              style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 38 }}
              style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 50, maxWidth: 480, margin: "0 auto", background: "var(--card)", borderRadius: "22px 22px 0 0", padding: "20px 18px max(18px, env(safe-area-inset-bottom))", boxShadow: "0 -4px 32px rgba(0,0,0,0.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>Share this card</h3>
                <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--card-secondary)", border: "none", cursor: "pointer", display: "grid", placeItems: "center", color: "var(--text-secondary)" }}>
                  <X size={14} />
                </button>
              </div>
              <div style={{ padding: "12px 14px", borderRadius: 13, background: "var(--card-secondary)", border: "1px solid var(--separator)", marginBottom: 13 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: meta.color }}>{meta.label}</span>
                <p style={{ margin: "5px 0 0", fontSize: 15, fontWeight: 700, lineHeight: 1.3, color: "var(--text-primary)" }}>{card.headline}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
                <button onClick={handleShare} disabled={generating}
                  style={{ padding: 13, borderRadius: 13, background: "var(--blue)", color: "white", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                  {generating ? <Loader2 size={15} className="animate-spin" /> : <Share2 size={15} />}
                  {generating ? "…" : "Share Image"}
                </button>
                <button onClick={handleCopyLink}
                  style={{ padding: 13, borderRadius: 13, background: "var(--card-secondary)", color: copied ? "var(--green)" : "var(--text-primary)", fontSize: 15, fontWeight: 700, border: "1px solid var(--separator)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                  {copied ? <Check size={15} /> : null}{copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── EMPTY STATE ─────────────────────────────────────────────── */
function EmptyState({ stats, onReshuffle, onOpenArchive }) {
  return (
    <div style={{ height: "100%", background: "var(--card)", borderRadius: 20, border: "1px solid var(--separator)", display: "flex", flexDirection: "column", padding: "26px 20px" }}>
      <Inbox size={26} style={{ color: "var(--text-tertiary)", marginBottom: 14 }} />
      <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>That's today's signal.</h3>
      <p style={{ margin: "9px 0 0", fontSize: 15, lineHeight: 1.5, color: "var(--text-secondary)" }}>Six refreshes daily. Full archive below.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 20 }}>
        {[["Saved", stats.saved, "var(--green)"], ["Skipped", stats.next, "var(--text-tertiary)"], ["Shared", stats.shared, "var(--blue)"]].map(([l, v, c]) => (
          <div key={l} style={{ textAlign: "center", padding: "13px 6px", borderRadius: 13, background: "var(--card-secondary)", border: "1px solid var(--separator)" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: c }}>{v}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-secondary)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.04em" }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "auto", paddingTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={onOpenArchive} style={{ width: "100%", padding: 13, borderRadius: 13, background: "var(--blue)", color: "white", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer" }}>Open Archive</button>
        <button onClick={onReshuffle} style={{ width: "100%", padding: 12, borderRadius: 13, background: "var(--card-secondary)", color: "var(--text-secondary)", fontSize: 15, fontWeight: 600, border: "1px solid var(--separator)", cursor: "pointer" }}>Replay Deck</button>
      </div>
    </div>
  );
}

/* ── ICON BUTTON ─────────────────────────────────────────────── */
function IconBtn({ children, onClick, label, badge }) {
  return (
    <button onClick={onClick} aria-label={label} style={{ position: "relative", width: 36, height: 36, borderRadius: "50%", background: "var(--card)", border: "1px solid var(--separator)", display: "grid", placeItems: "center", cursor: "pointer", color: "var(--text-primary)", flexShrink: 0 }}>
      {children}
      {badge > 0 && <span style={{ position: "absolute", top: -3, right: -3, minWidth: 16, height: 16, borderRadius: 8, background: "var(--blue)", color: "white", fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center", padding: "0 3px" }}>{badge}</span>}
    </button>
  );
}

/* ── ACTION BUTTON ───────────────────────────────────────────── */
function ActionBtn({ label, onClick, bg, color, border, children }) {
  return (
    <button onClick={onClick} aria-label={label}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, padding: "10px 6px", borderRadius: 15, background: bg, color, border: border ? "1.5px solid var(--separator)" : "none", cursor: "pointer", fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", userSelect: "none", WebkitUserSelect: "none" }}
      onPointerDown={(e) => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.transform = "scale(0.94)"; }}
      onPointerUp={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
      onPointerLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}>
      {children}
      {label}
    </button>
  );
}

/* ── ROOT ────────────────────────────────────────────────────── */
export default function PageClient({ initialCards }) {
  const { dark, toggle: toggleTheme } = useTheme();
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ), []);

  const [allCards] = useState(initialCards || []);
  const [user, setUser] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [dismissedIds, setDismissedIds] = useState(new Set());
  const [savedCards, setSavedCards] = useState([]);
  const [deckPos, setDeckPos] = useState(0);
  const [stats, setStats] = useState({ saved: 0, next: 0, shared: 0 });
  const [expandedId, setExpandedId] = useState(null);
  const [savedOpen, setSavedOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [shareCard, setShareCard] = useState(null);
  const [showGate, setShowGate] = useState(false);
  const [gateSkipped, setGateSkipped] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user || null));
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!user) { setSavedIds(new Set()); setDismissedIds(new Set()); setSavedCards([]); return; }
    supabase.from("saves").select("card_id").then(({ data }) => {
      const ids = new Set((data || []).map((r) => r.card_id));
      setSavedIds(ids);
      setSavedCards(allCards.filter((c) => ids.has(c.id)));
    });
    supabase.from("dismissed").select("card_id").then(({ data }) => {
      setDismissedIds(new Set((data || []).map((r) => r.card_id)));
    });
  }, [user, supabase, allCards]);

  const deck = useMemo(() => orderDeck(allCards, dismissedIds), [allCards, dismissedIds]);
  const topCard = deck[deckPos] ?? null;

  // Gate fires once after advancing past card 3
  useEffect(() => {
    if (deckPos >= 3 && !user && !gateSkipped && !showGate) setShowGate(true);
  }, [deckPos, user, gateSkipped, showGate]);

  const doAction = useCallback(async (action) => {
    if (!topCard) return;

    if (action === "decode") {
      setExpandedId((id) => id === topCard.id ? null : topCard.id);
      return;
    }
    if (action === "share") {
      setShareCard(topCard);
      setStats((s) => ({ ...s, shared: s.shared + 1 }));
      if (user) supabase.from("shares").insert({ user_id: user.id, card_id: topCard.id });
      return;
    }

    setExpandedId(null);
    if (action === "save") {
      setSavedIds((s) => new Set([...s, topCard.id]));
      setSavedCards((s) => [topCard, ...s.filter((c) => c.id !== topCard.id)]);
      setStats((s) => ({ ...s, saved: s.saved + 1 }));
      if (user) supabase.from("saves").upsert({ user_id: user.id, card_id: topCard.id });
    } else {
      setDismissedIds((s) => new Set([...s, topCard.id]));
      setStats((s) => ({ ...s, next: s.next + 1 }));
      if (user) supabase.from("dismissed").upsert({ user_id: user.id, card_id: topCard.id });
    }
    setDeckPos((p) => p + 1);
  }, [topCard, user, supabase]);

  useEffect(() => {
    const map = { ArrowRight: "save", ArrowLeft: "next", ArrowUp: "share", ArrowDown: "decode" };
    const onKey = (e) => {
      if (savedOpen || archiveOpen || shareCard || showGate || e.target.tagName === "INPUT") return;
      if (map[e.key]) { e.preventDefault(); doAction(map[e.key]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doAction, savedOpen, archiveOpen, shareCard, showGate]);

  const isEmpty = !topCard;

  return (
    <main style={{ height: "100svh", display: "flex", flexDirection: "column", background: "var(--bg)", color: "var(--text-primary)", paddingTop: "env(safe-area-inset-top)", overflow: "hidden", fontFamily: "var(--font-sans)" }}>

      {/* ── Masthead ─────────────────────────────────────────── */}
      <header style={{ flexShrink: 0, padding: "13px 16px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 19, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>AITechHive</div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-tertiary)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>BFSI · Enterprise AI · {fmtDate()}</div>
        </div>
        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
          <IconBtn onClick={toggleTheme} label="Toggle theme">{dark ? <Sun size={15} /> : <Moon size={15} />}</IconBtn>
          <IconBtn onClick={() => setArchiveOpen(true)} label="Archive"><Archive size={15} /></IconBtn>
          <IconBtn onClick={() => setSavedOpen(true)} label="Saved" badge={savedIds.size}><Bookmark size={15} /></IconBtn>
          {!user && (
            <button onClick={() => setShowGate(true)} style={{ height: 34, padding: "0 13px", borderRadius: 17, background: "var(--blue)", color: "white", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
              <Mail size={12} />Sign in
            </button>
          )}
        </div>
      </header>

      {/* ── Progress bar ─────────────────────────────────────── */}
      {deck.length > 0 && (
        <div style={{ flexShrink: 0, padding: "0 16px 8px", display: "flex", alignItems: "center", gap: 3 }}>
          {deck.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, transition: "background 0.25s", background: i < deckPos ? "var(--blue)" : "var(--separator)" }} />
          ))}
          <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
            {Math.min(deckPos, deck.length)}/{deck.length}
          </span>
        </div>
      )}

      {/* ── Card area ────────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, position: "relative", margin: "0 12px" }}>
        <AnimatePresence mode="wait" initial={false}>
          {isEmpty ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "absolute", inset: 0 }}>
              <EmptyState stats={stats} onReshuffle={() => { setDeckPos(0); setStats({ saved: 0, next: 0, shared: 0 }); }} onOpenArchive={() => setArchiveOpen(true)} />
            </motion.div>
          ) : (
            <motion.div
              key={topCard.id}
              initial={{ y: 18, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -18, opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 42 }}
              style={{ position: "absolute", inset: 0, maxWidth: 460, left: "50%", transform: "translateX(-50%)", width: "100%" }}>
              <StoryCard card={topCard} onDecode={() => doAction("decode")} expanded={expandedId === topCard.id} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Action bar ───────────────────────────────────────── */}
      {!isEmpty && (
        <div style={{ flexShrink: 0, padding: "8px 12px max(12px, env(safe-area-inset-bottom))" }}>
          <div style={{ maxWidth: 460, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 7 }}>
            <ActionBtn label="Skip" onClick={() => doAction("next")} bg="var(--card)" color="var(--text-secondary)" border>
              <X size={20} strokeWidth={2.5} />
            </ActionBtn>
            <ActionBtn label="Decode" onClick={() => doAction("decode")} bg="var(--card)" color={expandedId === topCard?.id ? "var(--blue)" : "var(--text-secondary)"} border>
              <ChevronDown size={20} strokeWidth={2.5} style={{ transition: "transform 0.18s", transform: expandedId === topCard?.id ? "rotate(180deg)" : "none" }} />
            </ActionBtn>
            <ActionBtn label="Share" onClick={() => doAction("share")} bg="var(--blue-soft)" color="var(--blue)">
              <Share2 size={20} strokeWidth={2.5} />
            </ActionBtn>
            <ActionBtn label="Save" onClick={() => doAction("save")} bg="var(--green)" color="white">
              <Bookmark size={20} strokeWidth={2.5} fill={savedIds.has(topCard?.id) ? "white" : "none"} />
            </ActionBtn>
          </div>
        </div>
      )}

      {/* ── Gate modal ───────────────────────────────────────── */}
      <AnimatePresence>
        {showGate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)" }} />
            <motion.div initial={{ scale: 0.94, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              style={{ position: "fixed", inset: 0, zIndex: 61, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
              <div style={{ width: "100%", maxWidth: 400, background: "var(--card)", borderRadius: 24, overflowY: "auto", maxHeight: "90vh" }}>
                <SignupGate supabase={supabase} onClose={() => { setShowGate(false); setGateSkipped(true); }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SavedSheet open={savedOpen} onClose={() => setSavedOpen(false)} items={savedCards}
        onClear={async () => { if (user) await supabase.from("saves").delete().eq("user_id", user.id); setSavedIds(new Set()); setSavedCards([]); }} />
      <ArchiveSheet open={archiveOpen} onClose={() => setArchiveOpen(false)} allCards={allCards} savedIds={savedIds} />
      <ShareModal open={!!shareCard} onClose={() => setShareCard(null)} card={shareCard} />
    </main>
  );
}

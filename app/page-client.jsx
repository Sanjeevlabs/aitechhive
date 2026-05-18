"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  AnimatePresence, motion,
  useMotionValue, useTransform, animate,
} from "framer-motion";
import {
  Bookmark, Share2, Scale, Building2, Coins, Briefcase,
  Terminal, BookOpen, FlaskConical, ExternalLink, Zap, Inbox, Mail,
  Loader2, Check, X, Archive, Sun, Moon, Globe,
  GraduationCap, Flame, RefreshCw,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

/* ─────────────────────────────────────────────────────────────────
   THEME
───────────────────────────────────────────────────────────────── */
function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const sys = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : sys;
    setDark(isDark);
    document.documentElement.dataset.theme = isDark ? "dark" : "";
  }, []);
  const toggle = useCallback(() => {
    setDark((d) => {
      const next = !d;
      localStorage.setItem("theme", next ? "dark" : "light");
      document.documentElement.dataset.theme = next ? "dark" : "";
      return next;
    });
  }, []);
  return { dark, toggle };
}

/* ─────────────────────────────────────────────────────────────────
   CATEGORY CONFIG
───────────────────────────────────────────────────────────────── */
const CATS = {
  trending:   { label: "Trending",   Icon: Flame,         color: "var(--red)",    soft: "var(--red-soft)",    hex: "#FF3B30" },
  learner:    { label: "Learner",    Icon: GraduationCap, color: "var(--yellow)", soft: "var(--yellow-soft)", hex: "#FFCC00" },
  regulation: { label: "Regulation", Icon: Scale,         color: "var(--blue)",   soft: "var(--blue-soft)",   hex: "#007AFF" },
  deployment: { label: "Deployment", Icon: Building2,     color: "var(--green)",  soft: "var(--green-soft)",  hex: "#34C759" },
  vendor:     { label: "Vendor",     Icon: Coins,         color: "var(--orange)", soft: "var(--orange-soft)", hex: "#FF9500" },
  career:     { label: "Career",     Icon: Briefcase,     color: "var(--purple)", soft: "var(--purple-soft)", hex: "#AF52DE" },
  tool:       { label: "Tool",       Icon: Terminal,      color: "var(--indigo)", soft: "var(--indigo-soft)", hex: "#5856D6" },
  research:   { label: "Research",   Icon: FlaskConical,  color: "var(--teal)",   soft: "var(--teal-soft)",   hex: "#32ADE6" },
  insight:    { label: "Insight",    Icon: BookOpen,      color: "var(--gray)",   soft: "var(--gray-soft)",   hex: "#8E8E93" },
  frontier:   { label: "Frontier AI", Icon: Globe,        color: "var(--mint)",   soft: "var(--mint-soft)",   hex: "#00C7BE" },
};

// Hardcoded for html-to-image (CSS vars not resolved in off-screen capture)
const SHARE_HEX = {
  trending: "#FF3B30", learner: "#FFCC00",
  regulation: "#007AFF", deployment: "#34C759", vendor: "#FF9500",
  career: "#AF52DE", tool: "#5856D6", research: "#32ADE6", insight: "#8E8E93", frontier: "#00C7BE",
};

/* ─────────────────────────────────────────────────────────────────
   DECK ORDERING
   deckActed = cards you've saved OR skipped this session (+ DB dismissed).
   Always show deck[0] — no deckPos index needed.
───────────────────────────────────────────────────────────────── */
function orderDeck(cards, deckActed = new Set(), catFilter = "all") {
  const now = Date.now();
  return cards
    .filter((c) => !deckActed.has(c.id))
    .filter((c) => catFilter === "all" || c.category === catFilter)
    .map((c) => {
      const ageH = (now - new Date(c.published_at || c.source?.date || 0).getTime()) / 3600000;
      const freshW = ageH < 12 ? 1.0 : ageH < 24 ? 0.7 : ageH < 48 ? 0.4 : 0.2;
      const sevW = c.severity === "high" ? 3 : c.severity === "med" ? 2 : 1;
      return { ...c, _score: sevW + freshW };
    })
    .sort((a, b) => b._score - a._score)
    .slice(0, 20);
}


/* ─────────────────────────────────────────────────────────────────
   MICRO-VIZ
───────────────────────────────────────────────────────────────── */
function MicroViz({ card }) {
  const meta = CATS[card.category] || CATS.insight;
  const { color } = meta;

  if (card.category === "regulation" && card.effective_date) {
    const days = Math.round((new Date(card.effective_date) - Date.now()) / 86400000);
    const fill = days < 0 ? 100 : Math.max(0, 100 - (days / 365) * 100);
    const bar = days < 0 ? "var(--green)" : days < 90 ? "var(--red)" : days < 180 ? "var(--orange)" : "var(--gray)";
    return (
      <div style={{ margin: "14px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Effective</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: bar }}>{days < 0 ? "In force" : `In ${days} days`}</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: "var(--separator)", overflow: "hidden" }}>
          <div style={{ width: `${fill}%`, height: "100%", background: bar, borderRadius: 3, transition: "width 0.6s ease" }} />
        </div>
      </div>
    );
  }

  if (card.category === "vendor" && card.amount) return (
    <div style={{ margin: "14px 0", display: "flex", alignItems: "baseline", gap: 8 }}>
      <span style={{ fontSize: 34, fontWeight: 900, color, lineHeight: 1, fontFamily: "var(--font-mono)" }}>{card.amount}</span>
      {card.round && <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{card.round}</span>}
    </div>
  );

  if (card.category === "career" && card.comp_low && card.comp_high) {
    const cur = { USD: "$", GBP: "£", EUR: "€" }[card.currency] || "";
    const fmt = (n) => n >= 1000 ? `${cur}${Math.round(n / 1000)}K` : `${cur}${n}`;
    return (
      <div style={{ margin: "14px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Total Comp</div>
        <div style={{ fontSize: 26, fontWeight: 900, color, fontFamily: "var(--font-mono)" }}>{fmt(card.comp_low)} – {fmt(card.comp_high)}</div>
      </div>
    );
  }

  if (card.category === "tool" && card.stars) {
    const d = card.stars_delta_7d;
    const s = card.stars >= 1000 ? `${(card.stars / 1000).toFixed(1)}K` : card.stars;
    return (
      <div style={{ margin: "14px 0", display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: 28, fontWeight: 900, color, fontFamily: "var(--font-mono)" }}>{s} ★</span>
        {d != null && <span style={{ fontSize: 12, fontWeight: 700, color: d > 0 ? "var(--green)" : "var(--gray)" }}>{d > 0 ? `+${d}` : d}/wk</span>}
      </div>
    );
  }

  if (card.category === "research" && card.delta_pts != null) return (
    <div style={{ margin: "14px 0", display: "flex", alignItems: "baseline", gap: 8 }}>
      <span style={{ fontSize: 28, fontWeight: 900, color, fontFamily: "var(--font-mono)" }}>{card.delta_pts > 0 ? "+" : ""}{card.delta_pts} pts</span>
      {card.benchmark_name && <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>{card.benchmark_name}</span>}
    </div>
  );

  if (card.category === "insight" && card.stat_value) return (
    <div style={{ margin: "14px 0" }}>
      <div style={{ fontSize: 34, fontWeight: 900, color, fontFamily: "var(--font-mono)" }}>{card.stat_value}</div>
      {card.stat_label && <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>{card.stat_label}</div>}
    </div>
  );

  return null;
}

/* ─────────────────────────────────────────────────────────────────
   STORY CARD  —  AIDA layout
   A: Attention  = Category hero + Headline (in gradient)
   I: Interest   = Plain-English summary + MicroViz
   D: Desire     = Why it matters
   A: Action     = Source link footer (tap actions are in the bar below)
───────────────────────────────────────────────────────────────── */
function StoryCard({ card }) {
  const meta = CATS[card.category] || CATS.insight;
  const { Icon, hex } = meta;

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      background: "var(--card)", borderRadius: 24,
      border: "1px solid rgba(0,0,0,0.07)",
      boxShadow: [
        "0 1px 2px rgba(0,0,0,0.04)",
        "0 4px 14px rgba(0,0,0,0.08)",
        "0 20px 52px rgba(0,0,0,0.13)",
        "0 40px 80px rgba(0,0,0,0.08)",
      ].join(", "),
      overflow: "hidden",
      userSelect: "none", WebkitUserSelect: "none",
    }}>

      {/* ── A — ATTENTION: Hero + Headline ─────────── */}
      <div style={{
        flexShrink: 0,
        background: `linear-gradient(150deg, ${hex} 0%, ${hex}DD 55%, ${hex}99 100%)`,
        padding: "16px 18px 20px",
        position: "relative", overflow: "hidden",
        minHeight: 148,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(0,0,0,0.12)",
      }}>
        {/* Ghost icon — decorative depth */}
        <div style={{ position: "absolute", right: -28, top: -28, opacity: 0.11, pointerEvents: "none" }}>
          <Icon size={168} strokeWidth={0.8} color="white" />
        </div>

        {/* Top row: category pill + severity badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: "rgba(255,255,255,0.22)",
              border: "1px solid rgba(255,255,255,0.30)",
              display: "grid", placeItems: "center",
              backdropFilter: "blur(8px)",
            }}>
              <Icon size={15} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.95)", letterSpacing: "0.005em" }}>{meta.label}</span>
              {card.jurisdiction && (
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginLeft: 7 }}>· {card.jurisdiction}</span>
              )}
            </div>
          </div>
          {card.severity === "high" && (
            <span style={{
              fontSize: 9, fontWeight: 700, color: "white",
              background: "rgba(255,255,255,0.22)",
              border: "1px solid rgba(255,255,255,0.32)",
              padding: "3px 9px", borderRadius: 100,
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>HIGH</span>
          )}
        </div>

        {/* Headline — the attention hook */}
        <h2 style={{
          margin: "14px 0 0", zIndex: 1, position: "relative",
          fontSize: 21, fontWeight: 600, lineHeight: 1.28,
          letterSpacing: "-0.015em",
          color: "white",
          fontFamily: "var(--font-serif)",
          textShadow: "0 1px 6px rgba(0,0,0,0.22)",
        }}>
          {card.headline}
        </h2>
      </div>

      {/* ── I — INTEREST + D — DESIRE: Scrollable body ─ */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "16px 18px 8px", WebkitOverflowScrolling: "touch" }}>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.68, color: "var(--text-secondary)" }}>
          {card.plain_english}
        </p>

        <MicroViz card={card} />

        {/* Desire: why it matters */}
        {card.why_it_matters && (
          <div style={{
            margin: "14px 0 0", padding: "13px 14px",
            borderRadius: 14,
            background: meta.soft,
            borderLeft: `3px solid ${meta.color}`,
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: meta.color,
              textTransform: "uppercase", letterSpacing: "0.09em",
              marginBottom: 5, display: "flex", alignItems: "center", gap: 4,
            }}>
              <Zap size={9} />Why it matters
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--text-primary)" }}>{card.why_it_matters}</p>
          </div>
        )}

        <div style={{ height: 14 }} />
      </div>

      {/* ── A — ACTION: Source footer ─────────────────── */}
      <div style={{
        flexShrink: 0, padding: "10px 18px 14px",
        borderTop: "1px solid var(--separator)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <a
          href={card.source?.url} target="_blank" rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}
        >
          {card.source?.name}
          <ExternalLink size={10} />
        </a>
        <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-tertiary)", opacity: 0.6 }}>aitechhive.com</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   DRAGGABLE CARD WRAPPER  — core swipe interaction
   NOTE: DO NOT put transform:translateX here — Framer Motion
   composes its own transforms and will overwrite a plain CSS one.
   Centering is handled by the flex parent outside.
───────────────────────────────────────────────────────────────── */
function DraggableCard({ card, onSwipe }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-280, 280], [-10, 10]);
  const skipOpacity = useTransform(x, [-110, -20], [1, 0]);
  const saveOpacity = useTransform(x, [20, 110], [0, 1]);
  const skipScale = useTransform(x, [-110, -20], [1, 0.75]);
  const saveScale = useTransform(x, [20, 110], [0.75, 1]);

  const handleDragEnd = useCallback((_, { offset, velocity }) => {
    const xThresh = 80;
    const vThresh = 550;
    if (offset.x > xThresh || velocity.x > vThresh) {
      animate(x, 700, { duration: 0.22, ease: "easeOut" });
      setTimeout(() => onSwipe("save"), 180);
    } else if (offset.x < -xThresh || velocity.x < -vThresh) {
      animate(x, -700, { duration: 0.22, ease: "easeOut" });
      setTimeout(() => onSwipe("next"), 180);
    } else {
      animate(x, 0, { type: "spring", stiffness: 520, damping: 30 });
    }
  }, [x, onSwipe]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 34 }}
      drag="x"
      dragMomentum={false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.5}
      style={{ x, rotate, position: "absolute", inset: 0, cursor: "grab", willChange: "transform" }}
      whileDrag={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
    >
      {/* SKIP badge */}
      <motion.div
        style={{
          opacity: skipOpacity, scale: skipScale,
          position: "absolute", top: 16, left: 16, zIndex: 10, pointerEvents: "none",
          originX: 0, originY: 0.5,
        }}
      >
        <div style={{
          padding: "8px 18px", borderRadius: 100,
          background: "var(--red)", color: "white",
          fontSize: 14, fontWeight: 900, letterSpacing: "0.1em",
          boxShadow: "0 4px 20px rgba(255,59,48,0.45)",
          border: "2px solid rgba(255,255,255,0.3)",
        }}>SKIP</div>
      </motion.div>

      {/* SAVE badge */}
      <motion.div
        style={{
          opacity: saveOpacity, scale: saveScale,
          position: "absolute", top: 16, right: 16, zIndex: 10, pointerEvents: "none",
          originX: 1, originY: 0.5,
        }}
      >
        <div style={{
          padding: "8px 18px", borderRadius: 100,
          background: "var(--green)", color: "white",
          fontSize: 14, fontWeight: 900, letterSpacing: "0.1em",
          boxShadow: "0 4px 20px rgba(52,199,89,0.45)",
          border: "2px solid rgba(255,255,255,0.3)",
        }}>SAVE</div>
      </motion.div>

      <StoryCard card={card} />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SIGNUP GATE
───────────────────────────────────────────────────────────────── */
function SignupGate({ supabase, onClose }) {
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState("idle");
  const [error, setError] = useState("");

  const signInEmail = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email."); return; }
    setPhase("loading"); setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    });
    if (error) { setError(error.message); setPhase("error"); }
    else setPhase("sent");
  };

  return (
    <div style={{ padding: "28px 24px" }}>
      <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--blue-soft)", display: "grid", placeItems: "center", marginBottom: 16 }}>
        <Mail size={22} style={{ color: "var(--blue)" }} />
      </div>
      <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700, lineHeight: 1.15, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Sign in to continue</h2>
      <p style={{ margin: "0 0 22px", fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>Free. No newsletters. Saves sync across devices.</p>

      {phase === "sent" ? (
        <div style={{ padding: "18px", borderRadius: 16, background: "var(--green-soft)", border: "1px solid var(--green)", display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--green)", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <Check size={15} color="white" strokeWidth={3} />
          </div>
          <p style={{ margin: 0, fontSize: 15, color: "var(--text-primary)", lineHeight: 1.5 }}>Check your inbox — magic link sent.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="email" inputMode="email" autoComplete="email" value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="you@company.com"
            style={{ width: "100%", padding: "14px", borderRadius: 14, fontSize: 15, background: "var(--card-secondary)", border: `1.5px solid ${error ? "var(--red)" : "var(--separator)"}`, color: "var(--text-primary)", outline: "none" }}
          />
          <button
            onClick={signInEmail} disabled={phase === "loading"}
            style={{ width: "100%", padding: "14px", borderRadius: 14, background: "var(--blue)", color: "white", fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            {phase === "loading" ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
            Send Magic Link
          </button>
          {error && <p style={{ margin: 0, fontSize: 13, color: "var(--red)" }}>{error}</p>}
        </div>
      )}

      <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
          <a href="/privacy" style={{ color: "inherit" }}>Privacy</a>{" · "}<a href="/terms" style={{ color: "inherit" }}>Terms</a>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", padding: 0 }}>Skip for now</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   BOTTOM SHEET
───────────────────────────────────────────────────────────────── */
function Sheet({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.42)", backdropFilter: "blur(6px)" }}
          />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
            style={{
              position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 50,
              maxWidth: 520, margin: "0 auto",
              background: "var(--card)", borderRadius: "24px 24px 0 0",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
              maxHeight: "88vh", display: "flex", flexDirection: "column",
              paddingBottom: "max(12px, env(safe-area-inset-bottom))",
            }}
          >
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--separator)", margin: "12px auto 0", flexShrink: 0 }} />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SAVED SHEET
───────────────────────────────────────────────────────────────── */
function SavedSheet({ open, onClose, items, onClear }) {
  return (
    <Sheet open={open} onClose={onClose}>
      <div style={{ flexShrink: 0, padding: "14px 20px 12px", borderBottom: "1px solid var(--separator)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Saved · {items.length}</div>
          <h3 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.015em" }}>Reading list</h3>
        </div>
        {items.length > 0 && (
          <button onClick={onClear} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, color: "var(--red)", padding: 0 }}>Clear</button>
        )}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
        {items.length === 0 && (
          <p style={{ textAlign: "center", padding: "40px 0", fontSize: 15, color: "var(--text-secondary)" }}>Tap Save to bookmark stories.</p>
        )}
        {items.map((c) => {
          const meta = CATS[c.category] || CATS.insight;
          return (
            <a key={c.id} href={c.source?.url} target="_blank" rel="noreferrer"
              style={{ display: "block", padding: "13px 15px", borderRadius: 16, background: "var(--card-secondary)", border: "1px solid var(--separator)", textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: meta.soft, display: "grid", placeItems: "center" }}>
                  <meta.Icon size={11} style={{ color: meta.color }} strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: meta.color }}>{meta.label}</span>
              </div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, lineHeight: 1.35, color: "var(--text-primary)" }}>{c.headline}</p>
            </a>
          );
        })}
      </div>
    </Sheet>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ARCHIVE SHEET
───────────────────────────────────────────────────────────────── */
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
      <div style={{ flexShrink: 0, padding: "14px 20px 12px", borderBottom: "1px solid var(--separator)" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.015em" }}>Archive · {allCards.length}</h3>
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search headlines…"
          style={{ width: "100%", padding: "10px 14px", borderRadius: 12, fontSize: 14, background: "var(--card-secondary)", border: "1px solid var(--separator)", color: "var(--text-primary)", outline: "none" }}
        />
        <div style={{ display: "flex", gap: 6, overflowX: "auto", marginTop: 10, scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
          {["all", ...Object.keys(CATS)].map((k) => {
            const active = filter === k;
            const meta = k !== "all" ? CATS[k] : null;
            return (
              <button key={k} onClick={() => setFilter(k)}
                style={{ flexShrink: 0, padding: "6px 13px", borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "none", background: active ? (meta?.color || "var(--text-primary)") : "var(--card-secondary)", color: active ? "white" : "var(--text-secondary)" }}>
                {k === "all" ? "All" : meta.label}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 20px", display: "flex", flexDirection: "column", gap: 7 }}>
        {filtered.length === 0 && <p style={{ textAlign: "center", padding: "40px 0", fontSize: 15, color: "var(--text-secondary)" }}>No matches.</p>}
        {filtered.map((c) => {
          const meta = CATS[c.category] || CATS.insight;
          return (
            <a key={c.id} href={c.source?.url} target="_blank" rel="noreferrer"
              style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 14, background: "var(--card-secondary)", border: "1px solid var(--separator)", textDecoration: "none", alignItems: "flex-start" }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: meta.soft, display: "grid", placeItems: "center", flexShrink: 0 }}>
                <meta.Icon size={13} style={{ color: meta.color }} strokeWidth={2.5} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: meta.color }}>{meta.label}</span>
                  {savedIds.has(c.id) && <Bookmark size={10} fill={meta.hex} strokeWidth={0} />}
                </div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, lineHeight: 1.35, color: "var(--text-primary)" }}>{c.headline}</p>
              </div>
            </a>
          );
        })}
      </div>
    </Sheet>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SHARE MODAL
───────────────────────────────────────────────────────────────── */
function ShareModal({ open, onClose, card }) {
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!card) return null;
  const meta = CATS[card.category] || CATS.insight;
  const hex = SHARE_HEX[card.category] || "#8E8E93";

  const handleShare = async () => {
    setGenerating(true);
    try {
      const { toPng } = await import("html-to-image");

      // Build the share card as a real DOM node appended to body so browser paints it
      const el = document.createElement("div");
      // Position off-screen left — opacity MUST be 1 or html-to-image captures a transparent image
      Object.assign(el.style, {
        position: "fixed", top: "0", left: "-10000px",
        width: "540px", height: "540px",
        zIndex: "1", opacity: "1", pointerEvents: "none",
        background: "white", fontFamily: "-apple-system,BlinkMacSystemFont,system-ui,sans-serif",
        overflow: "hidden",
      });
      const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      el.innerHTML = `
        <div style="height:190px;background:linear-gradient(150deg,${hex} 0%,${hex}DD 55%,${hex}99 100%);padding:22px 28px 22px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:inset 0 1px 0 rgba(255,255,255,0.28),inset 0 -1px 0 rgba(0,0,0,0.12);">
          <div style="display:inline-flex;align-items:center;padding:4px 11px;border-radius:100px;background:rgba(255,255,255,0.22);border:1px solid rgba(255,255,255,0.30);align-self:flex-start;">
            <span style="font-size:11px;font-weight:600;color:white;">${esc(meta.label)}${card.jurisdiction ? ` · ${esc(card.jurisdiction)}` : ""}</span>
          </div>
          <h2 style="margin:0;font-size:20px;font-weight:600;line-height:1.28;letter-spacing:-0.015em;color:white;text-shadow:0 1px 6px rgba(0,0,0,0.22);">${esc(card.headline)}</h2>
        </div>
        <div style="padding:18px 28px 14px;">
          <p style="margin:0 0 13px;font-size:13px;line-height:1.62;color:#3C3C43;">${esc((card.plain_english || "").slice(0, 160))}${(card.plain_english || "").length > 160 ? "…" : ""}</p>
          <div style="padding:11px 13px;border-radius:10px;background:${hex}18;border-left:3px solid ${hex};">
            <div style="font-size:9px;font-weight:700;color:${hex};text-transform:uppercase;letter-spacing:0.09em;margin-bottom:4px;">Why it matters</div>
            <p style="margin:0;font-size:12px;line-height:1.52;color:#1C1C1E;">${esc((card.why_it_matters || "").slice(0, 130))}${(card.why_it_matters || "").length > 130 ? "…" : ""}</p>
          </div>
        </div>
        <div style="position:absolute;bottom:16px;left:28px;right:28px;display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:13px;font-weight:600;color:#000;letter-spacing:-0.01em;">ai<span style="color:${hex};font-weight:700;">.</span>tech<span style="color:${hex};font-weight:700;">.</span>hive</span>
          <span style="font-size:11px;color:#8E8E93;">aitechhive.com</span>
        </div>
      `;
      document.body.appendChild(el);
      // Give browser one frame to paint
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      const dataUrl = await toPng(el, { pixelRatio: 2, cacheBust: true, width: 540, height: 540 });
      document.body.removeChild(el);

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
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/c/${card.id}`);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
              style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }} />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 36 }}
              style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 50, maxWidth: 520, margin: "0 auto", background: "var(--card)", borderRadius: "24px 24px 0 0", padding: "20px 20px max(20px, env(safe-area-inset-bottom))", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}
            >
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--separator)", margin: "0 auto 18px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>Share this card</h3>
                <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--card-secondary)", border: "none", cursor: "pointer", display: "grid", placeItems: "center", color: "var(--text-secondary)" }}>
                  <X size={14} />
                </button>
              </div>
              <div style={{ padding: "13px 15px", borderRadius: 14, background: "var(--card-secondary)", border: "1px solid var(--separator)", marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: meta.color }}>{meta.label}</span>
                <p style={{ margin: "5px 0 0", fontSize: 15, fontWeight: 700, lineHeight: 1.3, color: "var(--text-primary)" }}>{card.headline}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button onClick={handleShare} disabled={generating}
                  style={{ padding: "14px", borderRadius: 14, background: "var(--blue)", color: "white", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                  {generating ? <Loader2 size={15} className="animate-spin" /> : <Share2 size={15} />}
                  {generating ? "…" : "Share Image"}
                </button>
                <button onClick={handleCopyLink}
                  style={{ padding: "14px", borderRadius: 14, background: "var(--card-secondary)", color: copied ? "var(--green)" : "var(--text-primary)", fontSize: 15, fontWeight: 700, border: "1.5px solid var(--separator)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
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

/* ─────────────────────────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────────────────────────── */
function EmptyState({ stats, onReshuffle, onOpenArchive }) {
  return (
    <div style={{
      height: "100%", background: "var(--card)", borderRadius: 24,
      border: "1px solid var(--separator)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      display: "flex", flexDirection: "column", padding: "28px 22px",
    }}>
      <div style={{ width: 52, height: 52, borderRadius: 16, background: "var(--blue-soft)", display: "grid", placeItems: "center", marginBottom: 16 }}>
        <Inbox size={26} style={{ color: "var(--blue)" }} />
      </div>
      <h3 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>That's today's signal.</h3>
      <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.55, color: "var(--text-secondary)" }}>Top 20 live stories, refreshed 8× daily. Full archive below.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 22 }}>
        {[["Saved", stats.saved, "var(--green)"], ["Skipped", stats.next, "var(--text-tertiary)"], ["Shared", stats.shared, "var(--blue)"]].map(([l, v, c]) => (
          <div key={l} style={{ textAlign: "center", padding: "14px 6px", borderRadius: 14, background: "var(--card-secondary)", border: "1px solid var(--separator)" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: c, fontFamily: "var(--font-mono)" }}>{v}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-secondary)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "auto", paddingTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={onOpenArchive} style={{ width: "100%", padding: "14px", borderRadius: 14, background: "var(--blue)", color: "white", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer" }}>Open Archive</button>
        <button onClick={onReshuffle} style={{ width: "100%", padding: "13px", borderRadius: 14, background: "var(--card-secondary)", color: "var(--text-secondary)", fontSize: 15, fontWeight: 600, border: "1.5px solid var(--separator)", cursor: "pointer" }}>Replay Deck</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   WORDMARK — "[ath]  ai.tech.hive"
   Lowercase. Dots accented in brand blue for web-native rhythm.
───────────────────────────────────────────────────────────────── */
function Wordmark() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <div
        aria-hidden="true"
        style={{
          width: 30, height: 30, borderRadius: 8,
          background: "var(--text-primary)",
          color: "var(--bg)",
          display: "grid", placeItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 12, fontWeight: 700, letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        ath
      </div>
      <div>
        <div
          style={{
            fontSize: 19, fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em", lineHeight: 1,
            fontFamily: "var(--font-sans)",
          }}
        >
          ai<span style={{ color: "var(--blue)", fontWeight: 700 }}>.</span>
          tech<span style={{ color: "var(--blue)", fontWeight: 700 }}>.</span>
          hive
        </div>
        <div style={{ fontSize: 9.5, fontWeight: 600, color: "var(--text-tertiary)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.09em" }}>
          BFSI · Enterprise AI · 8× daily
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ICON BUTTON
───────────────────────────────────────────────────────────────── */
function IconBtn({ children, onClick, label, badge }) {
  return (
    <button
      onClick={onClick} aria-label={label}
      style={{ position: "relative", width: 36, height: 36, borderRadius: 10, background: "var(--card)", border: "1px solid var(--separator)", display: "grid", placeItems: "center", cursor: "pointer", color: "var(--text-primary)", flexShrink: 0 }}
    >
      {children}
      {badge > 0 && (
        <span style={{ position: "absolute", top: -4, right: -4, minWidth: 17, height: 17, borderRadius: 9, background: "var(--blue)", color: "white", fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center", padding: "0 3px" }}>{badge}</span>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ACTION BAR BUTTONS — neutral, matches header IconBtn chrome
───────────────────────────────────────────────────────────────── */
function BigActionBtn({ label, onClick, children, active }) {
  return (
    <button
      onClick={onClick} aria-label={label}
      style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 5, padding: "12px 6px", borderRadius: 14,
        background: "var(--card)",
        color: "var(--text-primary)",
        border: "1px solid var(--separator)",
        cursor: "pointer", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
        userSelect: "none",
        transition: "transform 0.12s ease, opacity 0.12s ease",
        opacity: active ? 1 : 0.95,
      }}
      onPointerDown={(e) => { e.currentTarget.style.transform = "scale(0.96)"; e.currentTarget.style.opacity = "0.85"; }}
      onPointerUp={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.opacity = ""; }}
      onPointerLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.opacity = ""; }}
    >
      {children}
      {label}
    </button>
  );
}


/* ─────────────────────────────────────────────────────────────────
   ROOT
───────────────────────────────────────────────────────────────── */
export default function PageClient({ initialCards }) {
  const { dark, toggle: toggleTheme } = useTheme();
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ), []);

  const [allCards] = useState(initialCards || []);
  const [catFilter, setCatFilter] = useState("all");
  const [user, setUser] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  // deckActed: every card you've saved or skipped (removes it from deck[0] view)
  // Separate from savedIds — saves are bookmarks, deckActed is navigation
  const [deckActed, setDeckActed] = useState(new Set());
  const [savedCards, setSavedCards] = useState([]);
  // progressCount: how many acted on in the CURRENT catFilter (resets on tab switch)
  const [progressCount, setProgressCount] = useState(0);
  const [stats, setStats] = useState({ saved: 0, next: 0, shared: 0 });
  const [savedOpen, setSavedOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [shareCard, setShareCard] = useState(null);
  const [showGate, setShowGate] = useState(false);
  const [gateSkipped, setGateSkipped] = useState(false);

  // Auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user || null));
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  // Sync saves + dismissed from Supabase on login
  useEffect(() => {
    if (!user) { setSavedIds(new Set()); setSavedCards([]); return; }
    supabase.from("saves").select("card_id").then(({ data }) => {
      const ids = new Set((data || []).map((r) => r.card_id));
      setSavedIds(ids);
      setSavedCards(allCards.filter((c) => ids.has(c.id)));
    });
    // Pre-load previously dismissed cards into deckActed so they don't resurface
    supabase.from("dismissed").select("card_id").then(({ data }) => {
      const ids = new Set((data || []).map((r) => r.card_id));
      setDeckActed((prev) => new Set([...prev, ...ids]));
    });
  }, [user, supabase, allCards]);

  const deck = useMemo(() => orderDeck(allCards, deckActed, catFilter), [allCards, deckActed, catFilter]);
  // Always show deck[0] — deckActed removal makes next card bubble up automatically
  const topCard = deck[0] ?? null;
  const isEmpty = !topCard;

  // Total cards for this filter = acted + remaining
  const progressTotal = progressCount + deck.length;

  // Gate fires once after 3 cards acted on
  useEffect(() => {
    if (progressCount >= 3 && !user && !gateSkipped && !showGate) setShowGate(true);
  }, [progressCount, user, gateSkipped, showGate]);

  const doAction = useCallback(async (action) => {
    if (!topCard && action !== "share") return;

    // Save requires a session — capture email + sync across devices.
    // Open the gate, hold the save, and let the auth flow resume the action.
    if (action === "save" && !user) {
      setShowGate(true);
      return;
    }

    if (action === "share") {
      setShareCard(topCard);
      setStats((s) => ({ ...s, shared: s.shared + 1 }));
      if (user) supabase.from("shares").insert({ user_id: user.id, card_id: topCard.id });
      return;
    }

    // Both save + skip: mark card as acted on so deck[0] advances to next card
    setDeckActed((prev) => new Set([...prev, topCard.id]));
    setProgressCount((p) => p + 1);

    if (action === "save") {
      setSavedIds((prev) => new Set([...prev, topCard.id]));
      setSavedCards((prev) => [topCard, ...prev.filter((c) => c.id !== topCard.id)]);
      setStats((s) => ({ ...s, saved: s.saved + 1 }));
      if (user) supabase.from("saves").upsert({ user_id: user.id, card_id: topCard.id });
    } else {
      setStats((s) => ({ ...s, next: s.next + 1 }));
      if (user) supabase.from("dismissed").upsert({ user_id: user.id, card_id: topCard.id });
    }
  }, [topCard, user, supabase]);

  // Keyboard shortcuts
  useEffect(() => {
    const map = { ArrowRight: "save", ArrowLeft: "next", ArrowUp: "share" };
    const onKey = (e) => {
      if (savedOpen || archiveOpen || shareCard || showGate || e.target.tagName === "INPUT") return;
      if (map[e.key]) { e.preventDefault(); doAction(map[e.key]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doAction, savedOpen, archiveOpen, shareCard, showGate]);

  /* ─── Pull-to-refresh ─────────────────────────────────────────
     Engages only on dominant vertical-down drags. Horizontal
     drags bail immediately so the card's swipe gesture is intact.
  ─────────────────────────────────────────────────────────────── */
  const PULL_THRESHOLD = 64;
  const PULL_MAX = 120;
  const pullRef = useRef({ startY: null, startX: null, current: 0, engaged: false });
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onPullStart = useCallback((e) => {
    if (refreshing || savedOpen || archiveOpen || shareCard || showGate) return;
    const t = e.touches?.[0];
    if (!t) return;
    pullRef.current = { startY: t.clientY, startX: t.clientX, current: 0, engaged: false };
  }, [refreshing, savedOpen, archiveOpen, shareCard, showGate]);

  const onPullMove = useCallback((e) => {
    const r = pullRef.current;
    if (refreshing || r.startY == null) return;
    const t = e.touches?.[0];
    if (!t) return;
    const dy = t.clientY - r.startY;
    const dx = t.clientX - r.startX;
    if (!r.engaged) {
      if (dy > 8 && Math.abs(dy) > Math.abs(dx) * 1.5) {
        r.engaged = true;
      } else if (Math.abs(dx) > 8 || dy < -8) {
        r.startY = null;
        return;
      } else {
        return;
      }
    }
    // Rubber-band easing — sqrt damping past the threshold
    const eased = Math.min(PULL_MAX, Math.sqrt(Math.max(0, dy)) * 11);
    r.current = eased;
    setPullY(eased);
  }, [refreshing]);

  const onPullEnd = useCallback(() => {
    const r = pullRef.current;
    if (refreshing) return;
    if (r.engaged && r.current >= PULL_THRESHOLD) {
      setRefreshing(true);
      setPullY(56);
      setTimeout(() => window.location.reload(), 220);
    } else {
      setPullY(0);
    }
    pullRef.current = { startY: null, startX: null, current: 0, engaged: false };
  }, [refreshing]);

  return (
    <main
      onTouchStart={onPullStart}
      onTouchMove={onPullMove}
      onTouchEnd={onPullEnd}
      onTouchCancel={onPullEnd}
      style={{
        height: "100svh", display: "flex", flexDirection: "column",
        background: "var(--bg)", color: "var(--text-primary)",
        paddingTop: "env(safe-area-inset-top)",
        overflow: "hidden", fontFamily: "var(--font-sans)",
        position: "relative",
      }}
    >
      {/* ── Pull-to-refresh indicator ─────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "env(safe-area-inset-top)",
          left: "50%",
          width: 36, height: 36, borderRadius: 18,
          background: "var(--card)",
          border: "1px solid var(--separator)",
          display: "grid", placeItems: "center",
          color: "var(--text-primary)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          zIndex: 30,
          pointerEvents: "none",
          transform: `translate(-50%, ${Math.max(0, pullY - 18)}px)`,
          opacity: pullY > 4 || refreshing ? Math.min(1, pullY / PULL_THRESHOLD) : 0,
          transition: pullRef.current.engaged && !refreshing ? "none" : "transform 0.28s ease, opacity 0.28s ease",
        }}
      >
        <RefreshCw
          size={16}
          strokeWidth={2.4}
          style={{
            transform: `rotate(${refreshing ? 0 : Math.min(360, pullY * 4)}deg)`,
            animation: refreshing ? "spin 0.7s linear infinite" : "none",
          }}
        />
      </div>

      {/* ── Masthead ──────────────────────────────────────────── */}
      <header style={{ flexShrink: 0, padding: "12px 16px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Wordmark />
        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
          <IconBtn onClick={toggleTheme} label="Toggle theme">{dark ? <Sun size={15} /> : <Moon size={15} />}</IconBtn>
          <IconBtn onClick={() => setArchiveOpen(true)} label="Archive"><Archive size={15} /></IconBtn>
          <IconBtn onClick={() => setSavedOpen(true)} label="Saved" badge={savedIds.size}><Bookmark size={15} /></IconBtn>
          {!user && (
            <IconBtn onClick={() => setShowGate(true)} label="Sign in">
              <Mail size={15} />
            </IconBtn>
          )}
        </div>
      </header>

      {/* ── Category filter tabs ───────────────────────────────── */}
      <div style={{ flexShrink: 0, padding: "0 12px 10px", display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
        {["all", ...Object.keys(CATS)].map((key) => {
          const active = catFilter === key;
          const meta = key !== "all" ? CATS[key] : null;
          return (
            <button key={key} onClick={() => { setCatFilter(key); setProgressCount(0); }}
              style={{
                flexShrink: 0, padding: "7px 14px", borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none",
                background: active ? (meta?.hex || "var(--text-primary)") : "var(--card)",
                color: active ? "white" : "var(--text-secondary)", fontWeight: active ? 600 : 500,
                boxShadow: active ? `0 2px 8px ${meta ? meta.hex + "45" : "rgba(0,0,0,0.22)"}` : "0 1px 2px rgba(0,0,0,0.05)",
                transition: "all 0.15s ease",
              }}>
              {key === "all" ? "All" : meta.label}
            </button>
          );
        })}
      </div>

      {/* ── Progress strip ─────────────────────────────────────── */}
      {progressTotal > 0 && !isEmpty && (
        <div style={{ flexShrink: 0, padding: "0 16px 8px", display: "flex", alignItems: "center", gap: 3 }}>
          {Array.from({ length: Math.min(progressTotal, 14) }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, transition: "background 0.3s", background: i < progressCount ? "var(--blue)" : "var(--separator)" }} />
          ))}
          {progressTotal > 14 && <div style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--separator)", flexShrink: 0 }} />}
          <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
            {progressCount + 1}/{progressTotal}
          </span>
        </div>
      )}

      {/* ── Card area  ─────────────────────────────────────────────
          IMPORTANT: Centering is done with flex on this wrapper.
          DO NOT use transform:translateX(-50%) on the motion.div —
          Framer Motion composes its own transforms and will wipe it.
      ─────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        {/* Full-bleed centering wrapper */}
        <div style={{ position: "absolute", inset: "0 12px 6px", display: "flex", justifyContent: "center" }}>
          {/* Max-width container with card stack */}
          <div style={{ position: "relative", width: "100%", maxWidth: 520 }}>

            {/* Stack layer 2 — farthest back */}
            {!isEmpty && deck[2] && (
              <div style={{
                position: "absolute", left: 20, right: 20, top: 0, bottom: 0,
                background: "var(--card-secondary)", borderRadius: 24,
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                transform: "scale(0.90) translateY(20px)",
                transformOrigin: "bottom center",
                opacity: 0.5, zIndex: 0,
              }} />
            )}

            {/* Stack layer 1 — behind current */}
            {!isEmpty && deck[1] && (
              <div style={{
                position: "absolute", left: 10, right: 10, top: 0, bottom: 0,
                background: "var(--card)", borderRadius: 24,
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.09)",
                transform: "scale(0.955) translateY(10px)",
                transformOrigin: "bottom center",
                opacity: 0.8, zIndex: 1,
              }} />
            )}

            {/* Front card — draggable */}
            <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
              <AnimatePresence mode="wait" initial={false}>
                {isEmpty ? (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ position: "absolute", inset: 0 }}>
                    <EmptyState
                      stats={stats}
                      onReshuffle={() => { setDeckActed(new Set()); setProgressCount(0); setStats({ saved: 0, next: 0, shared: 0 }); }}
                      onOpenArchive={() => setArchiveOpen(true)}
                    />
                  </motion.div>
                ) : (
                  <DraggableCard
                    key={topCard.id}
                    card={topCard}
                    onSwipe={doAction}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ── Action bar ─────────────────────────────────────────── */}
      {!isEmpty && (
        <div style={{ flexShrink: 0, padding: "8px 16px max(14px, env(safe-area-inset-bottom))" }}>
          <div style={{ maxWidth: 520, margin: "0 auto", display: "flex", gap: 10, alignItems: "stretch" }}>
            <BigActionBtn label="Skip" onClick={() => doAction("next")}>
              <X size={20} strokeWidth={2.25} />
            </BigActionBtn>

            <BigActionBtn label="Share" onClick={() => doAction("share")}>
              <Share2 size={18} strokeWidth={2.25} />
            </BigActionBtn>

            <BigActionBtn label={user ? "Save" : "Sign in to save"} onClick={() => doAction("save")} active={savedIds.has(topCard?.id)}>
              <Bookmark size={20} strokeWidth={2.25} fill={savedIds.has(topCard?.id) ? "currentColor" : "none"} />
            </BigActionBtn>
          </div>
        </div>
      )}

      {/* ── Gate modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showGate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(12px)" }} />
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
              style={{ position: "fixed", inset: 0, zIndex: 61, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
            >
              <div style={{ width: "100%", maxWidth: 400, background: "var(--card)", borderRadius: 26, overflowY: "auto", maxHeight: "90vh" }}>
                <SignupGate supabase={supabase} onClose={() => { setShowGate(false); setGateSkipped(true); }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SavedSheet open={savedOpen} onClose={() => setSavedOpen(false)} items={savedCards}
        onClear={async () => {
          if (user) await supabase.from("saves").delete().eq("user_id", user.id);
          setSavedIds(new Set()); setSavedCards([]);
        }} />
      <ArchiveSheet open={archiveOpen} onClose={() => setArchiveOpen(false)} allCards={allCards} savedIds={savedIds} />
      <ShareModal open={!!shareCard} onClose={() => setShareCard(null)} card={shareCard} />
    </main>
  );
}

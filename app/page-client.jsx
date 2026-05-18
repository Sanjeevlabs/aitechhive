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
  GraduationCap, Flame, RefreshCw, LogOut, Trash2, Clock, TrendingUp,
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
  insight:    { label: "Insight",    Icon: BookOpen,      color: "var(--brown)",  soft: "var(--brown-soft)",  hex: "#A2845E" },
  frontier:   { label: "Frontier AI", Icon: Globe,        color: "var(--mint)",   soft: "var(--mint-soft)",   hex: "#00C7BE" },
};

// Hardcoded for the Canvas share renderer (CSS vars don't resolve in Canvas)
const SHARE_HEX = {
  trending: "#FF3B30", learner: "#FFCC00",
  regulation: "#007AFF", deployment: "#34C759", vendor: "#FF9500",
  career: "#AF52DE", tool: "#5856D6", research: "#32ADE6", insight: "#A2845E", frontier: "#00C7BE",
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

        {/* Jargon decoder — every acronym + term defined inline */}
        {Array.isArray(card.jargon) && card.jargon.length > 0 && (
          <div style={{ margin: "14px 0 0" }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: "var(--text-tertiary)",
              textTransform: "uppercase", letterSpacing: "0.09em",
              marginBottom: 8, display: "flex", alignItems: "center", gap: 5,
            }}>
              <BookOpen size={10} /> Decode the jargon
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {card.jargon.map((j, i) => (
                <div key={i} style={{
                  padding: "10px 12px", borderRadius: 11,
                  background: "var(--card-secondary)",
                  border: "1px solid var(--separator)",
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{j.term}</div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.45, color: "var(--text-secondary)" }}>{j.def}</div>
                </div>
              ))}
            </div>
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
   WELCOME CARD  —  shown once on first visit
───────────────────────────────────────────────────────────────── */
function WelcomeCard({ onDismiss }) {
  const gestures = [
    { icon: "→", label: "Swipe right", desc: "Save to your reading list" },
    { icon: "←", label: "Swipe left", desc: "Skip to the next story" },
    { icon: "↑", label: "Tap Share", desc: "Send the card to your team" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -10 }}
      transition={{ type: "spring", stiffness: 360, damping: 34 }}
      style={{
        position: "absolute", inset: 0, zIndex: 10,
        background: "var(--card)", borderRadius: 24, overflow: "hidden",
        display: "flex", flexDirection: "column",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 14px rgba(0,0,0,0.08), 0 20px 52px rgba(0,0,0,0.13)",
        userSelect: "none",
      }}
    >
      {/* Hero */}
      <div style={{
        flexShrink: 0,
        background: "linear-gradient(150deg, #0A0A0A 0%, #1C1C1E 60%, #2C2C2E 100%)",
        padding: "20px 20px 24px",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.30)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "white", display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: "#0A0A0A", flexShrink: 0 }}>ath</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>AITechHive</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>BFSI · Enterprise AI</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", padding: "4px 11px", borderRadius: 100, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.06em", flexShrink: 0 }}>8× DAILY</div>
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.22, color: "white", fontFamily: "var(--font-serif)", letterSpacing: "-0.02em" }}>
          Every senior banker's<br />secret AI briefing.
        </div>
        <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", marginTop: 9, lineHeight: 1.5 }}>
          Signal over noise. 100 curated cards daily across 10 categories — regulation, funding, deployments, research and more.
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "16px 20px 0" }}>
        {/* Category chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
          {Object.entries(CATS).map(([key, cat]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 100, background: cat.soft, border: `1px solid ${cat.hex}30` }}>
              <cat.Icon size={9} style={{ color: cat.color }} strokeWidth={2.5} />
              <span style={{ fontSize: 10.5, fontWeight: 700, color: cat.color }}>{cat.label}</span>
            </div>
          ))}
        </div>

        {/* Gesture guide */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {gestures.map(({ icon, label, desc }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 13px", borderRadius: 13, background: "var(--card-secondary)", border: "1px solid var(--separator)" }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--text-primary)", color: "var(--bg)", display: "grid", placeItems: "center", fontSize: 15, fontWeight: 700, flexShrink: 0 }}>{icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{label}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 1 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 12 }} />
      </div>

      {/* CTA */}
      <div style={{ flexShrink: 0, padding: "14px 20px max(16px, env(safe-area-inset-bottom))" }}>
        <button
          onClick={onDismiss}
          style={{ width: "100%", padding: "15px", borderRadius: 16, background: "var(--text-primary)", color: "var(--bg)", fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer", letterSpacing: "-0.01em" }}
        >
          Start reading →
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SIGNUP GATE
───────────────────────────────────────────────────────────────── */
// Map raw Supabase auth error messages to user-friendly copy
function friendlyAuthError(msg = "") {
  const m = msg.toLowerCase();
  if (m.includes("rate limit") || m.includes("too many") || m.includes("429"))
    return "Too many requests. Please wait a few minutes before trying again.";
  if (m.includes("invalid email") || m.includes("unable to validate"))
    return "That doesn't look like a valid email address.";
  if (m.includes("signups not allowed") || m.includes("signup"))
    return "Sign-ups are temporarily paused. Try again shortly.";
  if (m.includes("network") || m.includes("fetch"))
    return "Network error. Check your connection and try again.";
  return "Something went wrong. Please try again.";
}

const RESEND_COOLDOWN = 60; // seconds

function SignupGate({ supabase, onClose, initialError }) {
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState(initialError ? "error" : "idle");
  const [error, setError] = useState(initialError || "");
  const [cooldown, setCooldown] = useState(0); // seconds remaining before resend allowed

  // Countdown ticker
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const signInEmail = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email."); return; }
    setPhase("loading"); setError("");
    const { error: authErr } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    });
    if (authErr) {
      setError(friendlyAuthError(authErr.message));
      setPhase("error");
    } else {
      setPhase("sent");
      setCooldown(RESEND_COOLDOWN);
    }
  };

  return (
    <div style={{ padding: "28px 24px" }}>
      <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--blue-soft)", display: "grid", placeItems: "center", marginBottom: 16 }}>
        <Mail size={22} style={{ color: "var(--blue)" }} />
      </div>
      <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700, lineHeight: 1.15, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Sign in to continue</h2>
      <p style={{ margin: "0 0 22px", fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>Free. No newsletters. Saves sync across devices.</p>

      {phase === "sent" ? (
        <div>
          <div style={{ padding: "18px", borderRadius: 16, background: "var(--green-soft)", border: "1px solid var(--green)", display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--green)", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Check size={15} color="white" strokeWidth={3} />
            </div>
            <div>
              <p style={{ margin: "0 0 3px", fontSize: 15, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>Check your inbox</p>
              <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.4 }}>Magic link sent to {email}. Click it to sign in — no password needed.</p>
            </div>
          </div>
          {cooldown > 0 ? (
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-tertiary)", textAlign: "center" }}>
              Resend available in {cooldown}s
            </p>
          ) : (
            <button onClick={() => setPhase("idle")} style={{ width: "100%", padding: "11px", borderRadius: 12, background: "none", border: "1.5px solid var(--separator)", color: "var(--text-secondary)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Resend or use a different email
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="email" inputMode="email" autoComplete="email" value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && signInEmail()}
            placeholder="you@company.com"
            style={{ width: "100%", padding: "14px", borderRadius: 14, fontSize: 15, background: "var(--card-secondary)", border: `1.5px solid ${error ? "var(--red)" : "var(--separator)"}`, color: "var(--text-primary)", outline: "none", boxSizing: "border-box" }}
          />
          <button
            onClick={signInEmail}
            disabled={phase === "loading" || cooldown > 0}
            style={{ width: "100%", padding: "14px", borderRadius: 14, background: cooldown > 0 ? "var(--separator)" : "var(--blue)", color: cooldown > 0 ? "var(--text-tertiary)" : "white", fontSize: 15, fontWeight: 600, border: "none", cursor: cooldown > 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s" }}
          >
            {phase === "loading" ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Send Magic Link"}
          </button>
          {error && (
            <div style={{ display: "flex", gap: 8, padding: "10px 12px", borderRadius: 12, background: "var(--red-soft)", border: "1px solid var(--red)33" }}>
              <X size={13} style={{ color: "var(--red)", flexShrink: 0, marginTop: 1 }} strokeWidth={2.5} />
              <p style={{ margin: 0, fontSize: 13, color: "var(--red)", lineHeight: 1.45 }}>{error}</p>
            </div>
          )}
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
function SavedSheet({ open, onClose, items, onClear, onRemove }) {
  return (
    <Sheet open={open} onClose={onClose}>
      {/* Header */}
      <div style={{ flexShrink: 0, padding: "14px 20px 12px", borderBottom: "1px solid var(--separator)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Reading list · {items.length}</div>
            <h3 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.015em" }}>Saved stories</h3>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {items.length > 0 && (
              <button onClick={onClear} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "var(--red)", padding: 0 }}>Clear all</button>
            )}
            <button onClick={onClose} aria-label="Close saved"
              style={{ width: 34, height: 34, borderRadius: 10, background: "var(--card-secondary)", border: "1px solid var(--separator)", cursor: "pointer", display: "grid", placeItems: "center", color: "var(--text-primary)" }}>
              <X size={15} strokeWidth={2.4} />
            </button>
          </div>
        </div>
        {/* What does Save do? */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "9px 12px", borderRadius: 12, background: "var(--blue-soft)", border: "1px solid var(--blue)22" }}>
          <Bookmark size={13} style={{ color: "var(--blue)", marginTop: 1, flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: "var(--blue)" }}>
            Saved stories sync across all your devices. Tap any card to read the full article from source.
          </p>
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
        {items.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 20px 0" }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: "var(--card-secondary)", display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
              <Bookmark size={22} style={{ color: "var(--text-tertiary)" }} />
            </div>
            <p style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Nothing saved yet</p>
            <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>Swipe right on any card or tap Save to build your reading list.</p>
          </div>
        )}
        {items.map((c) => {
          const meta = CATS[c.category] || CATS.insight;
          const kv = cardKeyVal(c);
          return (
            <div key={c.id} style={{ borderRadius: 16, background: "var(--card-secondary)", border: "1px solid var(--separator)", overflow: "hidden" }}>
              {/* Category + date + remove */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 12px 0" }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: meta.soft, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <meta.Icon size={10} style={{ color: meta.color }} strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: meta.color }}>{meta.label}</span>
                {c.jurisdiction && <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>· {c.jurisdiction}</span>}
                <span style={{ flex: 1 }} />
                <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>{relDate(c.published_at)}</span>
                <button onClick={() => onRemove?.(c.id)} aria-label="Remove"
                  style={{ width: 22, height: 22, borderRadius: 6, background: "var(--red-soft)", border: "none", cursor: "pointer", display: "grid", placeItems: "center", color: "var(--red)", flexShrink: 0 }}>
                  <X size={10} strokeWidth={2.8} />
                </button>
              </div>
              {/* Headline */}
              <a href={c.source?.url} target="_blank" rel="noreferrer" style={{ display: "block", padding: "6px 12px 4px", textDecoration: "none" }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, lineHeight: 1.35, color: "var(--text-primary)" }}>{c.headline}</p>
              </a>
              {/* Plain English preview */}
              {c.plain_english && (
                <p style={{ margin: "0 12px", fontSize: 12.5, lineHeight: 1.5, color: "var(--text-secondary)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {c.plain_english}
                </p>
              )}
              {/* Footer: key value + source */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 12px 10px" }}>
                {kv ? (
                  <span style={{ fontSize: 11, fontWeight: 800, color: meta.color, fontFamily: "var(--font-mono)" }}>{kv}</span>
                ) : <span />}
                <a href={c.source?.url} target="_blank" rel="noreferrer"
                  style={{ fontSize: 10.5, fontWeight: 600, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 3, textDecoration: "none" }}>
                  {c.source?.name?.split(" · ")[0]}
                  <ExternalLink size={9} />
                </a>
              </div>
            </div>
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

  const catCounts = useMemo(() => {
    const m = {};
    for (const c of allCards) m[c.category] = (m[c.category] || 0) + 1;
    return m;
  }, [allCards]);

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.015em" }}>Archive</h3>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", marginTop: 2 }}>
              {allCards.length} stories · refreshed 8× daily
            </div>
          </div>
          <button onClick={onClose} aria-label="Close archive"
            style={{ width: 34, height: 34, borderRadius: 10, background: "var(--card-secondary)", border: "1px solid var(--separator)", cursor: "pointer", display: "grid", placeItems: "center", color: "var(--text-primary)" }}>
            <X size={15} strokeWidth={2.4} />
          </button>
        </div>

        {/* Category breakdown (only in "all" view) */}
        {filter === "all" && !search.trim() && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 5, marginBottom: 10 }}>
            {Object.entries(CATS).map(([key, cat]) => (
              <button key={key} onClick={() => setFilter(key)}
                style={{ padding: "6px 4px", borderRadius: 10, background: cat.soft, border: `1px solid ${cat.hex}28`, cursor: "pointer", textAlign: "center" }}>
                <cat.Icon size={12} style={{ color: cat.color, display: "block", margin: "0 auto 3px" }} strokeWidth={2.5} />
                <div style={{ fontSize: 9, fontWeight: 700, color: cat.color, lineHeight: 1.2 }}>{cat.label}</div>
                <div style={{ fontSize: 10, fontWeight: 800, color: cat.color, fontFamily: "var(--font-mono)", marginTop: 1 }}>{catCounts[key] || 0}</div>
              </button>
            ))}
          </div>
        )}

        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search headlines…"
          style={{ width: "100%", padding: "10px 14px", borderRadius: 12, fontSize: 14, background: "var(--card-secondary)", border: "1px solid var(--separator)", color: "var(--text-primary)", outline: "none", boxSizing: "border-box" }}
        />
        <div style={{ display: "flex", gap: 6, overflowX: "auto", marginTop: 10, scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
          {["all", ...Object.keys(CATS)].map((k) => {
            const active = filter === k;
            const meta = k !== "all" ? CATS[k] : null;
            return (
              <button key={k} onClick={() => setFilter(k)}
                style={{ flexShrink: 0, padding: "6px 13px", borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "none", background: active ? (meta?.color || "var(--text-primary)") : "var(--card-secondary)", color: active ? "white" : "var(--text-secondary)" }}>
                {k === "all" ? `All (${allCards.length})` : `${meta.label} ${catCounts[k] ? `· ${catCounts[k]}` : ""}`}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px 20px", display: "flex", flexDirection: "column", gap: 7 }}>
        {filtered.length === 0 && <p style={{ textAlign: "center", padding: "40px 0", fontSize: 15, color: "var(--text-secondary)" }}>No matches.</p>}
        {filtered.map((c) => {
          const meta = CATS[c.category] || CATS.insight;
          const kv = cardKeyVal(c);
          const isSaved = savedIds.has(c.id);
          return (
            <a key={c.id} href={c.source?.url} target="_blank" rel="noreferrer"
              style={{ display: "flex", gap: 10, padding: "11px 13px", borderRadius: 14, background: isSaved ? meta.soft : "var(--card-secondary)", border: `1px solid ${isSaved ? meta.hex + "30" : "var(--separator)"}`, textDecoration: "none", alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0, paddingTop: 1 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: isSaved ? meta.color : meta.soft, display: "grid", placeItems: "center" }}>
                  <meta.Icon size={12} color={isSaved ? "white" : meta.color} strokeWidth={2.5} />
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Row 1: category + jurisdiction + date */}
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: meta.color }}>{meta.label}</span>
                  {c.jurisdiction && <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>· {c.jurisdiction}</span>}
                  <span style={{ flex: 1 }} />
                  {isSaved && <Bookmark size={9} fill={meta.hex} strokeWidth={0} style={{ flexShrink: 0 }} />}
                  <span style={{ fontSize: 10, color: "var(--text-tertiary)", flexShrink: 0 }}>{relDate(c.published_at)}</span>
                </div>
                {/* Headline */}
                <p style={{ margin: "0 0 4px", fontSize: 13.5, fontWeight: 600, lineHeight: 1.35, color: "var(--text-primary)" }}>{c.headline}</p>
                {/* Row 3: key value + source */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {kv ? (
                    <span style={{ fontSize: 11, fontWeight: 800, color: meta.color, fontFamily: "var(--font-mono)" }}>{kv}</span>
                  ) : <span />}
                  <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>{c.source?.name?.split(" · ")[0]}</span>
                </div>
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
      // Direct Canvas 2D render — bulletproof vs. html-to-image's off-screen DOM
      // capture, which returned blank PNGs on iOS Safari. 1200×675 = Twitter/X
      // optimal social card; LinkedIn renders this size cleanly too.
      const W = 1200, H = 675;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");

      // ── Background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, W, H);

      // ── Hero gradient (top 50%)
      const heroH = 340;
      const grad = ctx.createLinearGradient(0, 0, W, heroH);
      grad.addColorStop(0, hex);
      grad.addColorStop(0.55, hex + "DD");
      grad.addColorStop(1, hex + "99");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, heroH);
      // Inset highlight + shadow lines
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.fillRect(0, 0, W, 2);
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, heroH - 2, W, 2);

      // ── Category chip
      const SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';
      const SERIF = 'Georgia, "Times New Roman", serif';
      const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';

      const chipText = `${meta.label}${card.jurisdiction ? ` · ${card.jurisdiction}` : ""}`;
      ctx.font = `600 22px ${SANS}`;
      const chipTextW = ctx.measureText(chipText).width;
      const chipPadX = 22, chipH = 44, chipX = 60, chipY = 50;
      const chipW = chipTextW + chipPadX * 2;
      roundRect(ctx, chipX, chipY, chipW, chipH, chipH / 2);
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.32)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "#FFFFFF";
      ctx.textBaseline = "middle";
      ctx.fillText(chipText, chipX + chipPadX, chipY + chipH / 2 + 1);

      // ── Headline (serif, word-wrapped, with soft shadow)
      ctx.font = `600 48px ${SERIF}`;
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = "rgba(0,0,0,0.25)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;
      ctx.textBaseline = "top";
      const headlineY = chipY + chipH + 36;
      wrapText(ctx, card.headline || "", 60, headlineY, W - 120, 58, 3);
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // ── Plain English
      ctx.font = `400 22px ${SANS}`;
      ctx.fillStyle = "#3C3C43";
      ctx.textBaseline = "top";
      const peText = (card.plain_english || "").slice(0, 240);
      const peEnd = wrapText(
        ctx,
        peText + (card.plain_english && card.plain_english.length > 240 ? "…" : ""),
        60, heroH + 36, W - 120, 32, 3,
      );

      // ── Why it matters
      if (card.why_it_matters) {
        const wimY = peEnd + 24;
        const wimH = 116;
        roundRect(ctx, 60, wimY, W - 120, wimH, 14);
        ctx.fillStyle = hexAlpha(hex, 0.10);
        ctx.fill();
        ctx.fillStyle = hex;
        ctx.fillRect(60, wimY, 4, wimH);

        ctx.font = `700 14px ${SANS}`;
        ctx.fillStyle = hex;
        ctx.textBaseline = "top";
        ctx.fillText("WHY IT MATTERS", 84, wimY + 16);

        ctx.font = `500 19px ${SANS}`;
        ctx.fillStyle = "#1C1C1E";
        wrapText(ctx, (card.why_it_matters || "").slice(0, 200), 84, wimY + 44, W - 168, 28, 2);
      }

      // ── Footer: ath chip + URL
      const footY = H - 50;
      const athW = 60, athH = 42;
      roundRect(ctx, 60, footY - athH / 2, athW, athH, 10);
      ctx.fillStyle = "#0E0D0C";
      ctx.fill();
      ctx.font = `700 22px ${MONO}`;
      ctx.fillStyle = "#FFFFFF";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText("ath", 60 + athW / 2, footY + 1);

      ctx.textAlign = "left";
      ctx.font = `500 16px ${SANS}`;
      ctx.fillStyle = "#8E8E93";
      ctx.textBaseline = "middle";
      ctx.fillText("BFSI · ENTERPRISE AI · LIVE", 60 + athW + 14, footY);

      ctx.textAlign = "right";
      ctx.font = `600 18px ${SANS}`;
      ctx.fillStyle = "#0E0D0C";
      ctx.fillText("aitechhive.com", W - 60, footY);
      ctx.textAlign = "left";

      // ── Export
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 1.0));
      if (!blob) throw new Error("Canvas toBlob returned null");

      const file = new File([blob], `aitechhive-${card.id}.png`, { type: "image/png" });
      const shareUrl = `${window.location.origin}/c/${card.id}`;
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: card.headline, text: card.headline, url: shareUrl });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `aitechhive-${card.id}.png`; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (e) {
      console.error("share failed:", e);
    } finally {
      setGenerating(false);
    }
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
   CANVAS HELPERS (used by share-image renderer)
───────────────────────────────────────────────────────────────── */
function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = Infinity) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  if (!words.length) return y;
  let line = "";
  let yy = y;
  let lines = 0;
  for (let i = 0; i < words.length; i++) {
    const test = line ? line + " " + words[i] : words[i];
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      lines++;
      yy += lineHeight;
      if (lines >= maxLines - 1) {
        // last allowed line — pack the rest and truncate with ellipsis
        let rest = words.slice(i).join(" ");
        while (rest.length && ctx.measureText(rest + "…").width > maxWidth) rest = rest.slice(0, -1);
        ctx.fillText(rest + (rest.length < words.slice(i).join(" ").length ? "…" : ""), x, yy);
        return yy + lineHeight;
      }
      line = words[i];
    } else {
      line = test;
    }
  }
  if (line) { ctx.fillText(line, x, yy); yy += lineHeight; }
  return yy;
}

function hexAlpha(hex, alpha) {
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255).toString(16).padStart(2, "0");
  return hex + a;
}

function relDate(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "yesterday";
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function cardKeyVal(c) {
  if (c.category === "vendor" && c.amount) return `${c.amount}${c.round ? ` · ${c.round}` : ""}`;
  if (c.category === "career" && c.comp_low && c.comp_high) {
    const sym = { USD: "$", GBP: "£", EUR: "€" }[c.currency] || "";
    const f = (n) => `${sym}${n >= 1000 ? Math.round(n / 1000) + "K" : n}`;
    return `${f(c.comp_low)}–${f(c.comp_high)}`;
  }
  if (c.category === "regulation" && c.effective_date) {
    const days = Math.round((new Date(c.effective_date) - Date.now()) / 86400000);
    return days < 0 ? "In force" : `${days}d to effective`;
  }
  if (c.category === "tool" && c.stars) return `${c.stars >= 1000 ? (c.stars / 1000).toFixed(1) + "K" : c.stars} ★`;
  if (c.category === "research" && c.delta_pts != null) return `${c.delta_pts > 0 ? "+" : ""}${c.delta_pts} pts`;
  if (c.category === "insight" && c.stat_value) return c.stat_value;
  return null;
}

/* ─────────────────────────────────────────────────────────────────
   WORDMARK — "ath" chip only. Compact, monogrammatic.
───────────────────────────────────────────────────────────────── */
function Wordmark() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        aria-label="ath — ai tech hive"
        style={{
          width: 38, height: 38, borderRadius: 10,
          background: "var(--text-primary)",
          color: "var(--bg)",
          display: "grid", placeItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 14, fontWeight: 700, letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        ath
      </div>
      <div style={{ fontSize: 9.5, fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.09em" }}>
        BFSI · Enterprise AI<br />8× daily
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
  const [authError, setAuthError] = useState("");
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
  const [showWelcome, setShowWelcome] = useState(false);

  // Auth — validate session server-side and subscribe to all future auth events
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user ?? null));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      // Auto-close the sign-in gate when the magic link callback sets the session
      if (event === "SIGNED_IN") {
        setShowGate(false);
        setAuthError("");
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  // Surface auth callback errors (e.g. expired or already-used magic link)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth_error")) {
      window.history.replaceState({}, "", window.location.pathname);
      setAuthError("The magic link expired or was already used. Request a new one.");
      setShowGate(true);
    }
  }, []);

  // Welcome screen — show once per device
  useEffect(() => {
    if (!localStorage.getItem("ath_welcomed")) setShowWelcome(true);
  }, []);

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

  const doUnsave = useCallback(async (cardId) => {
    setSavedIds((prev) => { const n = new Set(prev); n.delete(cardId); return n; });
    setSavedCards((prev) => prev.filter((c) => c.id !== cardId));
    if (user) await supabase.from("saves").delete().eq("user_id", user.id).eq("card_id", cardId);
  }, [user, supabase]);

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
          {user ? (
            <button
              onClick={() => supabase.auth.signOut()}
              title={`${user.email} · Sign out`}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: "var(--blue)", border: "none",
                display: "grid", placeItems: "center",
                cursor: "pointer", color: "white",
                fontSize: 13, fontWeight: 800,
                fontFamily: "var(--font-mono)",
                letterSpacing: "-0.02em",
              }}
            >
              {user.email?.[0]?.toUpperCase() || "?"}
            </button>
          ) : (
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

      {/* ── Progress strip / count ─────────────────────────────── */}
      {catFilter === "all" ? (
        <div style={{ flexShrink: 0, padding: "0 16px 8px" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", letterSpacing: "0.01em" }}>
            {allCards.length} live stories · endless scroll
          </span>
        </div>
      ) : (
        progressTotal > 0 && !isEmpty && (
          <div style={{ flexShrink: 0, padding: "0 16px 8px", display: "flex", alignItems: "center", gap: 3 }}>
            {Array.from({ length: Math.min(progressTotal, 14) }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, transition: "background 0.3s", background: i < progressCount ? "var(--blue)" : "var(--separator)" }} />
            ))}
            {progressTotal > 14 && <div style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--separator)", flexShrink: 0 }} />}
            <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
              {progressCount + 1}/{progressTotal}
            </span>
          </div>
        )
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

              {/* Welcome overlay — shown once on first visit, sits above the card */}
              <AnimatePresence>
                {showWelcome && (
                  <WelcomeCard
                    onDismiss={() => {
                      localStorage.setItem("ath_welcomed", "1");
                      setShowWelcome(false);
                    }}
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
                <SignupGate
                  supabase={supabase}
                  initialError={authError}
                  onClose={() => { setShowGate(false); setGateSkipped(true); setAuthError(""); }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SavedSheet
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        items={savedCards}
        onRemove={doUnsave}
        onClear={async () => {
          if (user) await supabase.from("saves").delete().eq("user_id", user.id);
          setSavedIds(new Set()); setSavedCards([]);
        }}
      />
      <ArchiveSheet open={archiveOpen} onClose={() => setArchiveOpen(false)} allCards={allCards} savedIds={savedIds} />
      <ShareModal open={!!shareCard} onClose={() => setShareCard(null)} card={shareCard} />
    </main>
  );
}

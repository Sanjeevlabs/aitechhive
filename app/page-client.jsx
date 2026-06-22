"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  AnimatePresence, motion,
  useMotionValue, useTransform, animate,
} from "framer-motion";
import {
  Bookmark, Share2, Scale, Building2, Coins, Compass,
  Terminal, BookOpen, FlaskConical, ExternalLink, Zap, Inbox, Mail,
  Loader2, Check, X, Archive, Globe,
  GraduationCap, Flame, RefreshCw, LogOut, Trash2, Clock, TrendingUp,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

/* ─────────────────────────────────────────────────────────────────
   CATEGORY CONFIG
───────────────────────────────────────────────────────────────── */
const CATS = {
  trending:   { label: "Trending",   Icon: Flame,         color: "var(--red)",    soft: "var(--red-soft)",    hex: "#A8423D" },
  learner:    { label: "Learner",    Icon: GraduationCap, color: "var(--yellow)", soft: "var(--yellow-soft)", hex: "#B89043" },
  regulation: { label: "Regulation", Icon: Scale,         color: "var(--blue)",   soft: "var(--blue-soft)",   hex: "#3D6FA8" },
  deployment: { label: "Deployment", Icon: Building2,     color: "var(--green)",  soft: "var(--green-soft)",  hex: "#5E8F6E" },
  vendor:     { label: "Vendor",     Icon: Coins,         color: "var(--orange)", soft: "var(--orange-soft)", hex: "#B5703D" },
  shift:      { label: "Shift",      Icon: Compass,       color: "var(--purple)", soft: "var(--purple-soft)", hex: "#8867AD" },
  tool:       { label: "Tool",       Icon: Terminal,      color: "var(--indigo)", soft: "var(--indigo-soft)", hex: "#5A5894" },
  research:   { label: "Research",   Icon: FlaskConical,  color: "var(--teal)",   soft: "var(--teal-soft)",   hex: "#5A8AAA" },
  insight:    { label: "Insight",    Icon: BookOpen,      color: "var(--brown)",  soft: "var(--brown-soft)",  hex: "#86694B" },
  frontier:   { label: "Frontier AI", Icon: Globe,        color: "var(--mint)",   soft: "var(--mint-soft)",   hex: "#5C9E97" },
};

// Hardcoded for the Canvas share renderer (CSS vars don't resolve in Canvas).
// Mirror the muted palette from globals.css so shared cards match on-screen tone.
const SHARE_HEX = {
  trending: "#A8423D", learner: "#B89043",
  regulation: "#3D6FA8", deployment: "#5E8F6E", vendor: "#B5703D",
  shift: "#8867AD", tool: "#5A5894", research: "#5A8AAA", insight: "#86694B", frontier: "#5C9E97",
};

/* ─────────────────────────────────────────────────────────────────
   DECK ORDERING
   deckActed = cards you've saved OR skipped this session (+ DB dismissed).
   Always show deck[0] — no deckPos index needed.
───────────────────────────────────────────────────────────────── */
function orderDeck(cards, deckActed = new Set(), catFilter = "all") {
  const dayAgo = Date.now() - 24 * 3600 * 1000;
  const base = cards
    .filter((c) => !deckActed.has(c.id))
    .filter((c) => catFilter === "all" || c.category === catFilter);

  // Strict freshness: newest first, last 24h only.
  // The reader should feel "caught up" after working through the deck.
  const fresh = base
    .filter((c) => new Date(c.published_at || c.source?.date || 0).getTime() >= dayAgo)
    .sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0));

  // Safety net: if the refresh pipeline is wedged and nothing is <24h old,
  // show the most-recent cards we have instead of an empty deck.
  const list = fresh.length > 0
    ? fresh
    : [...base].sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0));

  // Annotate each card with its variant. "lead" only on the All view, position 0
  // — picking it inside a single category felt jarring (every category gets one).
  return list.slice(0, 20).map((c, i) => {
    const annotated = { ...c, _isLead: catFilter === "all" && i === 0 };
    annotated._variant = chooseVariant(annotated);
    return annotated;
  });
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
/* ─────────────────────────────────────────────────────────────────
   CARD VARIANT ROUTING — editorial hierarchy v1
   - "lead"      : today's #1 story, taller hero band, eyebrow
   - "mega-stat" : cards with a strong number (deal size, %, benchmark)
   - "standard"  : everything else, current design
───────────────────────────────────────────────────────────────── */
function chooseVariant(card) {
  if (card._isLead) return "lead";
  if (card.category === "vendor" && card.amount) return "mega-stat";
  if (card.category === "research" && card.delta_pts != null) return "mega-stat";
  if (card.category === "insight" && card.stat_value) return "mega-stat";
  return "standard";
}
function megaStatValue(card) {
  if (card.amount) {
    return { value: card.amount, label: card.round || "Deal size" };
  }
  if (card.delta_pts != null) {
    const sign = card.delta_pts > 0 ? "+" : "";
    return { value: `${sign}${card.delta_pts} pts`, label: card.benchmark_name || "Benchmark delta" };
  }
  if (card.stat_value) {
    return { value: card.stat_value, label: card.stat_label || "Production reality" };
  }
  return null;
}

/* ─────────────────────────────────────────────────────────────────
   TIMELINE RIBBON — 24h timeline of fresh cards
   Anchors the reader: shows where each story sits in today's cycle.
───────────────────────────────────────────────────────────────── */
function TimelineRibbon({ cards, currentId, color }) {
  if (!cards || cards.length === 0) return null;
  const now = Date.now();
  const day = 24 * 3600 * 1000;
  return (
    <div style={{ position: "relative", zIndex: 1, flexShrink: 0, padding: "2px 16px 10px" }}>
      <div style={{ position: "relative", height: 18 }}>
        {/* Track */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 11, height: 2, background: "var(--separator)", borderRadius: 1 }} />
        {/* Endpoint labels */}
        <span style={{ position: "absolute", left: 0, top: -2, fontSize: 8.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>24h ago</span>
        <span style={{ position: "absolute", right: 0, top: -2, fontSize: 8.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>now</span>
        {/* Dots */}
        {cards.map((c) => {
          const t = new Date(c.published_at || c.source?.date || 0).getTime();
          if (!t) return null;
          const age = (now - t) / day;
          if (age < 0 || age > 1.05) return null;
          const pos = Math.max(0, Math.min(1, 1 - age));
          const isCurrent = c.id === currentId;
          return (
            <div key={c.id} style={{
              position: "absolute", top: isCurrent ? 7 : 9,
              left: `${pos * 100}%`,
              width: isCurrent ? 10 : 5, height: isCurrent ? 10 : 5,
              borderRadius: "50%",
              background: isCurrent ? color : "var(--text-tertiary)",
              transform: "translate(-50%, 0)",
              boxShadow: isCurrent ? `0 0 0 3px ${color}25` : "none",
              transition: "all 0.3s ease",
              opacity: isCurrent ? 1 : 0.55,
            }} />
          );
        })}
      </div>
    </div>
  );
}

function StoryCard({ card }) {
  const meta = CATS[card.category] || CATS.insight;
  const { hex } = meta;
  const variant = card._variant || "standard";
  const isLead = variant === "lead";
  const stat = variant === "mega-stat" ? megaStatValue(card) : null;

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      background: "var(--card)", borderRadius: 20,
      // Apple-like: barely-there border, lighter shadow. The card is the page,
      // not a card-in-a-card.
      border: "1px solid rgba(0,0,0,0.05)",
      boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 24px 48px rgba(0,0,0,0.04)",
      overflow: "hidden",
      userSelect: "none", WebkitUserSelect: "none",
    }}>
      {/* Meta row: just category eyebrow + jurisdiction + date.
          No "Today's Lead" label — lead status is communicated by size alone. */}
      <div style={{
        flexShrink: 0,
        padding: "22px 26px 0",
        display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", minWidth: 0 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.2em",
            textTransform: "uppercase", color: hex,
          }}>{meta.label}</span>
          {card.jurisdiction && (
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "var(--text-tertiary)",
            }}>{card.jurisdiction}</span>
          )}
          {card.severity === "high" && (
            <span aria-label="high importance" style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "var(--red)",
            }}>●</span>
          )}
        </div>
        <span style={{
          fontSize: 10.5, fontWeight: 500, color: "var(--text-tertiary)",
          letterSpacing: "0.02em", flexShrink: 0, fontVariantNumeric: "tabular-nums",
        }}>{relDate(card.published_at)}</span>
      </div>

      {/* Hero: mega-stat or serif headline. Pure black on white.
          Apple News-scale type — the headline is the room. */}
      <div style={{ flexShrink: 0, padding: isLead ? "20px 26px 0" : "16px 26px 0" }}>
        {stat && (
          <div style={{ marginBottom: 18 }}>
            <div style={{
              fontSize: 64, fontWeight: 700, lineHeight: 0.96, color: "var(--text-primary)",
              fontFamily: "var(--font-serif)", letterSpacing: "-0.04em",
            }}>{stat.value}</div>
            <div style={{
              fontSize: 10, fontWeight: 700, color: hex,
              letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 10,
            }}>{stat.label}</div>
          </div>
        )}
        <h2 style={{
          margin: 0,
          fontSize: isLead ? 38 : (stat ? 22 : 30),
          fontWeight: 600, lineHeight: isLead ? 1.08 : 1.14,
          letterSpacing: "-0.028em",
          color: "var(--text-primary)",
          fontFamily: "var(--font-serif)",
        }}>{card.headline}</h2>
      </div>

      {/* Body: plain_english, viz, why-it-matters, jargon */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "20px 26px 10px", WebkitOverflowScrolling: "touch" }}>
        <p style={{
          margin: 0,
          fontSize: 15.5, lineHeight: 1.6,
          color: "var(--text-secondary)",
          fontFamily: "var(--font-sans)",
        }}>{card.plain_english}</p>

        {!stat && <MicroViz card={card} />}

        {/* Why it matters — pull-quote, serif italic, color only on the label */}
        {card.why_it_matters && (
          <div style={{
            margin: "24px 0 0",
            padding: "0 0 0 18px",
            borderLeft: `2px solid ${hex}`,
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: hex,
              letterSpacing: "0.18em", textTransform: "uppercase",
              marginBottom: 8,
            }}>Why it matters</div>
            <p style={{
              margin: 0, fontSize: 15, lineHeight: 1.5,
              color: "var(--text-primary)",
              fontFamily: "var(--font-serif)", fontStyle: "italic",
              letterSpacing: "-0.008em",
            }}>{card.why_it_matters}</p>
          </div>
        )}

        {/* Jargon — inline term + def, no boxes */}
        {Array.isArray(card.jargon) && card.jargon.length > 0 && (
          <div style={{ margin: "24px 0 0" }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: "var(--text-tertiary)",
              letterSpacing: "0.18em", textTransform: "uppercase",
              marginBottom: 10,
            }}>Decode</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {card.jargon.map((j, i) => (
                <p key={i} style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{j.term}</span>
                  <span style={{ color: "var(--text-secondary)" }}> — {j.def}</span>
                </p>
              ))}
            </div>
          </div>
        )}

        <div style={{ height: 16 }} />
      </div>

      {/* Source footer — quiet, no labels */}
      <div style={{
        flexShrink: 0, padding: "14px 26px 16px",
        borderTop: "1px solid rgba(0,0,0,0.05)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
      }}>
        <a
          href={card.source?.url} target="_blank" rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ fontSize: 11.5, fontWeight: 500, color: "var(--text-tertiary)", display: "inline-flex", alignItems: "center", gap: 5, textDecoration: "none", minWidth: 0, overflow: "hidden" }}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.source?.name}</span>
          <ExternalLink size={10} style={{ flexShrink: 0, opacity: 0.7 }} />
        </a>
        <span style={{ fontSize: 10, fontWeight: 500, color: "var(--text-tertiary)", opacity: 0.45, flexShrink: 0, letterSpacing: "0.02em" }}>aitechhive.com</span>
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
   DESKTOP BACKGROUND  —  geometric glow fills empty sides on laptop
───────────────────────────────────────────────────────────────── */
function DesktopBackground() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }} aria-hidden="true">
      {/* Dot grid */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <pattern id="bg-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgba(0,0,0,0.04)" />
          </pattern>
          <linearGradient id="gL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="gR" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-dots)" />
        {/* Left concentric rings */}
        <circle cx="13%" cy="50%" r="80"  fill="none" stroke="url(#gL)" strokeWidth="0.75" />
        <circle cx="13%" cy="50%" r="150" fill="none" stroke="url(#gL)" strokeWidth="0.5"  />
        <circle cx="13%" cy="50%" r="220" fill="none" stroke="url(#gL)" strokeWidth="0.4" opacity="0.5" />
        {/* Left crosshair */}
        <line x1="13%" y1="14%" x2="13%" y2="86%" stroke="url(#gL)" strokeWidth="0.4" opacity="0.35" />
        <line x1="1%"  y1="50%" x2="25%" y2="50%" stroke="url(#gL)" strokeWidth="0.4" opacity="0.35" />
        {/* Right concentric rings */}
        <circle cx="87%" cy="50%" r="80"  fill="none" stroke="url(#gR)" strokeWidth="0.75" />
        <circle cx="87%" cy="50%" r="150" fill="none" stroke="url(#gR)" strokeWidth="0.5"  />
        <circle cx="87%" cy="50%" r="220" fill="none" stroke="url(#gR)" strokeWidth="0.4" opacity="0.5" />
        {/* Right crosshair */}
        <line x1="87%" y1="14%" x2="87%" y2="86%" stroke="url(#gR)" strokeWidth="0.4" opacity="0.35" />
        <line x1="75%" y1="50%" x2="99%" y2="50%" stroke="url(#gR)" strokeWidth="0.4" opacity="0.35" />
      </svg>

      {/* Glow blobs — left */}
      <div style={{ position: "absolute", top: "22%", left: "4%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(120,60,255,0.18) 0%, transparent 70%)", filter: "blur(64px)" }} />
      <div style={{ position: "absolute", bottom: "8%", left: "12%", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,200,190,0.10) 0%, transparent 70%)", filter: "blur(48px)" }} />
      {/* Glow blobs — right */}
      <div style={{ position: "absolute", top: "48%", right: "4%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,130,255,0.16) 0%, transparent 70%)", filter: "blur(56px)", transform: "translateY(-50%)" }} />
      <div style={{ position: "absolute", top: "15%", right: "14%", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(120,60,255,0.10) 0%, transparent 70%)", filter: "blur(40px)" }} />

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   WELCOME CARD  —  shown as the first page on every visit
───────────────────────────────────────────────────────────────── */
function WelcomeCard({ onDismiss, briefCards }) {
  // Quiet premium palette — single solid cherry-blossom surface, no gradients.
  const surface = "#FFF1F1";       // soft cherry background
  const accent  = "#A23E47";       // muted cherry red (button + accent only)
  const ink     = "#1F1416";       // near-black with a warm cherry undertone
  const inkMute = "#6B5A5C";       // secondary text
  const inkSoft = "#A39093";       // tertiary text

  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "absolute", inset: 0, zIndex: 10,
        background: surface,
        borderRadius: 20, overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "24px 26px 22px",
        boxShadow: `0 1px 2px rgba(0,0,0,0.03), 0 24px 48px rgba(122,44,51,0.08)`,
        userSelect: "none",
      }}
    >
      {/* Top: tiny ath mark on left, date on right. No other chrome. */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <BeeMark size={32} />
        <span style={{ fontSize: 11, fontWeight: 500, color: inkMute, letterSpacing: "0.02em", fontVariantNumeric: "tabular-nums" }}>{dateLabel}</span>
      </div>

      {/* Middle: "Today." monumental serif, then three italic-serif headlines */}
      <div style={{ flexShrink: 1, minHeight: 0 }}>
        <h1 style={{
          margin: 0,
          fontSize: 72, fontWeight: 600, lineHeight: 0.95,
          color: ink, letterSpacing: "-0.04em",
          fontFamily: "var(--font-serif)",
        }}>Today.</h1>

        {Array.isArray(briefCards) && briefCards.length > 0 && (
          <ol style={{
            margin: "30px 0 0", padding: 0, listStyle: "none",
            display: "flex", flexDirection: "column", gap: 14,
            borderTop: `1px solid rgba(162,62,71,0.16)`, paddingTop: 18,
          }}>
            {briefCards.slice(0, 3).map((c) => (
              <li key={c.id} style={{
                fontSize: 15, lineHeight: 1.32, color: ink,
                fontFamily: "var(--font-serif)", fontStyle: "italic",
                letterSpacing: "-0.012em",
              }}>{c.headline}</li>
            ))}
          </ol>
        )}
      </div>

      {/* Bottom: a single restrained "Begin" button. No supporting copy. */}
      <div style={{ flexShrink: 0 }}>
        <button
          onClick={onDismiss}
          style={{
            width: "100%", padding: "14px",
            borderRadius: 12,
            background: ink,
            color: surface,
            fontSize: 15, fontWeight: 600,
            letterSpacing: "0.04em", textTransform: "uppercase",
            border: "none", cursor: "pointer",
          }}
        >
          Begin
        </button>
        <p style={{ margin: "10px 0 0", fontSize: 10, color: inkSoft, textAlign: "center", letterSpacing: "0.04em" }}>
          Free. No newsletters. Saves sync across devices.
        </p>
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

  const signInGoogle = async () => {
    setPhase("loading"); setError("");
    const { error: authErr } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
    if (authErr) {
      setError(friendlyAuthError(authErr.message));
      setPhase("error");
    }
    // On success the browser navigates to Google — no further action here
  };

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
          {/* Google OAuth */}
          <button
            onClick={signInGoogle}
            disabled={phase === "loading"}
            style={{ width: "100%", padding: "13px", borderRadius: 14, background: "white", color: "#1C1C1E", fontSize: 15, fontWeight: 600, border: "1.5px solid #E0E0E0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.347 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: "var(--separator)" }} />
            <span style={{ fontSize: 12, color: "var(--text-tertiary)", fontWeight: 500 }}>or email</span>
            <div style={{ flex: 1, height: 1, background: "var(--separator)" }} />
          </div>

          {/* Magic link email */}
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
  const [confirmClear, setConfirmClear] = useState(false);

  // Reset confirm state when sheet closes
  useEffect(() => { if (!open) setConfirmClear(false); }, [open]);

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
              confirmClear ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button
                    onClick={() => { onClear(); setConfirmClear(false); }}
                    style={{ background: "var(--red)", color: "white", border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    Clear all
                  </button>
                  <button onClick={() => setConfirmClear(false)}
                    style={{ background: "none", border: "none", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer", padding: 0 }}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => setConfirmClear(true)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--text-tertiary)", padding: 0 }}>
                  Clear all
                </button>
              )
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
                <button
                  onClick={(e) => { e.stopPropagation(); if (c.id) onRemove?.(c.id); }}
                  aria-label="Remove"
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
const DATE_RANGES = [
  { key: "today", label: "Today",  ms: 24 * 3600_000 },
  { key: "week",  label: "7 days", ms: 7 * 24 * 3600_000 },
  { key: "all",   label: "All",    ms: Infinity },
];
const PAGE_SIZE = 30;

function ArchiveSheet({ open, onClose, allCards, savedIds }) {
  const [filter,    setFilter]    = useState("all");
  const [dateRange, setDateRange] = useState("week");
  const [search,    setSearch]    = useState("");
  const [page,      setPage]      = useState(1);

  // Reset pagination whenever any filter changes
  useEffect(() => { setPage(1); }, [filter, dateRange, search]);
  // Reset all state when sheet closes
  useEffect(() => { if (!open) { setFilter("all"); setDateRange("week"); setSearch(""); setPage(1); } }, [open]);

  const catCounts = useMemo(() => {
    const m = {};
    for (const c of allCards) m[c.category] = (m[c.category] || 0) + 1;
    return m;
  }, [allCards]);

  const filtered = useMemo(() => {
    const cutoff = Date.now() - (DATE_RANGES.find(r => r.key === dateRange)?.ms ?? Infinity);
    let xs = allCards.filter((c) => {
      const t = new Date(c.published_at || 0).getTime();
      return dateRange === "all" || t >= cutoff;
    });
    if (filter !== "all") xs = xs.filter((c) => c.category === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      xs = xs.filter((c) => (c.headline || "").toLowerCase().includes(q) || (c.plain_english || "").toLowerCase().includes(q));
    }
    return [...xs].sort((a, b) => {
      const s = (savedIds.has(b.id) ? 1 : 0) - (savedIds.has(a.id) ? 1 : 0);
      return s !== 0 ? s : new Date(b.published_at || 0) - new Date(a.published_at || 0);
    });
  }, [allCards, filter, dateRange, search, savedIds]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  return (
    <Sheet open={open} onClose={onClose}>
      <div style={{ flexShrink: 0, padding: "14px 20px 12px", borderBottom: "1px solid var(--separator)" }}>
        {/* Title row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.015em" }}>Archive</h3>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", marginTop: 2 }}>
              {filtered.length} of {allCards.length} stories
            </div>
          </div>
          <button onClick={onClose} aria-label="Close archive"
            style={{ width: 34, height: 34, borderRadius: 10, background: "var(--card-secondary)", border: "1px solid var(--separator)", cursor: "pointer", display: "grid", placeItems: "center", color: "var(--text-primary)" }}>
            <X size={15} strokeWidth={2.4} />
          </button>
        </div>

        {/* Date range pills */}
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          {DATE_RANGES.map((r) => (
            <button key={r.key} onClick={() => setDateRange(r.key)}
              style={{ padding: "5px 13px", borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "none", background: dateRange === r.key ? "var(--text-primary)" : "var(--card-secondary)", color: dateRange === r.key ? "var(--bg)" : "var(--text-secondary)" }}>
              {r.label}
            </button>
          ))}
        </div>

        {/* Category breakdown grid */}
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

        {/* Search */}
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search headlines…"
          style={{ width: "100%", padding: "10px 14px", borderRadius: 12, fontSize: 14, background: "var(--card-secondary)", border: "1px solid var(--separator)", color: "var(--text-primary)", outline: "none", boxSizing: "border-box" }}
        />

        {/* Category filter pills */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", marginTop: 10, scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
          {["all", ...Object.keys(CATS)].map((k) => {
            const active = filter === k;
            const meta = k !== "all" ? CATS[k] : null;
            return (
              <button key={k} onClick={() => setFilter(k)}
                style={{ flexShrink: 0, padding: "6px 13px", borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "none", background: active ? (meta?.color || "var(--text-primary)") : "var(--card-secondary)", color: active ? "white" : "var(--text-secondary)" }}>
                {k === "all" ? "All" : `${meta.label}${catCounts[k] ? ` · ${catCounts[k]}` : ""}`}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px 20px", display: "flex", flexDirection: "column", gap: 7 }}>
        {filtered.length === 0 && (
          <p style={{ textAlign: "center", padding: "40px 0", fontSize: 15, color: "var(--text-secondary)" }}>
            No stories in this range. Try "7 days" or "All".
          </p>
        )}
        {visible.map((c) => {
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
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: meta.color }}>{meta.label}</span>
                  {c.jurisdiction && <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>· {c.jurisdiction}</span>}
                  <span style={{ flex: 1 }} />
                  {isSaved && <Bookmark size={9} fill={meta.hex} strokeWidth={0} style={{ flexShrink: 0 }} />}
                  <span style={{ fontSize: 10, color: "var(--text-tertiary)", flexShrink: 0 }}>{relDate(c.published_at)}</span>
                </div>
                <p style={{ margin: "0 0 4px", fontSize: 13.5, fontWeight: 600, lineHeight: 1.35, color: "var(--text-primary)" }}>{c.headline}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {kv ? <span style={{ fontSize: 11, fontWeight: 800, color: meta.color, fontFamily: "var(--font-mono)" }}>{kv}</span> : <span />}
                  <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>{c.source?.name?.split(" · ")[0]}</span>
                </div>
              </div>
            </a>
          );
        })}
        {hasMore && (
          <button onClick={() => setPage((p) => p + 1)}
            style={{ width: "100%", padding: "12px", borderRadius: 14, background: "var(--card-secondary)", border: "1.5px solid var(--separator)", color: "var(--text-secondary)", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 4 }}>
            Load {Math.min(PAGE_SIZE, filtered.length - visible.length)} more
          </button>
        )}
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
      <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.55, color: "var(--text-secondary)" }}>Top 20 live stories. Full archive below.</p>
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
   WORDMARK — "ath" chip + live indicator + density signal
───────────────────────────────────────────────────────────────── */
function BeeMark({ size = 36, color = "currentColor" }) {
  // Monochrome geometric mark — single hexagon outline + a centered
  // node/kernel. Same geometry as /icon.svg + /apple-icon.svg so the
  // favicon and the in-app logo are visually identical.
  // Keeping the export name as BeeMark for now (existing call site
  // in WelcomeCard still uses it); the shape is no longer a bee.
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size} height={size}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
      style={{ display: "block", color }}
    >
      <path
        d="M 32 8 L 55 20 L 55 44 L 32 56 L 9 44 L 9 20 Z"
        fill="none" stroke="currentColor" strokeWidth="5"
        strokeLinejoin="round" strokeLinecap="round"
      />
      <circle cx="32" cy="32" r="5.5" fill="currentColor" />
    </svg>
  );
}

function Wordmark() {
  return (
    <div
      aria-label="AITechHive"
      style={{ display: "inline-flex", alignItems: "center", color: "var(--text-primary)" }}
    >
      <BeeMark size={32} />
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
      onClick={onClick} aria-label={label} title={label}
      style={{
        flex: "0 0 auto",
        display: "inline-grid", placeItems: "center",
        width: 36, height: 36, borderRadius: 18,
        background: "transparent",
        color: active ? "var(--text-primary)" : "var(--text-tertiary)",
        border: "none",
        cursor: "pointer",
        userSelect: "none",
        transition: "color 0.12s ease, transform 0.12s ease, background 0.12s ease",
      }}
      onPointerDown={(e) => { e.currentTarget.style.transform = "scale(0.9)"; e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
      onPointerUp={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.background = ""; }}
      onPointerLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.background = ""; }}
    >
      {children}
    </button>
  );
}


/* ─────────────────────────────────────────────────────────────────
   ROOT
───────────────────────────────────────────────────────────────── */
// Light client-side dedup — server (enrich.mjs) already runs the
// three-layer dedup (URL + sorted-token hash + Jaccard). All this
// does is defend against the same id appearing twice if cards.json
// is ever malformed. No more headline/url heuristics that double-
// prune and make the welcome-stat count diverge from cards.json.
function dedupCards(cards) {
  const seen = new Set();
  return (cards || []).filter((c) => {
    if (!c.id || seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
}

export default function PageClient({ initialCards }) {
  // Defensive: if Supabase env vars are missing, return null instead of
  // constructing a client that throws on instantiation. All callers below
  // check `if (supabase)` before using it. Site renders unauthenticated;
  // saves/sign-in become no-ops but the deck works.
  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createBrowserClient(url, key);
  }, []);

  const [allCards] = useState(() => dedupCards(initialCards));
  // Per-category counts for the filter chip ticker
  const categoryCounts = useMemo(() => {
    const m = {};
    for (const c of allCards) m[c.category] = (m[c.category] || 0) + 1;
    return m;
  }, [allCards]);
  // Top 3 newest cards feed the "Today in 30s" brief on the welcome card.
  const briefCards = useMemo(() => {
    return [...allCards]
      .sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0))
      .slice(0, 3);
  }, [allCards]);
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
  // Welcome card is the first page every visit (not a one-time onboarding).
  const [showWelcome, setShowWelcome] = useState(true);

  // Auth — validate session server-side and subscribe to all future auth events
  useEffect(() => {
    if (!supabase) return; // Supabase not configured — render as unauthenticated
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user ?? null));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "SIGNED_IN") {
        setShowGate(false);
        setAuthError("");
      }
      if (event === "SIGNED_OUT") {
        // Don't re-trigger the gate after logout — user intentionally signed out
        setGateSkipped(true);
        setShowGate(false);
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

  // Welcome card always shows on mount — handled via useState default above.

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

    // Apple-style: short haptic on every swipe/tap action.
    // Android supports navigator.vibrate; iOS Safari ignores it gracefully.
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(action === "save" ? [6, 30, 6] : 6);
    }

    // Save requires a session — capture email + sync across devices.
    if (action === "save" && !user) {
      setShowGate(true);
      return;
    }

    if (action === "share") {
      // Prefer the native OS share sheet on supported platforms (iOS, Android,
      // recent Safari/Chrome). Falls back to the in-app ShareModal otherwise.
      const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/c/${topCard.id}`;
      const sharePayload = {
        title: topCard.headline,
        text: topCard.plain_english?.slice(0, 220),
        url: shareUrl,
      };
      if (typeof navigator !== "undefined" && navigator.share) {
        try {
          await navigator.share(sharePayload);
          setStats((s) => ({ ...s, shared: s.shared + 1 }));
          if (user) supabase.from("shares").insert({ user_id: user.id, card_id: topCard.id });
          return;
        } catch (e) {
          // User dismissed the share sheet — fall through to the in-app modal
          // only if it wasn't a deliberate cancel.
          if (e?.name === "AbortError") return;
        }
      }
      setShareCard(topCard);
      setStats((s) => ({ ...s, shared: s.shared + 1 }));
      if (user) supabase.from("shares").insert({ user_id: user.id, card_id: topCard.id });
      return;
    }

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
     Only engages when the gesture STARTS in the top edge zone
     (iOS-style). Anywhere else, downward drags are treated as
     content scroll / card interaction — no accidental reloads.
  ─────────────────────────────────────────────────────────────── */
  const PULL_EDGE_ZONE = 80;   // gesture must start within this many px of viewport top
  const PULL_THRESHOLD = 96;   // damped px required to commit a refresh
  const PULL_MAX = 120;
  const pullRef = useRef({ startY: null, startX: null, current: 0, engaged: false });
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onPullStart = useCallback((e) => {
    if (refreshing || savedOpen || archiveOpen || shareCard || showGate) return;
    const t = e.touches?.[0];
    if (!t) return;
    // Edge gate: gesture must start near the top of the viewport.
    // Kills the dominant false-positive (downward drag mid-card, or
    // card-body scroll bubbling up to the pull-to-refresh handler).
    if (t.clientY > PULL_EDGE_ZONE) return;
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
      {/* ── Desktop geometric background — fills empty sides on laptop/wide screens */}
      <DesktopBackground />

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
      <header style={{ position: "relative", zIndex: 1, flexShrink: 0, padding: "12px 16px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Wordmark />
        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
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

      {/* ── Category filter — Apple News-style: tiny caps, dot separators ── */}
      <div style={{
        position: "relative", zIndex: 1, flexShrink: 0,
        padding: "2px 16px 12px",
        display: "flex", gap: 0, alignItems: "baseline",
        overflowX: "auto",
        scrollbarWidth: "none", WebkitOverflowScrolling: "touch",
      }}>
        {["all", ...Object.keys(CATS)].map((key, i, arr) => {
          const active = catFilter === key;
          const meta = key !== "all" ? CATS[key] : null;
          return (
            <span key={key} style={{ display: "inline-flex", alignItems: "baseline", flexShrink: 0 }}>
              <button
                onClick={() => { setCatFilter(key); setProgressCount(0); }}
                style={{
                  padding: "4px 0",
                  border: "none", background: "transparent",
                  fontSize: 10.5, cursor: "pointer",
                  fontWeight: active ? 700 : 500,
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  color: active ? (meta?.hex || "var(--text-primary)") : "var(--text-tertiary)",
                  transition: "color 0.15s ease",
                }}
              >
                {key === "all" ? "All" : meta.label}
              </button>
              {i < arr.length - 1 && (
                <span aria-hidden="true" style={{
                  padding: "0 10px", color: "var(--text-tertiary)",
                  opacity: 0.4, fontSize: 9, transform: "translateY(-1px)",
                }}>·</span>
              )}
            </span>
          );
        })}
      </div>

      {/* ── Progress strip (per-category view only) ─────────────── */}
      {catFilter !== "all" && progressTotal > 0 && !isEmpty && (
        <div style={{ position: "relative", zIndex: 1, flexShrink: 0, padding: "0 16px 8px", display: "flex", alignItems: "center", gap: 3 }}>
          {Array.from({ length: Math.min(progressTotal, 14) }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, transition: "background 0.3s", background: i < progressCount ? "var(--blue)" : "var(--separator)" }} />
          ))}
          {progressTotal > 14 && <div style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--separator)", flexShrink: 0 }} />}
          <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
            {progressCount + 1}/{progressTotal}
          </span>
        </div>
      )}

      {/* ── Timeline ribbon (All view only) ─────────────────────────
          Where this story sits in the 24h news cycle. Anchors the reader
          across the deck so freshness is visible at a glance. */}
      {catFilter === "all" && topCard && !isEmpty && (
        <TimelineRibbon
          cards={deck}
          currentId={topCard.id}
          color={CATS[topCard.category]?.hex || "var(--text-primary)"}
        />
      )}

      {/* ── Card area  ─────────────────────────────────────────────
          IMPORTANT: Centering is done with flex on this wrapper.
          DO NOT use transform:translateX(-50%) on the motion.div —
          Framer Motion composes its own transforms and will wipe it.
      ─────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, position: "relative", zIndex: 1 }}>
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

              {/* Welcome overlay — always the first page on every visit, sits above the deck */}
              <AnimatePresence>
                {showWelcome && (
                  <WelcomeCard onDismiss={() => setShowWelcome(false)} briefCards={briefCards} />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ── Action bar — Apple-style: tiny icon-only buttons, centered, no labels.
          Hierarchy: swipe is the primary action; these are tertiary. */}
      {!isEmpty && (
        <div style={{ position: "relative", zIndex: 1, flexShrink: 0, padding: "2px 16px max(10px, env(safe-area-inset-bottom))" }}>
          <div style={{ maxWidth: 520, margin: "0 auto", display: "flex", gap: 18, alignItems: "center", justifyContent: "center" }}>
            <BigActionBtn label="Skip" onClick={() => doAction("next")}>
              <X size={18} strokeWidth={1.75} />
            </BigActionBtn>
            <BigActionBtn label="Share" onClick={() => doAction("share")}>
              <Share2 size={16} strokeWidth={1.75} />
            </BigActionBtn>
            <BigActionBtn label="Save" onClick={() => doAction("save")} active={savedIds.has(topCard?.id)}>
              <Bookmark size={17} strokeWidth={1.75} fill={savedIds.has(topCard?.id) ? "currentColor" : "none"} />
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

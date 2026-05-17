"use client";

/**
 * AITechHive v2 — WSJ × Spotify × Apple swipeable feed.
 * Light category-tinted cards on dark glass chrome. Mobile-first.
 * Supabase auth (Google + magic link). Cross-device saves.
 */

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  Bookmark, ChevronDown, ArrowLeft, ArrowRight, ArrowUp, Share2,
  Scale, Building2, Coins, Briefcase, Terminal, BookOpen, FlaskConical,
  ExternalLink, Zap, Inbox, Mail, Loader2, Check, X, Archive, Sparkles,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

/* ============================================================
   CATEGORY THEMING
   ============================================================ */
const CATS = {
  regulation: { label: "Regulation", Icon: Scale,         bg: "#FAF7EE", accent: "#8B6F1F", chipBg: "#F4EFE0" },
  deployment: { label: "Deployment", Icon: Building2,     bg: "#F2F6F4", accent: "#3F6E5F", chipBg: "#E5EFE9" },
  vendor:     { label: "Vendor",     Icon: Coins,         bg: "#F8F1EC", accent: "#8E4A2A", chipBg: "#F1E4DA" },
  career:     { label: "Career",     Icon: Briefcase,     bg: "#F8F1F3", accent: "#8E3A52", chipBg: "#F1E2E7" },
  tool:       { label: "Tool",       Icon: Terminal,      bg: "#EFF2F8", accent: "#3F4F7E", chipBg: "#E0E6F0" },
  research:   { label: "Research",   Icon: FlaskConical,  bg: "#F0F3F6", accent: "#3D5A6E", chipBg: "#E0E8EE" },
  insight:    { label: "Insight",    Icon: BookOpen,      bg: "#F5F4F0", accent: "#5C544A", chipBg: "#EAE7DE" },
};
const SEV = { low: "#9AA294", med: "#C8A964", high: "#C85A4A" };

/* ============================================================
   DECK ORDERING (per PRD §4.3)
   ============================================================ */
function orderDeck(cards, dismissedIds = new Set()) {
  const now = Date.now();
  const fresh = cards
    .filter((c) => !dismissedIds.has(c.id))
    .map((c) => {
      const ageH = (now - new Date(c.published_at || c.source?.date || 0).getTime()) / 3600000;
      let freshW = 0.2;
      if (ageH < 12) freshW = 1.0;
      else if (ageH < 24) freshW = 0.7;
      else if (ageH < 48) freshW = 0.4;
      const sevW = c.severity === "high" ? 3 : c.severity === "med" ? 2 : 1;
      return { ...c, _score: sevW + freshW };
    })
    .sort((a, b) => b._score - a._score)
    .slice(0, 14);

  // Greedy interleave
  const ordered = [];
  const pool = [...fresh];
  while (pool.length) {
    const last2 = ordered.slice(-2).map((c) => c.category);
    const sameCat = last2.length === 2 && last2[0] === last2[1];
    let pickIdx = 0;
    if (sameCat) {
      const alt = pool.findIndex((c) => c.category !== last2[0]);
      if (alt !== -1) pickIdx = alt;
    }
    ordered.push(pool.splice(pickIdx, 1)[0]);
  }
  return ordered;
}

/* ============================================================
   FORMATTERS
   ============================================================ */
function fmtDate() {
  return new Date()
    .toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    .toUpperCase();
}
function fmtIssue() {
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 0);
  const day = Math.floor((d - start) / 86400000);
  return `VOL ${String(d.getFullYear()).slice(2)} · NO. ${String(day).padStart(3, "0")}`;
}

/* ============================================================
   MICRO-VIZ
   ============================================================ */
function MicroViz({ card }) {
  const meta = CATS[card.category] || CATS.insight;

  if (card.category === "regulation" && card.effective_date) {
    const days = Math.round((new Date(card.effective_date) - Date.now()) / 86400000);
    const status = days < 0 ? "IN FORCE" : `IN ${days} DAYS`;
    const fillPct = days < 0 ? 100 : Math.max(0, Math.min(100, 100 - (days / 365) * 100));
    const color = days < 0 ? "#3F6E5F" : days < 90 ? "#C85A4A" : days < 180 ? "#C8A964" : "#5C544A";
    return (
      <div className="mt-4">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-[10px] font-semibold tracking-[0.2em]" style={{ color: meta.accent, fontFamily: "var(--font-mono)" }}>EFFECTIVE</span>
          <span className="text-[12px] font-semibold tabular-nums" style={{ color, fontFamily: "var(--font-mono)" }}>{status}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
          <div className="h-full rounded-full" style={{ width: `${fillPct}%`, background: color }} />
        </div>
      </div>
    );
  }

  if (card.category === "vendor" && card.amount) {
    return (
      <div className="mt-4 flex items-baseline gap-3">
        <div className="text-[40px] leading-none tabular-nums" style={{ fontFamily: "var(--font-serif)", fontWeight: 600, color: meta.accent }}>{card.amount}</div>
        {card.round && <div className="text-[11px] font-semibold tracking-[0.18em] uppercase" style={{ color: "#6B645B", fontFamily: "var(--font-mono)" }}>{card.round}</div>}
      </div>
    );
  }

  if (card.category === "career" && card.comp_low && card.comp_high) {
    const cur = card.currency === "USD" ? "$" : card.currency === "GBP" ? "£" : card.currency === "EUR" ? "€" : "";
    const fmt = (n) => (n >= 1000 ? `${cur}${Math.round(n / 1000)}K` : `${cur}${n}`);
    return (
      <div className="mt-4">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-[10px] font-semibold tracking-[0.2em]" style={{ color: meta.accent, fontFamily: "var(--font-mono)" }}>TOTAL COMP</span>
          <span className="text-[13px] font-semibold tabular-nums" style={{ color: "#1A1614", fontFamily: "var(--font-mono)" }}>{fmt(card.comp_low)} – {fmt(card.comp_high)}</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.06)" }}>
          <div className="h-full rounded-full" style={{ width: "100%", background: `linear-gradient(90deg, ${meta.accent}40, ${meta.accent})` }} />
        </div>
      </div>
    );
  }

  if (card.category === "tool" && card.stars) {
    const d = card.stars_delta_7d;
    return (
      <div className="mt-4 flex items-baseline gap-3">
        <div className="text-[28px] leading-none tabular-nums" style={{ fontFamily: "var(--font-serif)", fontWeight: 600, color: meta.accent }}>
          {card.stars >= 1000 ? `${(card.stars / 1000).toFixed(1)}K` : card.stars} ★
        </div>
        {d != null && <span className="text-[11px] font-semibold tracking-wide" style={{ color: d > 0 ? "#3F6E5F" : "#6B645B", fontFamily: "var(--font-mono)" }}>{d > 0 ? `+${d}` : d}/wk</span>}
      </div>
    );
  }

  if (card.category === "research" && card.benchmark_name && card.delta_pts != null) {
    return (
      <div className="mt-4 flex items-baseline gap-3">
        <div className="text-[28px] leading-none tabular-nums" style={{ fontFamily: "var(--font-serif)", fontWeight: 600, color: meta.accent }}>
          {card.delta_pts > 0 ? "+" : ""}{card.delta_pts} pts
        </div>
        <span className="text-[11px] font-semibold tracking-[0.18em] uppercase" style={{ color: "#6B645B", fontFamily: "var(--font-mono)" }}>ON {card.benchmark_name}</span>
      </div>
    );
  }

  if (card.category === "deployment" && card.scale?.value) {
    return (
      <div className="mt-4 flex items-baseline gap-2">
        <div className="text-[28px] leading-none tabular-nums" style={{ fontFamily: "var(--font-serif)", fontWeight: 600, color: meta.accent }}>{card.scale.value}</div>
        <span className="text-[11px] font-semibold tracking-[0.18em] uppercase" style={{ color: "#6B645B", fontFamily: "var(--font-mono)" }}>{card.scale.metric}</span>
      </div>
    );
  }

  if (card.category === "insight" && card.stat_value) {
    return (
      <div className="mt-4">
        <div className="text-[40px] leading-none tabular-nums" style={{ fontFamily: "var(--font-serif)", fontWeight: 600, color: meta.accent }}>{card.stat_value}</div>
        {card.stat_label && <div className="mt-1 text-[12px]" style={{ color: "#57544E", fontFamily: "var(--font-serif)" }}>{card.stat_label}</div>}
      </div>
    );
  }

  return null;
}

/* ============================================================
   STORY CARD
   ============================================================ */
function StoryCard({ card, isTop, onSwipe, expanded, onToggleExpand }) {
  const meta = CATS[card.category] || CATS.insight;
  const Icon = meta.Icon;

  const x = useMotionValue(0), y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-12, 0, 12]);
  const tR = useTransform(x, [0, 140], [0, 0.55]);
  const tL = useTransform(x, [-140, 0], [0.55, 0]);
  const tU = useTransform(y, [-140, 0], [0.55, 0]);
  const tD = useTransform(y, [0, 140], [0, 0.55]);

  const handleDragEnd = (_, info) => {
    const { offset, velocity } = info;
    const ax = Math.abs(offset.x), ay = Math.abs(offset.y);
    if (ax > ay && (ax > 110 || Math.abs(velocity.x) > 480)) {
      onSwipe(offset.x > 0 ? "save" : "next");
    } else if (ay > ax && (ay > 110 || Math.abs(velocity.y) > 480)) {
      onSwipe(offset.y < 0 ? "share" : "decode");
    }
  };

  return (
    <motion.article
      className="absolute inset-0 touch-none select-none"
      style={{ x, y, rotate, zIndex: isTop ? 30 : 10 }}
      drag={isTop}
      dragElastic={0.55}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 16, opacity: isTop ? 1 : 0.7 }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 16, opacity: isTop ? 1 : 0.7 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[28px]" style={{
        background: meta.bg,
        boxShadow: "0 1px 0 rgba(0,0,0,0.04), 0 24px 60px -24px rgba(0,0,0,0.45)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}>
        {/* swipe tints */}
        <motion.div style={{ opacity: tR }} className="pointer-events-none absolute inset-0">
          <div className="h-full w-full" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(63,110,95,0.3) 100%)" }} />
          <div className="absolute top-6 left-6 px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-[0.18em] -rotate-6 ring-2 ring-white" style={{ background: "#3F6E5F", color: "white", fontFamily: "var(--font-mono)" }}>SAVE</div>
        </motion.div>
        <motion.div style={{ opacity: tL }} className="pointer-events-none absolute inset-0">
          <div className="h-full w-full" style={{ background: "linear-gradient(270deg, transparent 0%, rgba(107,100,91,0.25) 100%)" }} />
          <div className="absolute top-6 right-6 px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-[0.18em] rotate-6 ring-2 ring-white" style={{ background: "#57544E", color: "white", fontFamily: "var(--font-mono)" }}>NEXT</div>
        </motion.div>
        <motion.div style={{ opacity: tU }} className="pointer-events-none absolute inset-0">
          <div className="h-full w-full" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(61,90,110,0.3) 100%)" }} />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-[0.18em] ring-2 ring-white" style={{ background: "#3D5A6E", color: "white", fontFamily: "var(--font-mono)" }}>SHARE</div>
        </motion.div>
        <motion.div style={{ opacity: tD }} className="pointer-events-none absolute inset-0">
          <div className="h-full w-full" style={{ background: "linear-gradient(0deg, transparent 0%, rgba(107,100,91,0.25) 100%)" }} />
          <div className="absolute top-8 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-[0.18em] ring-2 ring-white" style={{ background: "#57544E", color: "white", fontFamily: "var(--font-mono)" }}>DECODE</div>
        </motion.div>

        <div className="relative h-full flex flex-col">
          <div className="flex items-center justify-between px-7 pt-7 pb-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <div className="flex items-center gap-2">
              <Icon size={14} style={{ color: meta.accent }} strokeWidth={1.8} />
              <span className="text-[10.5px] font-semibold tracking-[0.18em]" style={{ color: meta.accent, fontFamily: "var(--font-mono)" }}>{meta.label.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-3">
              {card.jurisdiction && <span className="text-[10.5px] tracking-[0.18em] font-medium" style={{ color: "#6B645B", fontFamily: "var(--font-mono)" }}>{card.jurisdiction.toUpperCase()}</span>}
              <span className="block h-2 w-2 rounded-full" style={{ background: SEV[card.severity] || SEV.low }} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-7 py-5">
            <h2 className="text-[26px] sm:text-[28px] leading-[1.15] tracking-[-0.012em]" style={{ fontFamily: "var(--font-serif)", fontWeight: 500, color: "#1A1614" }}>{card.headline}</h2>
            <p className="mt-4 text-[15px] leading-[1.6] tracking-[-0.005em]" style={{ color: "#3D3833", fontFamily: "var(--font-serif)" }}>{card.plain_english}</p>

            <MicroViz card={card} />

            <div className="mt-5 px-5 py-4 rounded-2xl" style={{ background: meta.chipBg, borderLeft: `2px solid ${meta.accent}` }}>
              <div className="text-[10px] font-semibold tracking-[0.2em] mb-1.5" style={{ color: meta.accent, fontFamily: "var(--font-mono)" }}>
                <Zap size={10} className="inline mr-1 -mt-px" /> WHY IT MATTERS
              </div>
              <p className="text-[14px] leading-[1.55]" style={{ color: "#2A2622" }}>{card.why_it_matters}</p>
            </div>

            <AnimatePresence>
              {expanded && card.jargon?.length > 0 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-5">
                  <div className="px-5 py-4 rounded-2xl" style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" }}>
                    <div className="text-[10px] font-semibold tracking-[0.2em] mb-3" style={{ color: "#6B645B", fontFamily: "var(--font-mono)" }}>JARGON DECODED</div>
                    <dl className="space-y-3">
                      {card.jargon.map((j, i) => (
                        <div key={i}>
                          <dt className="text-[13px] font-semibold" style={{ color: "#1A1614" }}>{j.term}</dt>
                          <dd className="text-[12.5px] mt-0.5 leading-[1.5]" style={{ color: "#52504C" }}>{j.def}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="px-7 py-4 flex items-center justify-between" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <a href={card.source?.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
              className="text-[11px] tracking-wider inline-flex items-center gap-1.5 hover:underline"
              style={{ color: "#52504C", fontFamily: "var(--font-mono)" }}>
              {card.source?.name}<ExternalLink size={10} />
            </a>
            {card.jargon?.length > 0 && (
              <button onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
                className="text-[11px] tracking-wider inline-flex items-center gap-1 font-medium"
                style={{ color: meta.accent, fontFamily: "var(--font-mono)" }}>
                {expanded ? "HIDE" : "JARGON"}
                <ChevronDown size={12} className={expanded ? "rotate-180 transition" : "transition"} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ============================================================
   SIGNUP GATE
   ============================================================ */
function SignupGateCard({ supabase, onClose }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  const signInGoogle = async () => {
    setState("loading");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
    if (error) { setError(error.message); setState("error"); }
  };

  const signInEmail = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email"); setState("error"); return;
    }
    setState("loading"); setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    });
    if (error) { setError(error.message); setState("error"); }
    else setState("magic-sent");
  };

  return (
    <div className="absolute inset-0 rounded-[28px] overflow-hidden flex flex-col" style={{
      background: "#F8F5F0", border: "1px solid rgba(0,0,0,0.06)",
      boxShadow: "0 24px 60px -24px rgba(0,0,0,0.45)",
    }}>
      <div className="px-7 pt-8 pb-3 flex items-center gap-2">
        <Sparkles size={14} style={{ color: "#8B6F1F" }} />
        <span className="text-[10.5px] font-semibold tracking-[0.2em]" style={{ color: "#8B6F1F", fontFamily: "var(--font-mono)" }}>KEEP GOING</span>
      </div>

      <div className="px-7 flex-1 flex flex-col">
        <h2 className="text-[30px] leading-[1.1] tracking-[-0.02em]" style={{ fontFamily: "var(--font-serif)", fontWeight: 500, color: "#1A1614" }}>Sign in to keep reading.</h2>
        <p className="mt-3 text-[15px] leading-[1.55]" style={{ color: "#57544E", fontFamily: "var(--font-serif)" }}>
          Free. No newsletters. Saves sync across all your devices — phone, laptop, work browser.
        </p>

        {state === "magic-sent" ? (
          <div className="mt-6 px-5 py-5 rounded-2xl" style={{ background: "#F2F6F4", border: "1px solid rgba(63,110,95,0.2)" }}>
            <Check size={20} style={{ color: "#3F6E5F" }} strokeWidth={2.5} />
            <p className="mt-2 text-[15px]" style={{ color: "#1A1614", fontFamily: "var(--font-serif)" }}>Check your inbox. Magic link expires in 1 hour.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <button onClick={signInGoogle} disabled={state === "loading"}
              className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-60"
              style={{ background: "white", border: "1px solid rgba(0,0,0,0.12)", color: "#1A1614" }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              <span className="text-[14px] font-semibold" style={{ fontFamily: "var(--font-sans)" }}>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.1)" }} />
              <span className="text-[10px] tracking-[0.2em]" style={{ color: "#9C958A", fontFamily: "var(--font-mono)" }}>OR</span>
              <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.1)" }} />
            </div>

            <input type="email" inputMode="email" autoComplete="email" value={email}
              onChange={(e) => { setEmail(e.target.value); setState("idle"); setError(""); }}
              placeholder="you@bank.com"
              className="w-full px-4 py-3.5 rounded-2xl text-[15px] focus:outline-none"
              style={{ background: "white", border: error ? "1px solid #C85A4A" : "1px solid rgba(0,0,0,0.12)", color: "#1A1614" }} />
            <button onClick={signInEmail} disabled={state === "loading"}
              className="w-full py-3.5 rounded-2xl text-[14px] font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: "#1A1614", color: "#F8F5F0", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
              {state === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
              MAGIC LINK
            </button>
            {error && <p className="text-[12px]" style={{ color: "#C85A4A" }}>{error}</p>}
          </div>
        )}

        <div className="mt-auto pb-7 pt-6 flex items-center justify-between">
          <p className="text-[10.5px] tracking-[0.16em]" style={{ color: "#9C958A", fontFamily: "var(--font-mono)" }}>
            <a href="/privacy" className="underline">PRIVACY</a> · <a href="/terms" className="underline">TERMS</a>
          </p>
          <button onClick={onClose} className="text-[10.5px] tracking-[0.16em]" style={{ color: "#9C958A", fontFamily: "var(--font-mono)" }}>SKIP FOR NOW →</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   NEWSLETTER CARD (position 8)
   ============================================================ */
function NewsletterCard() {
  return (
    <div className="absolute inset-0 rounded-[28px] overflow-hidden flex flex-col px-7 py-8" style={{
      background: "#F5F4F0", border: "1px solid rgba(0,0,0,0.06)",
      boxShadow: "0 24px 60px -24px rgba(0,0,0,0.45)",
    }}>
      <div className="flex items-center gap-2">
        <Mail size={14} style={{ color: "#5C544A" }} />
        <span className="text-[10.5px] font-semibold tracking-[0.2em]" style={{ color: "#5C544A", fontFamily: "var(--font-mono)" }}>WEEKLY DEEP DIVE</span>
      </div>
      <h2 className="mt-3 text-[28px] leading-[1.15] tracking-[-0.018em]" style={{ fontFamily: "var(--font-serif)", fontWeight: 500, color: "#1A1614" }}>
        The pulse, daily. The full picture, every Monday.
      </h2>
      <p className="mt-3 text-[14.5px] leading-[1.55]" style={{ color: "#52504C", fontFamily: "var(--font-serif)" }}>
        AITechHive's weekly newsletter goes deep: multi-week patterns, named-source interviews, and analysis daily cards can't carry. Free.
      </p>
      <a href="https://newsletter.aitechhive.com" target="_blank" rel="noreferrer"
        className="mt-6 w-full py-3.5 rounded-2xl text-[14px] font-semibold flex items-center justify-center gap-2"
        style={{ background: "#1A1614", color: "#F8F5F0", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
        READ THIS WEEK →
      </a>
      <p className="mt-auto pt-6 text-[10.5px] tracking-[0.16em] text-center" style={{ color: "#9C958A", fontFamily: "var(--font-mono)" }}>
        newsletter.aitechhive.com
      </p>
    </div>
  );
}

/* ============================================================
   EMPTY STATE
   ============================================================ */
function EmptyState({ stats, onReshuffle, onOpenArchive }) {
  return (
    <div className="absolute inset-0 rounded-[28px] p-7 flex flex-col" style={{
      background: "#F8F5F0", border: "1px solid rgba(0,0,0,0.06)",
      boxShadow: "0 24px 60px -24px rgba(0,0,0,0.45)",
    }}>
      <div className="text-[10.5px] font-semibold tracking-[0.2em] flex items-center gap-2" style={{ color: "#6B645B", fontFamily: "var(--font-mono)" }}>
        <Inbox size={13} /> END OF EDITION
      </div>
      <h3 className="mt-4 text-[32px] leading-[1.08] tracking-[-0.018em]" style={{ fontFamily: "var(--font-serif)", fontWeight: 500, color: "#1A1614" }}>
        That's today's signal.
      </h3>
      <p className="mt-3 text-[14.5px] leading-[1.55]" style={{ color: "#52504C", fontFamily: "var(--font-serif)" }}>
        Six refreshes daily. The archive holds the last 80 days.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-2.5">
        <Stat label="SAVED" value={stats.saved} color="#3F6E5F" />
        <Stat label="NEXT" value={stats.next} color="#57544E" />
        <Stat label="SHARED" value={stats.shared} color="#3D5A6E" />
      </div>
      <div className="mt-auto space-y-2.5">
        <button onClick={onOpenArchive} className="w-full py-3.5 rounded-2xl text-[13px] font-semibold tracking-[0.04em]"
          style={{ background: "#1A1614", color: "#F8F5F0", fontFamily: "var(--font-mono)" }}>OPEN ARCHIVE</button>
        <button onClick={onReshuffle} className="w-full py-3 rounded-2xl text-[12px] tracking-[0.04em]"
          style={{ background: "transparent", color: "#52504C", border: "1px solid rgba(0,0,0,0.12)", fontFamily: "var(--font-mono)" }}>REPLAY DECK</button>
      </div>
    </div>
  );
}
function Stat({ label, value, color }) {
  return (
    <div className="rounded-2xl px-3 py-3 text-center" style={{ background: "rgba(0,0,0,0.03)" }}>
      <div className="text-[24px] font-medium leading-none tabular-nums" style={{ color, fontFamily: "var(--font-serif)" }}>{value}</div>
      <div className="mt-1.5 text-[9px] font-semibold tracking-[0.2em]" style={{ color: "#6B645B", fontFamily: "var(--font-mono)" }}>{label}</div>
    </div>
  );
}

/* ============================================================
   SAVED SHEET
   ============================================================ */
function SavedSheet({ open, onClose, items, onClear }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40" style={{ background: "rgba(10,9,8,0.6)", backdropFilter: "blur(6px)" }} />
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            className="fixed left-0 right-0 bottom-0 z-50 rounded-t-[28px] pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] max-h-[85vh] overflow-hidden flex flex-col"
            style={{ background: "rgba(248,245,240,0.96)", backdropFilter: "blur(40px) saturate(180%)", boxShadow: "0 -20px 60px -10px rgba(0,0,0,0.5)", border: "1px solid rgba(0,0,0,0.08)", maxWidth: 520, margin: "0 auto" }}>
            <div aria-hidden className="mx-auto w-10 h-1 rounded-full mb-4" style={{ background: "rgba(0,0,0,0.15)" }} />
            <div className="px-6 flex justify-between items-end pb-3">
              <div>
                <div className="text-[10.5px] font-semibold tracking-[0.2em]" style={{ color: "#6B645B", fontFamily: "var(--font-mono)" }}>SAVED · {items.length}</div>
                <h3 className="mt-1 text-[24px] tracking-[-0.015em]" style={{ fontFamily: "var(--font-serif)", fontWeight: 500, color: "#1A1614" }}>Your reading list</h3>
              </div>
              {items.length > 0 && <button onClick={onClear} className="text-[11px] tracking-wider" style={{ color: "#C85A4A", fontFamily: "var(--font-mono)" }}>CLEAR</button>}
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-2.5">
              {items.length === 0 && <p className="text-center py-12 text-[14px]" style={{ color: "#6B645B", fontFamily: "var(--font-serif)" }}>Swipe right to save stories. They'll sync across your devices.</p>}
              {items.map((c) => {
                const meta = CATS[c.category] || CATS.insight;
                return (
                  <a key={c.id} href={c.source?.url} target="_blank" rel="noreferrer" className="block p-4 rounded-2xl" style={{ background: meta.bg, border: "1px solid rgba(0,0,0,0.06)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <meta.Icon size={12} style={{ color: meta.accent }} />
                      <span className="text-[9.5px] font-semibold tracking-[0.2em]" style={{ color: meta.accent, fontFamily: "var(--font-mono)" }}>{meta.label.toUpperCase()}</span>
                      <span className="text-[9.5px] tracking-[0.18em] ml-auto" style={{ color: "#9C958A", fontFamily: "var(--font-mono)" }}>{c.jurisdiction?.toUpperCase()}</span>
                    </div>
                    <p className="text-[15px] leading-[1.3] tracking-[-0.008em]" style={{ fontFamily: "var(--font-serif)", fontWeight: 500, color: "#1A1614" }}>{c.headline}</p>
                  </a>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   ARCHIVE SHEET
   ============================================================ */
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
      const aS = savedIds.has(a.id) ? 1 : 0;
      const bS = savedIds.has(b.id) ? 1 : 0;
      if (aS !== bS) return bS - aS;
      return new Date(b.published_at || 0) - new Date(a.published_at || 0);
    });
  }, [allCards, filter, search, savedIds]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40" style={{ background: "rgba(10,9,8,0.6)", backdropFilter: "blur(6px)" }} />
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            className="fixed left-0 right-0 bottom-0 z-50 rounded-t-[28px] pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] max-h-[85vh] overflow-hidden flex flex-col"
            style={{ background: "rgba(248,245,240,0.96)", backdropFilter: "blur(40px) saturate(180%)", boxShadow: "0 -20px 60px -10px rgba(0,0,0,0.5)", border: "1px solid rgba(0,0,0,0.08)", maxWidth: 520, margin: "0 auto" }}>
            <div aria-hidden className="mx-auto w-10 h-1 rounded-full mb-4" style={{ background: "rgba(0,0,0,0.15)" }} />
            <div className="px-6 pb-3">
              <div className="text-[10.5px] font-semibold tracking-[0.2em]" style={{ color: "#6B645B", fontFamily: "var(--font-mono)" }}>ARCHIVE · {allCards.length}</div>
              <h3 className="mt-1 text-[24px] tracking-[-0.015em]" style={{ fontFamily: "var(--font-serif)", fontWeight: 500, color: "#1A1614" }}>Last 80 days</h3>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search headlines..."
                className="mt-3 w-full px-4 py-2.5 rounded-xl text-[14px] focus:outline-none"
                style={{ background: "white", border: "1px solid rgba(0,0,0,0.1)", color: "#1A1614" }} />
              <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {["all", ...Object.keys(CATS)].map((k) => (
                  <button key={k} onClick={() => setFilter(k)}
                    className="shrink-0 px-3 py-1 rounded-full text-[10.5px] font-semibold tracking-[0.12em] uppercase"
                    style={{
                      background: filter === k ? "#1A1614" : "white",
                      color: filter === k ? "#F8F5F0" : "#52504C",
                      border: "1px solid rgba(0,0,0,0.1)",
                      fontFamily: "var(--font-mono)",
                    }}>
                    {k === "all" ? "All" : CATS[k].label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-2">
              {filtered.length === 0 && <p className="text-center py-12 text-[14px]" style={{ color: "#6B645B", fontFamily: "var(--font-serif)" }}>No matches.</p>}
              {filtered.map((c) => {
                const meta = CATS[c.category] || CATS.insight;
                const saved = savedIds.has(c.id);
                return (
                  <a key={c.id} href={c.source?.url} target="_blank" rel="noreferrer" className="block p-3 rounded-2xl flex items-start gap-3" style={{ background: meta.bg, border: "1px solid rgba(0,0,0,0.06)" }}>
                    <meta.Icon size={14} className="mt-1 shrink-0" style={{ color: meta.accent }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-semibold tracking-[0.2em] uppercase" style={{ color: meta.accent, fontFamily: "var(--font-mono)" }}>{meta.label}</span>
                        {saved && <Bookmark size={10} fill={meta.accent} style={{ color: meta.accent }} />}
                      </div>
                      <p className="text-[14px] leading-[1.3]" style={{ fontFamily: "var(--font-serif)", fontWeight: 500, color: "#1A1614" }}>{c.headline}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   SHARE MODAL — 1080x1080 PNG export
   ============================================================ */
function ShareModal({ open, onClose, card }) {
  const cardRef = useRef(null);
  const [generating, setGenerating] = useState(false);

  if (!card) return null;
  const meta = CATS[card.category] || CATS.insight;
  const Icon = meta.Icon;

  const handleShare = async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, { width: 1080, height: 1080, pixelRatio: 2, cacheBust: true });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `aitechhive-${card.id}.png`, { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: card.headline, url: `${window.location.origin}/c/${card.id}` });
      } else {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `aitechhive-${card.id}.png`;
        a.click();
      }
    } catch (e) {
      console.error("Share failed", e);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    try { await navigator.clipboard.writeText(`${window.location.origin}/c/${card.id}`); } catch {}
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40" style={{ background: "rgba(10,9,8,0.75)", backdropFilter: "blur(10px)" }} />
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            className="fixed left-0 right-0 bottom-0 z-50 rounded-t-[28px] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            style={{ background: "rgba(248,245,240,0.96)", backdropFilter: "blur(40px) saturate(180%)", border: "1px solid rgba(0,0,0,0.08)", maxWidth: 520, margin: "0 auto" }}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[20px] tracking-[-0.015em]" style={{ fontFamily: "var(--font-serif)", fontWeight: 500, color: "#1A1614" }}>Share this card</h3>
              <button onClick={onClose} className="p-1.5 rounded-full" style={{ color: "#6B645B" }}><X size={18} /></button>
            </div>

            <div className="relative w-full" style={{ aspectRatio: "1/1", maxWidth: 340, margin: "0 auto" }}>
              <div ref={cardRef} className="absolute inset-0 rounded-3xl overflow-hidden" style={{ background: meta.bg, border: "1px solid rgba(0,0,0,0.08)" }}>
                <div className="h-full flex flex-col p-7">
                  <div className="flex items-center gap-2">
                    <Icon size={16} style={{ color: meta.accent }} />
                    <span className="text-[11px] font-semibold tracking-[0.2em]" style={{ color: meta.accent, fontFamily: "var(--font-mono)" }}>
                      {meta.label.toUpperCase()} · {card.jurisdiction?.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="mt-4 text-[22px] leading-[1.15] tracking-[-0.01em]" style={{ fontFamily: "var(--font-serif)", fontWeight: 500, color: "#1A1614" }}>{card.headline}</h4>
                  <p className="mt-3 text-[13px] leading-[1.5]" style={{ color: "#3D3833", fontFamily: "var(--font-serif)" }}>
                    {card.plain_english?.slice(0, 180)}{card.plain_english?.length > 180 ? "…" : ""}
                  </p>
                  <div className="mt-3 px-3 py-2 rounded-xl" style={{ background: meta.chipBg, borderLeft: `2px solid ${meta.accent}` }}>
                    <div className="text-[8.5px] font-semibold tracking-[0.2em] mb-1" style={{ color: meta.accent, fontFamily: "var(--font-mono)" }}>WHY IT MATTERS</div>
                    <p className="text-[11px] leading-[1.4]" style={{ color: "#2A2622" }}>{card.why_it_matters?.slice(0, 120)}{card.why_it_matters?.length > 120 ? "…" : ""}</p>
                  </div>
                  <div className="mt-auto flex items-end justify-between pt-3">
                    <div className="flex items-center gap-1.5">
                      <div className="h-6 w-6 rounded grid place-items-center" style={{ background: "#1A1614" }}>
                        <span style={{ fontFamily: "var(--font-serif)", fontWeight: 700, color: "#F8F5F0", fontSize: 12 }}>A</span>
                      </div>
                      <span className="text-[10px] font-semibold tracking-[0.14em]" style={{ color: "#1A1614", fontFamily: "var(--font-mono)" }}>AITechHive</span>
                    </div>
                    <span className="text-[9px] tracking-[0.14em]" style={{ color: "#6B645B", fontFamily: "var(--font-mono)" }}>aitechhive.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button onClick={handleShare} disabled={generating}
                className="py-3 rounded-2xl text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: "#1A1614", color: "#F8F5F0", fontFamily: "var(--font-mono)" }}>
                {generating ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />}
                {generating ? "GENERATING" : "SHARE IMAGE"}
              </button>
              <button onClick={handleCopyLink}
                className="py-3 rounded-2xl text-[13px] font-semibold"
                style={{ background: "white", color: "#1A1614", border: "1px solid rgba(0,0,0,0.12)", fontFamily: "var(--font-mono)" }}>
                COPY LINK
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   ROOT
   ============================================================ */
export default function PageClient({ initialCards }) {
  const supabase = useMemo(
    () => createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
    []
  );

  const [allCards] = useState(initialCards || []);
  const [user, setUser] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [dismissedIds, setDismissedIds] = useState(new Set());
  const [savedCards, setSavedCards] = useState([]);
  const [showGate, setShowGate] = useState(false);
  const [skipGate, setSkipGate] = useState(false);
  const [stats, setStats] = useState({ saved: 0, next: 0, shared: 0 });
  const [expandedId, setExpandedId] = useState(null);
  const [savedOpen, setSavedOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [shareCard, setShareCard] = useState(null);
  const [deckPos, setDeckPos] = useState(0);

  // Auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user || null));
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  // Load saves + dismissed when authed
  useEffect(() => {
    if (!user) {
      setSavedIds(new Set()); setDismissedIds(new Set()); setSavedCards([]); return;
    }
    supabase.from("saves").select("card_id").then(({ data }) => {
      const ids = new Set((data || []).map((r) => r.card_id));
      setSavedIds(ids);
      setSavedCards(allCards.filter((c) => ids.has(c.id)));
    });
    supabase.from("dismissed").select("card_id").then(({ data }) => {
      setDismissedIds(new Set((data || []).map((r) => r.card_id)));
    });
  }, [user, supabase, allCards]);

  // Deck = ordered + inject gate at position 4 + newsletter at 8
  const deck = useMemo(() => {
    const ordered = orderDeck(allCards, dismissedIds);
    const result = [];
    ordered.forEach((c, i) => {
      result.push(c);
      if (i === 2 && !user && !skipGate) result.push({ id: "__GATE__", _type: "gate" });
      if (i === 6) result.push({ id: "__NEWSLETTER__", _type: "newsletter" });
    });
    return result;
  }, [allCards, dismissedIds, user, skipGate]);

  const activeDeck = deck.slice(deckPos);
  const topCard = activeDeck[0];

  const doSwipe = useCallback(async (action) => {
    if (!topCard) return;
    if (topCard._type === "gate" || topCard._type === "newsletter") {
      if (action !== "decode") setDeckPos((p) => p + 1);
      return;
    }
    if (action === "decode") {
      setExpandedId((id) => (id === topCard.id ? null : topCard.id));
      return;
    }
    if (action === "share") {
      setShareCard(topCard);
      setStats((s) => ({ ...s, shared: s.shared + 1 }));
      if (user) supabase.from("shares").insert({ user_id: user.id, card_id: topCard.id });
      return;
    }
    if (action === "save") {
      setSavedIds((s) => new Set([...s, topCard.id]));
      setSavedCards((s) => [topCard, ...s.filter((c) => c.id !== topCard.id)]);
      setStats((s) => ({ ...s, saved: s.saved + 1 }));
      if (user) supabase.from("saves").upsert({ user_id: user.id, card_id: topCard.id });
    } else if (action === "next") {
      setDismissedIds((s) => new Set([...s, topCard.id]));
      setStats((s) => ({ ...s, next: s.next + 1 }));
      if (user) supabase.from("dismissed").upsert({ user_id: user.id, card_id: topCard.id });
    }
    setExpandedId(null);
    setDeckPos((p) => p + 1);
  }, [topCard, user, supabase]);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (savedOpen || archiveOpen || shareCard) return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const map = { ArrowRight: "save", ArrowLeft: "next", ArrowUp: "share", ArrowDown: "decode" };
      if (map[e.key]) { e.preventDefault(); doSwipe(map[e.key]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doSwipe, savedOpen, archiveOpen, shareCard]);

  const totalSwipeable = deck.filter((c) => !c._type).length;
  const swipedCount = deckPos > 0 ? Math.min(deckPos, totalSwipeable) : 0;

  return (
    <main className="relative min-h-screen overflow-hidden" style={{
      background: "#0E0D0C", color: "#F5F1E8",
      fontFamily: "var(--font-sans)", paddingTop: "env(safe-area-inset-top)",
    }}>
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: "radial-gradient(ellipse 800px 600px at 50% 0%, rgba(200,169,100,0.08) 0%, transparent 60%), radial-gradient(ellipse 600px 800px at 100% 100%, rgba(63,110,95,0.05) 0%, transparent 60%)",
      }} />

      {/* MASTHEAD */}
      <header className="relative z-20 px-5 pt-5 pb-3">
        <div className="flex items-center justify-between text-[10px] tracking-[0.22em] font-medium pb-3" style={{ color: "#8A857C", fontFamily: "var(--font-mono)", borderBottom: "0.5px solid rgba(245,241,232,0.12)" }}>
          <span>{fmtDate()}</span>
          <span>{fmtIssue()}</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="text-[28px] tracking-[-0.025em] leading-none" style={{ fontFamily: "var(--font-serif)", fontWeight: 600, color: "#F5F1E8" }}>AITechHive</h1>
            <p className="mt-0.5 text-[10px] tracking-[0.2em] font-semibold" style={{ color: "#C8A964", fontFamily: "var(--font-mono)" }}>BFSI · ENTERPRISE AI · DAILY</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setArchiveOpen(true)} aria-label="Archive" className="h-10 w-10 rounded-full grid place-items-center" style={{ background: "rgba(245,241,232,0.06)", backdropFilter: "blur(20px)", border: "1px solid rgba(245,241,232,0.12)", color: "#F5F1E8" }}>
              <Archive size={16} />
            </button>
            <button onClick={() => setSavedOpen(true)} aria-label="Saved" className="relative h-10 w-10 rounded-full grid place-items-center" style={{ background: "rgba(245,241,232,0.06)", backdropFilter: "blur(20px)", border: "1px solid rgba(245,241,232,0.12)", color: "#F5F1E8" }}>
              <Bookmark size={16} />
              {savedIds.size > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold grid place-items-center tabular-nums" style={{ background: "#C8A964", color: "#0E0D0C", fontFamily: "var(--font-mono)" }}>{savedIds.size}</span>
              )}
            </button>
            {!user && (
              <button onClick={() => setShowGate(true)} className="h-10 px-4 rounded-full text-[11px] font-semibold tracking-[0.15em] flex items-center gap-1.5" style={{ background: "#F5F1E8", color: "#0E0D0C", fontFamily: "var(--font-mono)" }}>
                <Mail size={13} /> SIGN IN
              </button>
            )}
          </div>
        </div>

        {totalSwipeable > 0 && (
          <div className="mt-5 flex items-center gap-1.5">
            {Array.from({ length: totalSwipeable }).map((_, i) => (
              <div key={i} className="h-[3px] flex-1 rounded-full transition-all" style={{ background: i < swipedCount ? "#C8A964" : "rgba(245,241,232,0.15)" }} />
            ))}
            <span className="ml-2 text-[10px] tracking-[0.18em] tabular-nums" style={{ color: "#8A857C", fontFamily: "var(--font-mono)" }}>{swipedCount}/{totalSwipeable}</span>
          </div>
        )}
      </header>

      {/* CARD STACK */}
      <section className="relative z-10 px-5 mt-3">
        <div className="relative mx-auto w-full" style={{ maxWidth: 420, aspectRatio: "5/7" }}>
          {activeDeck.length === 0 ? (
            <EmptyState stats={stats} onReshuffle={() => { setDeckPos(0); setStats({ saved: 0, next: 0, shared: 0 }); }} onOpenArchive={() => setArchiveOpen(true)} />
          ) : (
            activeDeck.slice(0, 3).reverse().map((c, idx, arr) => {
              const isTop = idx === arr.length - 1;
              if (c._type === "gate") return isTop ? <SignupGateCard key="gate" supabase={supabase} onClose={() => { setSkipGate(true); setDeckPos((p) => p + 1); }} /> : null;
              if (c._type === "newsletter") return isTop ? <NewsletterCard key="nl" /> : null;
              return (
                <StoryCard key={c.id} card={c} isTop={isTop}
                  expanded={isTop && expandedId === c.id}
                  onToggleExpand={() => setExpandedId((id) => (id === c.id ? null : c.id))}
                  onSwipe={doSwipe} />
              );
            })
          )}
        </div>
      </section>

      {/* ACTION BAR */}
      <div className="fixed left-0 right-0 z-20" style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}>
        <div className="mx-auto px-5" style={{ maxWidth: 520 }}>
          <div className="flex items-center justify-around p-2 rounded-full" style={{
            background: "rgba(20,18,16,0.6)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid rgba(245,241,232,0.10)",
            boxShadow: "0 20px 50px -20px rgba(0,0,0,0.6)",
          }}>
            <ActionBtn icon={ArrowLeft} label="Next" color="#9C958A" onClick={() => doSwipe("next")} disabled={!topCard} />
            <ActionBtn icon={ChevronDown} label="Decode" color="#9C958A" onClick={() => doSwipe("decode")} disabled={!topCard} />
            <ActionBtn icon={ArrowUp} label="Share" color="#8B9DC3" onClick={() => doSwipe("share")} disabled={!topCard} />
            <ActionBtn icon={Bookmark} label="Save" color="#7BA098" onClick={() => doSwipe("save")} disabled={!topCard} primary />
          </div>
        </div>
      </div>

      <div style={{ height: 110 }} />

      {/* Footer */}
      <footer className="px-5 pb-32 pt-12 text-center">
        <a href="https://newsletter.aitechhive.com" target="_blank" rel="noreferrer" className="text-[11px] tracking-[0.18em]" style={{ color: "#8A857C", fontFamily: "var(--font-mono)" }}>
          WEEKLY DEEP DIVE → newsletter.aitechhive.com
        </a>
        <div className="mt-3 flex items-center justify-center gap-3 text-[10px] tracking-[0.18em]" style={{ color: "#6B645B", fontFamily: "var(--font-mono)" }}>
          <a href="/privacy" className="hover:opacity-80">PRIVACY</a>
          <span>·</span>
          <a href="/terms" className="hover:opacity-80">TERMS</a>
          <span>·</span>
          <a href="mailto:hello@aitechhive.com" className="hover:opacity-80">CONTACT</a>
          <span>·</span>
          <a href="mailto:hello@aitechhive.com?subject=Bug%20report" className="hover:opacity-80">REPORT ISSUE</a>
        </div>
      </footer>

      <SavedSheet open={savedOpen} onClose={() => setSavedOpen(false)} items={savedCards} onClear={async () => {
        if (user) await supabase.from("saves").delete().eq("user_id", user.id);
        setSavedIds(new Set());
        setSavedCards([]);
      }} />
      <ArchiveSheet open={archiveOpen} onClose={() => setArchiveOpen(false)} allCards={allCards} savedIds={savedIds} />
      <ShareModal open={!!shareCard} onClose={() => setShareCard(null)} card={shareCard} />

      {showGate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(10,9,8,0.6)", backdropFilter: "blur(10px)" }} onClick={() => setShowGate(false)}>
          <div className="w-full max-w-[420px] aspect-[5/7] relative" onClick={(e) => e.stopPropagation()}>
            <SignupGateCard supabase={supabase} onClose={() => setShowGate(false)} />
          </div>
        </div>
      )}
    </main>
  );
}

function ActionBtn({ icon: Icon, label, color, onClick, disabled, primary }) {
  return (
    <button onClick={onClick} disabled={disabled} aria-label={label}
      className="flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-full transition active:scale-90 disabled:opacity-30"
      style={{ background: primary ? color : "transparent", color: primary ? "#0E0D0C" : color, minWidth: 58 }}>
      <Icon size={18} strokeWidth={2.4} />
      <span className="text-[8.5px] font-semibold tracking-[0.15em]" style={{ fontFamily: "var(--font-mono)" }}>{label.toUpperCase()}</span>
    </button>
  );
}

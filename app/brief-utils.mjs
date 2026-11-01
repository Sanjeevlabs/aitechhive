export const TOPICS = {
  trending: "Trending",
  frontier: "Frontier AI",
  deployment: "Banking AI",
  regulation: "Regulation",
  tool: "Tools",
  research: "Research",
  vendor: "Funding & vendors",
  learner: "Learn",
  insight: "Insights",
  shift: "Careers",
  career: "Careers",
};
export function timestamp(card) {
  const value = Date.parse(card.published_at || card.source?.date || "");
  return Number.isFinite(value) ? value : 0;
}
export function prepareCards(cards) {
  const seen = new Set();
  return (Array.isArray(cards) ? cards : [])
    .filter((c) => {
      if (!c?.id || !c.headline || seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    })
    .sort((a, b) => timestamp(b) - timestamp(a));
}
export function filterCards(
  cards,
  { topic = "all", query = "", savedOnly = false, saved = new Set() } = {},
) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return cards.filter(
    (c) =>
      (topic === "all" ||
        c.category === topic ||
        (topic === "shift" && c.category === "career")) &&
      (!savedOnly || saved.has(c.id)) &&
      terms.every((term) =>
        [
          c.headline,
          c.plain_english,
          c.why_it_matters,
          c.source?.name,
          TOPICS[c.category],
          c.jurisdiction,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term),
      ),
  );
}
export function sourceName(card) {
  return card.source?.name?.split(" · ")[0] || "Original source";
}
export function safeSource(card) {
  try {
    const url = new URL(card.source?.url);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
export function dateLabel(card, long = false) {
  return timestamp(card)
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: long ? "long" : "short",
        year: long ? "numeric" : undefined,
        timeZone: "Asia/Kolkata",
      }).format(timestamp(card))
    : "Undated";
}
export function readingTime(card) {
  return Math.max(
    1,
    Math.ceil(
      [card.plain_english, card.why_it_matters]
        .filter(Boolean)
        .join(" ")
        .split(/\s+/).length / 200,
    ),
  );
}

// A finite edition favors topic diversity, then fills from the newest stories.
export function selectEdition(cards, maximum = 12) {
  const sorted = prepareCards(cards);
  const recent = sorted.filter(
    (c) => timestamp(c) >= timestamp(sorted[0] || {}) - 24 * 3600 * 1000,
  );
  const selected = [],
    categories = new Set();
  for (const c of recent) {
    if (!categories.has(c.category)) {
      selected.push(c);
      categories.add(c.category);
    }
    if (selected.length >= maximum) return selected;
  }
  for (const c of recent) {
    if (!selected.some((s) => s.id === c.id)) selected.push(c);
    if (selected.length >= maximum) break;
  }
  return selected;
}

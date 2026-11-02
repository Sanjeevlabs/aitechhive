import assert from "node:assert/strict";
import test from "node:test";
import {
  prepareCards,
  filterCards,
  safeSource,
  timestamp,
} from "../app/brief-utils.mjs";

const rows = [
  {
    id: "old",
    headline: "Older AI news",
    category: "regulation",
    published_at: "2026-10-01",
    source: { url: "javascript:alert(1)" },
  },
  {
    id: "new",
    headline: "Banking agents arrive",
    plain_english: "Oracle deployment",
    category: "deployment",
    published_at: "2026-11-01",
    source: { name: "Reuters", url: "https://example.com/story" },
  },
  { id: "new", headline: "Duplicate" },
  { id: "job", headline: "AI job", category: "career" },
  null,
  { id: "invalid" },
];
test("archive keeps valid unique stories, newest first, without mutating input", () => {
  const cards = prepareCards(rows);
  assert.equal(cards.length, 3);
  assert.equal(cards[0].id, "new");
  assert.equal(rows[0].id, "old");
  assert.deepEqual(prepareCards(null), []);
});
test("search combines terms across fields and respects topics and saved collections", () => {
  const cards = prepareCards(rows);
  assert.deepEqual(
    filterCards(cards, { query: " BANKING   Oracle " }).map((c) => c.id),
    ["new"],
  );
  assert.deepEqual(
    filterCards(cards, { query: "Reuters", topic: "deployment" }).map(
      (c) => c.id,
    ),
    ["new"],
  );
  assert.equal(
    filterCards(cards, { query: "Reuters", topic: "regulation" }).length,
    0,
  );
  assert.equal(
    filterCards(cards, { savedOnly: true, saved: new Set(["old"]) })[0].id,
    "old",
  );
  assert.equal(filterCards(cards, { topic: "shift" })[0].id, "job");
  assert.equal(filterCards(cards, { query: "absent" }).length, 0);
});
test("source links reject executable protocols and malformed URLs", () => {
  assert.equal(safeSource(rows[0]), null);
  assert.equal(safeSource(rows[1]), "https://example.com/story");
  assert.equal(safeSource({ source: { url: "not a URL" } }), null);
  assert.equal(safeSource({}), null);
});
test("invalid dates do not corrupt sorting", () => {
  assert.equal(timestamp({ published_at: "bad" }), 0);
  assert.equal(timestamp({}), 0);
});

test("editions are bounded, diverse and exclude old archive content", async () => {
  const { selectEdition } = await import("../app/brief-utils.mjs");
  const rows = Array.from({ length: 30 }, (_, i) => ({
    id: String(i),
    headline: `Story ${i}`,
    category: i < 20 ? "tool" : "research",
    published_at: new Date(Date.UTC(2026, 10, 2, 12) - i * 60000).toISOString(),
  }));
  rows.push({
    id: "stale",
    headline: "Old",
    category: "regulation",
    published_at: "2020-01-01",
  });
  const edition = selectEdition(rows);
  assert.equal(edition.length, 12);
  assert.equal(new Set(edition.map((c) => c.id)).size, 12);
  assert.ok(edition.some((c) => c.category === "research"));
  assert.ok(!edition.some((c) => c.id === "stale"));
  assert.deepEqual(selectEdition([]), []);
});

test("newsletter host rewrites preserve existing article URLs and main site routing", async () => {
  const { newsletterRoute } = await import("../lib/newsletter-routing.mjs");
  assert.equal(newsletterRoute("aitechhive.com", "/"), null);
  assert.equal(newsletterRoute("preview.vercel.app", "/journal"), null);
  assert.deepEqual(newsletterRoute("newsletter.aitechhive.com", "/"), {
    kind: "rewrite",
    path: "/journal",
  });
  assert.deepEqual(
    newsletterRoute("newsletter.aitechhive.com", "/p/old-slug"),
    { kind: "rewrite", path: "/journal/p/old-slug" },
  );
  assert.deepEqual(
    newsletterRoute("newsletter.aitechhive.com", "/journal/p/old-slug"),
    { kind: "redirect", path: "/p/old-slug" },
  );
  assert.equal(
    newsletterRoute("newsletter.aitechhive.com", "/journal-assets/image.avif"),
    null,
  );
  assert.equal(
    newsletterRoute("newsletter.aitechhive.com", "/api/newsletter/subscribe"),
    null,
  );
  assert.deepEqual(
    newsletterRoute("newsletter.aitechhive.com", "/robots.txt"),
    { kind: "rewrite", path: "/journal/robots.txt" },
  );
});

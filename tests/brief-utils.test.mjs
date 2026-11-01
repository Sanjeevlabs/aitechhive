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

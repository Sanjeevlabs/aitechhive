import fs from "node:fs/promises";
import { selectEdition } from "../app/brief-utils.mjs";
const cards = JSON.parse(await fs.readFile("data/cards.json", "utf8"));
const ids = selectEdition(cards).map((c) => c.id);
let previous;
try {
  previous = JSON.parse(await fs.readFile("data/edition.json", "utf8"));
} catch {}
if (ids.length && JSON.stringify(ids) !== JSON.stringify(previous?.ids)) {
  await fs.writeFile(
    "data/edition.json",
    JSON.stringify({ published_at: new Date().toISOString(), ids }, null, 2) +
      "\n",
  );
  console.log(`Published a finite ${ids.length}-story edition.`);
} else console.log("No changed edition; preserving publication time.");

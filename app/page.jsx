import fs from "node:fs/promises";
import path from "node:path";
import PageClient from "./page-client";

export const dynamic = "force-dynamic";

async function loadCards() {
  try {
    const filePath = path.join(process.cwd(), "data", "cards.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const cards = JSON.parse(raw);
    return Array.isArray(cards) ? cards : [];
  } catch {
    return [];
  }
}

export default async function Page() {
  const cards = await loadCards();
  return <PageClient initialCards={cards} />;
}

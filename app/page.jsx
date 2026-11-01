import cardsData from "../data/cards.json";
import edition from "../data/edition.json";
import PageClient from "./page-client";

export const dynamic = "force-dynamic";

export default async function Page() {
  const cards = Array.isArray(cardsData) ? cardsData : [];
  return <PageClient initialCards={cards} edition={edition} />;
}

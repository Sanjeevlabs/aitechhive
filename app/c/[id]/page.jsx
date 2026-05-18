import cardsData from "../../../data/cards.json";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const cards = Array.isArray(cardsData) ? cardsData : [];
  const card = cards.find((c) => c.id === id);
  if (!card) return { title: "Card not found — ath" };
  return {
    title: `${card.headline} — ath`,
    description: card.plain_english,
    openGraph: {
      title: card.headline,
      description: card.plain_english,
      type: "article",
    },
  };
}

export default async function CardPage({ params }) {
  const { id } = await params;
  const cards = Array.isArray(cardsData) ? cardsData : [];
  const card = cards.find((c) => c.id === id);
  if (!card) notFound();

  return (
    <main style={{ background: "#F5F1E8", color: "#1A1614", minHeight: "100vh", padding: "40px 24px" }}>
      <article style={{ maxWidth: 640, margin: "0 auto", fontFamily: "var(--font-serif)" }}>
        <a href="/" style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", color: "#6B645B" }}>← ATH</a>
        <p style={{ marginTop: 24, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", color: "#8E4A2A" }}>
          {card.category.toUpperCase()} · {card.jurisdiction?.toUpperCase()}
        </p>
        <h1 style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 12, lineHeight: 1.15 }}>{card.headline}</h1>
        <p style={{ marginTop: 24, fontSize: 17, lineHeight: 1.6, color: "#3D3833" }}>{card.plain_english}</p>
        <div style={{ marginTop: 24, padding: "16px 20px", background: "rgba(0,0,0,0.04)", borderLeft: "2px solid #8E4A2A", borderRadius: 12 }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "#8E4A2A", fontWeight: 600 }}>WHY IT MATTERS</p>
          <p style={{ marginTop: 6, fontSize: 15, color: "#2A2622" }}>{card.why_it_matters}</p>
        </div>
        <p style={{ marginTop: 32, fontSize: 13, fontFamily: "var(--font-mono)", color: "#6B645B" }}>
          Source: <a href={card.source?.url} style={{ color: "#8E4A2A" }}>{card.source?.name}</a>
        </p>
        <p style={{ marginTop: 48, fontSize: 12, color: "#6B645B", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
          <a href="/" style={{ color: "#1A1614" }}>← BACK TO TODAY'S DECK</a>
        </p>
      </article>
    </main>
  );
}

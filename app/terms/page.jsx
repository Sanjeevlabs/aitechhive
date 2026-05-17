export const metadata = { title: "Terms — AITechHive" };

export default function TermsPage() {
  return (
    <main style={{ background: "#F5F1E8", color: "#1A1614", minHeight: "100vh", padding: "40px 24px" }}>
      <article style={{ maxWidth: 640, margin: "0 auto", fontFamily: "var(--font-serif)" }}>
        <a href="/" style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", color: "#6B645B" }}>← BACK</a>
        <h1 style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 24 }}>Terms</h1>
        <p style={{ marginTop: 24, fontSize: 16, lineHeight: 1.6, color: "#3D3833" }}>
          By using AITechHive you agree to these short, plain-English terms.
        </p>
        <h2 style={{ fontSize: 22, fontWeight: 500, marginTop: 36 }}>What this is</h2>
        <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.7, color: "#3D3833" }}>
          A free reading product. Cards summarise publicly-available news, papers, regulations, and job postings, with attribution to the original source on every card. Always read the original for binding details — our summaries are editorial.
        </p>
        <h2 style={{ fontSize: 22, fontWeight: 500, marginTop: 36 }}>No professional advice</h2>
        <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.7, color: "#3D3833" }}>
          Nothing on this site is legal, regulatory, investment, or financial advice.
        </p>
        <h2 style={{ fontSize: 22, fontWeight: 500, marginTop: 36 }}>Acceptable use</h2>
        <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.7, color: "#3D3833" }}>
          Don't scrape, don't resell, don't bot. We rate-limit aggressive usage.
        </p>
        <h2 style={{ fontSize: 22, fontWeight: 500, marginTop: 36 }}>Contact</h2>
        <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.7, color: "#3D3833" }}>
          Questions, takedowns, partnerships — <a href="mailto:hello@aitechhive.com" style={{ color: "#8E4A2A" }}>hello@aitechhive.com</a>.
        </p>
        <p style={{ marginTop: 48, fontSize: 12, color: "#6B645B", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
          LAST UPDATED · MAY 2026
        </p>
      </article>
    </main>
  );
}

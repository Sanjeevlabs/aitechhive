export const metadata = { title: "Privacy — AITechHive" };

export default function PrivacyPage() {
  return (
    <main style={{ background: "#F5F1E8", color: "#1A1614", minHeight: "100vh", padding: "40px 24px" }}>
      <article style={{ maxWidth: 640, margin: "0 auto", fontFamily: "var(--font-serif)" }}>
        <a href="/" style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", color: "#6B645B" }}>← BACK</a>
        <h1 style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 24 }}>Privacy</h1>
        <p style={{ marginTop: 24, fontSize: 16, lineHeight: 1.6, color: "#3D3833" }}>
          AITechHive is a free, ad-free reading experience. We collect the minimum required to make the product work.
        </p>
        <h2 style={{ fontSize: 22, fontWeight: 500, marginTop: 36 }}>What we collect</h2>
        <ul style={{ marginTop: 12, paddingLeft: 20, fontSize: 15, lineHeight: 1.7, color: "#3D3833" }}>
          <li>Your email at sign-in (Supabase Auth — Google OAuth or magic link).</li>
          <li>IDs of cards you save, dismiss, or share — so activity follows you across devices.</li>
          <li>Anonymous page-view stats via Plausible. No cookies, no fingerprinting, no IP storage.</li>
        </ul>
        <h2 style={{ fontSize: 22, fontWeight: 500, marginTop: 36 }}>What we don't collect</h2>
        <ul style={{ marginTop: 12, paddingLeft: 20, fontSize: 15, lineHeight: 1.7, color: "#3D3833" }}>
          <li>No third-party ad trackers, ever.</li>
          <li>No browsing history outside this site.</li>
          <li>No behavioural profiling.</li>
        </ul>
        <h2 style={{ fontSize: 22, fontWeight: 500, marginTop: 36 }}>Delete your data</h2>
        <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.7, color: "#3D3833" }}>
          Email <a href="mailto:hello@aitechhive.com" style={{ color: "#8E4A2A" }}>hello@aitechhive.com</a> from your signed-in address. Done within 48 hours.
        </p>
        <p style={{ marginTop: 48, fontSize: 12, color: "#6B645B", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
          LAST UPDATED · MAY 2026
        </p>
      </article>
    </main>
  );
}

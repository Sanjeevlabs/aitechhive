export const metadata = { title: "Notice & Takedown — ath" };

export default function DmcaPage() {
  return (
    <main style={{ background: "#F5F1E8", color: "#1A1614", minHeight: "100vh", padding: "40px 24px" }}>
      <article style={{ maxWidth: 640, margin: "0 auto", fontFamily: "var(--font-serif)" }}>
        <a href="/" style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", color: "#6B645B" }}>← BACK</a>
        <h1 style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 24 }}>Notice &amp; Takedown</h1>
        <p style={{ marginTop: 24, fontSize: 16, lineHeight: 1.6, color: "#3D3833" }}>
          ath is a discovery aggregator. Cards are independently authored editorial summaries of publicly-available headlines. We never republish source content verbatim, and every card links back to the original publisher.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 500, marginTop: 36 }}>Rights holders</h2>
        <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.7, color: "#3D3833" }}>
          If you are the rights holder of content referenced on this site and you want a card removed, email <a href="mailto:hello@aitechhive.com?subject=Takedown%20request" style={{ color: "#8E4A2A" }}>hello@aitechhive.com</a> with the subject line "Takedown request".
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 500, marginTop: 36 }}>Include in the email</h2>
        <ol style={{ marginTop: 12, paddingLeft: 20, fontSize: 15, lineHeight: 1.7, color: "#3D3833" }}>
          <li>The card URL on aitechhive.com (e.g. <code style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>aitechhive.com/c/&lt;id&gt;</code>)</li>
          <li>The original work and a link to it</li>
          <li>Your relationship to the rights (owner, agent, counsel)</li>
          <li>A good-faith statement that the card is reproducing copyrighted material without authorisation</li>
          <li>Contact info we can reply to</li>
        </ol>

        <h2 style={{ fontSize: 22, fontWeight: 500, marginTop: 36 }}>Our response window</h2>
        <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.7, color: "#3D3833" }}>
          We aim to action valid takedown requests within <strong>48 hours</strong>. We will:
        </p>
        <ul style={{ marginTop: 8, paddingLeft: 20, fontSize: 15, lineHeight: 1.7, color: "#3D3833" }}>
          <li>Remove the card from the live deck and the per-card page</li>
          <li>Strip it from the archived JSON in the next refresh cycle</li>
          <li>Add the source domain to a deny-list so future runs skip it</li>
          <li>Confirm in writing once done</li>
        </ul>

        <h2 style={{ fontSize: 22, fontWeight: 500, marginTop: 36 }}>Robots &amp; opt-out</h2>
        <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.7, color: "#3D3833" }}>
          Our pipeline identifies itself with the User-Agent header <code style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>AITechHive/2.0 (+https://aitechhive.com)</code> and only reads publisher-published RSS feeds. Block that UA in your robots.txt or RSS server to permanently opt out.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 500, marginTop: 36 }}>Counter-notice</h2>
        <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.7, color: "#3D3833" }}>
          If you believe a takedown was made in error, reply to the takedown thread with your counter-notice and we will review.
        </p>

        <p style={{ marginTop: 48, fontSize: 12, color: "#6B645B", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
          LAST UPDATED · MAY 2026
        </p>
      </article>
    </main>
  );
}

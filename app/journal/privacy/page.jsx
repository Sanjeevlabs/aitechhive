import { Header, Footer } from "../components/chrome";
export const metadata = { title: "Privacy & subscriber choices" };
export default function Privacy() {
  return (
    <>
      <Header />
      <main id="main" className="shell legal">
        <p className="eyebrow">LAST UPDATED · 2 NOVEMBER 2026</p>
        <h1>
          Read freely.
          <br />
          <em>Subscribe by choice.</em>
        </h1>
        <h2>What we collect</h2>
        <p>
          When you subscribe, AITechHive records your email address, signup
          time, consent version and subscription status. These records are
          stored in the site’s existing Supabase database and are not published
          in the article archive or source code.
        </p>
        <h2>How it is used</h2>
        <p>
          Your email is collected to send AITechHive working notes and
          publication updates. Reading articles does not require an account.
          Signup alone does not send an immediate email; sending is managed
          separately by the publisher. We do not sell subscriber details.
        </p>
        <h2>Your choices</h2>
        <p>
          You can unsubscribe using your private cancellation link shown after
          signup. Future working-note emails must include that same type of
          unsubscribe link. For an existing subscriber’s privacy, repeat signups
          do not reveal their cancellation link.
        </p>
        <h2>Operational data</h2>
        <p>
          Vercel processes requests to serve the site. To limit signup abuse,
          the site keeps a short-lived daily hash derived from the request IP, a
          request count and an expiry time. It does not store the raw IP in the
          signup tables. Expired rate-limit records are removed during later
          signup requests.
        </p>
        <h2>Questions or deletion requests</h2>
        <p>
          Contact Sanjeev Kumar Singh through{" "}
          <a href="https://sanjeevlabs.com" target="_blank" rel="noreferrer">
            sanjeevlabs.com
          </a>{" "}
          to request access, correction or deletion of your signup data.
          Unsubscribing stops future emails; deletion requests remove the
          record.
        </p>
      </main>
      <Footer />
    </>
  );
}

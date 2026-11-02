"use client";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
export default function Subscribe({ compact = false }) {
  const [email, setEmail] = useState(""),
    [consent, setConsent] = useState(false),
    [website, setWebsite] = useState("");
  const [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false),
    [done, setDone] = useState(false),
    [cancel, setCancel] = useState("");
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const r = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, website }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error || "Signup failed. Please try again.");
      setDone(true);
      setCancel(d.unsubscribeUrl || "");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div
      className={`signup ${compact ? "compact" : ""}`}
      id={compact ? undefined : "subscribe"}
    >
      {!compact && (
        <>
          <p className="eyebrow">THE NEXT GOOD QUESTION, IN YOUR INBOX</p>
          <h2>
            Build your understanding.
            <br />
            <em>One working note at a time.</em>
          </h2>
          <p>
            Practical essays on AI in financial systems. New writing when
            there’s something worth sharing.
          </p>
        </>
      )}
      {done ? (
        <div className="signup-success" role="status">
          <Check size={24} />
          <div>
            <strong>Your signup is saved.</strong>
            <p>We’ll email you when new working notes are published.</p>
            {cancel && (
              <a href={cancel}>Save this link to cancel your signup</a>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={submit}>
          <div className="email-row">
            <label
              className="sr-only"
              htmlFor={compact ? "email-compact" : "email-main"}
            >
              Email address
            </label>
            <input
              id={compact ? "email-compact" : "email-main"}
              type="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              autoComplete="email"
            />
            <button className="button dark" disabled={busy}>
              {busy ? "Saving…" : "Join the list"}
              <ArrowRight size={17} />
            </button>
          </div>
          <label className="consent">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>
              I agree to receive AITechHive working notes by email.{" "}
              <a href="/journal/privacy">Privacy &amp; unsubscribe</a>
            </span>
          </label>
          <label className="honeypot" aria-hidden="true">
            Website
            <input
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </label>
          {status && (
            <p className="form-error" role="alert">
              {status}
            </p>
          )}
        </form>
      )}
    </div>
  );
}

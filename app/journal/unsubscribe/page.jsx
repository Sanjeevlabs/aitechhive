"use client";
import { useEffect, useState } from "react";
import { Header, Footer } from "../components/chrome";
export default function Unsubscribe() {
  const [status, setStatus] = useState(""),
    [token, setToken] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(
    () =>
      setToken(new URLSearchParams(window.location.search).get("token") || ""),
    [],
  );
  async function cancel() {
    setBusy(true);
    try {
      const r = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error || "Please try again.");
      setStatus("You have been unsubscribed.");
    } catch (e) {
      setStatus(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Header />
      <main id="main" className="shell legal">
        <h1>
          Your inbox.
          <br />
          <em>Your choice.</em>
        </h1>
        <p>Use this page to stop receiving AITechHive working notes.</p>
        {token ? (
          <button
            className="button dark"
            disabled={busy || status === "You have been unsubscribed."}
            onClick={cancel}
          >
            {busy ? "Updating…" : "Unsubscribe me"}
          </button>
        ) : (
          <p>
            Open the unsubscribe link included in your signup confirmation or a
            working-note email.
          </p>
        )}
        <p role="status">{status}</p>
      </main>
      <Footer />
    </>
  );
}

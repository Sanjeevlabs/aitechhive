"use client";
import { useState, useEffect } from "react";
import { Share2, Check } from "lucide-react";
export default function Share({ title }) {
  const [message, setMessage] = useState(""),
    [pageUrl, setPageUrl] = useState("");
  useEffect(() => setPageUrl(window.location.href), []);
  async function share() {
    try {
      const url = window.location.href;
      if (navigator.share) await navigator.share({ title, url });
      else {
        await navigator.clipboard.writeText(url);
        setMessage("Link copied");
      }
    } catch (e) {
      if (e.name !== "AbortError")
        setMessage("Copy this page’s address to share.");
    }
  }
  return (
    <div className="share-actions">
      <button className="button" onClick={share}>
        {message ? <Check size={16} /> : <Share2 size={16} />}{" "}
        {message || "Share this note"}
      </button>
      <a
        className="share-social"
        target="_blank"
        rel="noreferrer"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl || "https://newsletter.aitechhive.com")}`}
      >
        LinkedIn ↗
      </a>
    </div>
  );
}

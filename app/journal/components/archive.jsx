"use client";
import { useMemo, useState, useEffect } from "react";
import { ArrowUpRight, Search } from "lucide-react";
export default function Archive({ posts, limited = false }) {
  const [query, setQuery] = useState(""),
    [series, setSeries] = useState("All notes"),
    [sort, setSort] = useState("newest");
  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get("q") || "");
  }, []);
  const groups = [
    "All notes",
    ...Array.from(new Set(posts.map((p) => p.series))),
  ];
  const filtered = useMemo(
    () =>
      posts
        .filter(
          (p) =>
            (series === "All notes" || p.series === series) &&
            query
              .toLowerCase()
              .trim()
              .split(/\s+/)
              .every((t) =>
                [p.title, p.description, p.series]
                  .join(" ")
                  .toLowerCase()
                  .includes(t),
              ),
        )
        .sort((a, b) =>
          sort === "oldest"
            ? a.date.localeCompare(b.date)
            : b.date.localeCompare(a.date),
        ),
    [posts, query, series, sort],
  );
  return (
    <section id="archive" className="archive-block">
      <div className="archive-heading">
        <div>
          <p className="eyebrow">THE WORKING LIBRARY</p>
          <h2>Go beyond the headline.</h2>
        </div>
        <p>
          {posts.length} essays.
          <br />
          Read at your own pace.
        </p>
      </div>
      <div className="archive-controls">
        <label className="search">
          <Search size={19} />
          <input
            aria-label="Search the archive"
            placeholder="Search governance, RAG, reliability…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          aria-label="Order articles"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Start from the beginning</option>
        </select>
      </div>
      <div className="filters" aria-label="Filter by series">
        {groups.map((g) => (
          <button
            aria-pressed={g === series}
            key={g}
            onClick={() => setSeries(g)}
          >
            {g}
          </button>
        ))}
      </div>
      <p className="results" role="status">
        {filtered.length} {filtered.length === 1 ? "note" : "notes"}
        {series !== "All notes" ? ` in ${series}` : ""}
      </p>
      <div className="archive-list">
        {(limited ? filtered.slice(0, 9) : filtered).map((p, i) => (
          <article className="archive-row" key={p.slug}>
            <span className="row-num">{String(i + 1).padStart(2, "0")}</span>
            <div className="row-content">
              <div className="meta">
                <span>{p.series}</span>
                <span>{p.minutes} min read</span>
                <span>
                  {new Date(p.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                </span>
              </div>
              <a href={`/journal/p/${p.slug}`}>
                <h3>{p.title}</h3>
              </a>
              <p>{p.description}</p>
            </div>
            <a
              className="row-arrow"
              href={`/journal/p/${p.slug}`}
              aria-label={`Read ${p.title}`}
            >
              <ArrowUpRight size={23} />
            </a>
          </article>
        ))}
        {!filtered.length && (
          <div className="empty">
            <h3>No notes found.</h3>
            <p>Try another topic, or reset your search.</p>
            <button
              className="button"
              onClick={() => {
                setQuery("");
                setSeries("All notes");
              }}
            >
              Show all notes
            </button>
          </div>
        )}
      </div>
      <div className="archive-end">
        {limited && filtered.length > 9 ? (
          <a className="button" href="/journal/archive">
            Explore the full {posts.length}-note archive{" "}
            <ArrowUpRight size={16} />
          </a>
        ) : (
          <p>
            You’ve reached the end of this collection. Good reading doesn’t need
            an infinite feed.
          </p>
        )}
      </div>
    </section>
  );
}

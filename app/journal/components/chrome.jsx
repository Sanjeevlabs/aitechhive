import { ArrowUpRight } from "lucide-react";
export function Brand() {
  return (
    <a href="/journal/" className="brand">
      <svg
        width="34"
        height="34"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 3 35 11.5v17L20 37 5 28.5v-17L20 3Z"
          stroke="currentColor"
          strokeWidth="2.4"
        />
        <path
          d="m12 25 8-14 8 14M15 20h10M20 11v19"
          stroke="currentColor"
          strokeWidth="2.4"
        />
      </svg>
      <span>
        AI<span className="brand-light">Tech</span>Hive
        <span className="dot">.</span>
      </span>
    </a>
  );
}
export function Header() {
  return (
    <header className="masthead">
      <div className="shell head-inner">
        <Brand />
        <nav aria-label="Main navigation">
          <a href="/journal/archive">The archive</a>
          <a href="/journal/#series">The series</a>
          <a
            className="daily-link"
            href="https://aitechhive.com"
            target="_blank"
            rel="noreferrer"
          >
            Daily brief <ArrowUpRight size={14} />
          </a>
        </nav>
        <a href="/journal/#subscribe" className="button dark head-subscribe">
          Subscribe <ArrowUpRight size={15} />
        </a>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="shell footer">
      <div>
        <Brand />
        <p>
          Working notes on AI in financial systems.
          <br />
          Written by Sanjeev Kumar Singh.
        </p>
      </div>
      <div className="footer-links">
        <a href="/journal/archive">Read the archive</a>
        <a href="https://sanjeevlabs.com" target="_blank" rel="noreferrer">
          About the author <ArrowUpRight size={13} />
        </a>
        <a href="/journal/privacy">Privacy &amp; unsubscribe</a>
        <span>© {new Date().getFullYear()} AITechHive</span>
      </div>
    </footer>
  );
}

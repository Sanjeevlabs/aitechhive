import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Header, Footer } from "./components/chrome";
import Archive from "./components/archive";
import Subscribe from "./components/subscribe";
import { summaries, posts } from "./lib/posts";
export default function Home() {
  const lead = posts[0];
  return (
    <>
      <Header />
      <main id="main">
        <section className="shell hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="blue-square" /> INDEPENDENT THINKING. PRODUCTION
              REALITY.
            </p>
            <h1>
              AI in finance.
              <br />
              <em>Grounded in reality.</em>
            </h1>
            <p className="hero-description">
              Working notes on the systems, safeguards and decisions that turn
              AI into something you can trust.
            </p>
            <div className="hero-actions">
              <a className="button dark" href="#archive">
                Explore the notes <ArrowRight size={17} />
              </a>
              <span>
                By Sanjeev Kumar Singh
                <br />
                <small>
                  Banking technology · AI reliability · Practical thinking
                </small>
              </span>
            </div>
          </div>
          <div
            className="hero-art"
            aria-label="A conceptual map from model to production: context, controls and evidence"
          >
            <div className="diagram-top">
              <span>THE SPACE BETWEEN</span>
              <span>FIG. 01</span>
            </div>
            <div className="diagram">
              <div className="orbit outer" />
              <div className="orbit middle" />
              <div className="orbit inner" />
              <div className="diagram-center">
                AI<span>IN THE REAL WORLD</span>
              </div>
              <span className="diagram-node context">Context</span>
              <span className="diagram-node control">Controls</span>
              <span className="diagram-node evidence">Evidence</span>
              <span className="diagram-node people">People</span>
            </div>
            <div className="diagram-caption">
              The model is only the beginning.
            </div>
          </div>
        </section>
        <div className="shell edition-rule">
          <span>AGENT GROUND TRUTH</span>
          <p>A growing library, not a breaking-news feed.</p>
          <a href="https://aitechhive.com" target="_blank" rel="noreferrer">
            Looking for today’s brief? <ArrowUpRight size={14} />
          </a>
        </div>
        {lead && (
          <section className="shell featured">
            <div className="feature-intro">
              <p className="eyebrow">START HERE</p>
              <h2>
                What the dashboards
                <br />
                <em>don’t tell you.</em>
              </h2>
              <p>
                A closer look at the gaps between a system that runs and a
                system you can rely on.
              </p>
            </div>
            <article className="featured-note">
              <div className="meta">
                <span>{lead.series}</span>
                <span>{lead.minutes} min read</span>
              </div>
              <a href={`/journal/p/${lead.slug}`}>
                <h2>{lead.title}</h2>
              </a>
              <p>{lead.description}</p>
              <a href={`/journal/p/${lead.slug}`} className="text-link">
                Read the working note <ArrowUpRight size={18} />
              </a>
              <span className="feature-number">01</span>
            </article>
          </section>
        )}
        <section id="series" className="series-section">
          <div className="shell">
            <div className="series-heading">
              <p className="eyebrow">CONNECTED IDEAS</p>
              <h2>Follow the questions.</h2>
              <p>
                From first principles to the production decisions that matter.
              </p>
            </div>
            <div className="series-grid">
              {[
                {
                  n: "01",
                  title: "Understand the system",
                  text: "Models, documents, embeddings and the mechanics behind the interface.",
                  q: "model",
                },
                {
                  n: "02",
                  title: "Establish the boundaries",
                  text: "Governance, evidence, access and controls that earn trust.",
                  q: "governance",
                },
                {
                  n: "03",
                  title: "Prepare for reality",
                  text: "Reliability, incidents, drift and the messy life after deployment.",
                  q: "reliability",
                },
              ].map((s) => (
                <a
                  className="series-card"
                  href={`/journal/archive?q=${s.q}`}
                  key={s.n}
                >
                  <span className="series-num">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <ArrowUpRight size={20} />
                </a>
              ))}
            </div>
          </div>
        </section>
        <div className="shell">
          <Archive posts={summaries} limited />
          <Subscribe />
        </div>
        <section className="shell author">
          <div className="author-monogram" aria-hidden="true">
            SKS<span>WRITER &amp; BUILDER</span>
          </div>
          <div>
            <p className="eyebrow">A NOTE FROM THE AUTHOR</p>
            <h2>
              Written from the
              <br />
              <em>operating side of technology.</em>
            </h2>
            <p>
              I’m Sanjeev Kumar Singh. I work in banking technology and build
              Tracelane, an AI-agent reliability platform. These notes explore
              what it takes to move from a promising model to a dependable
              system.
            </p>
            <a
              href="https://sanjeevlabs.com"
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              More about my work <ArrowUpRight size={17} />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

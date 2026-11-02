import { notFound } from "next/navigation";
import { Header, Footer } from "../../components/chrome";
import Subscribe from "../../components/subscribe";
import Share from "../../components/share";
import { posts } from "../../lib/posts";
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  return post
    ? {
        title: post.title,
        description: post.description,
        openGraph: {
          title: post.title,
          description: post.description,
          type: "article",
          publishedTime: post.date,
        },
        alternates: {
          canonical: `https://newsletter.aitechhive.com/p/${slug}`,
        },
      }
    : { title: "Note not found" };
}
export default async function Article({ params }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  const related = posts
    .filter((p) => p.series === post.series && p.slug !== post.slug)
    .slice(0, 3);
  return (
    <>
      <Header />
      <main id="main" className="article-shell">
        <div className="article-breadcrumb">
          <a href="/journal/archive">← All working notes</a>
          <span>{post.series}</span>
        </div>
        <header className="article-header">
          <p className="eyebrow">{post.sequence || "THE WORKING NOTES"}</p>
          <h1>{post.title}</h1>
          <p className="article-deck">{post.description}</p>
          <div className="article-byline">
            <span className="small-monogram">SKS</span>
            <div>
              <strong>Sanjeev Kumar Singh</strong>
              <span>
                {new Date(post.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}{" "}
                · {post.minutes} min read
              </span>
            </div>
          </div>
          <Share title={post.title} />
        </header>
        <div className="article-layout">
          <aside className="toc">
            <p className="eyebrow">IN THIS NOTE</p>
            {post.headings.slice(0, 18).map((h, i) => (
              <a href={`#${h.id}`} key={i}>
                {h.text}
              </a>
            ))}
            <a href="#subscribe">Join the list ↗</a>
          </aside>
          <article
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
        <section className="article-finish">
          <p className="eyebrow">THE END OF THIS WORKING NOTE</p>
          <h2>Good ideas are worth passing on.</h2>
          <Share title={post.title} />
        </section>
        <Subscribe />
        {related.length > 0 && (
          <section className="related-notes">
            <p className="eyebrow">CONTINUE THE THREAD</p>
            {related.map((p) => (
              <a key={p.slug} href={`/journal/p/${p.slug}`}>
                {p.title}
                <span>↗</span>
              </a>
            ))}
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

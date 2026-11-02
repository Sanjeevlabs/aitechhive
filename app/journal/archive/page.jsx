import { Header, Footer } from "../components/chrome";
import Archive from "../components/archive";
import Subscribe from "../components/subscribe";
import { summaries } from "../lib/posts";
export const metadata = { title: "The archive" };
export default function Page() {
  return (
    <>
      <Header />
      <main id="main" className="shell archive-page">
        <Archive posts={summaries} />
        <Subscribe />
      </main>
      <Footer />
    </>
  );
}

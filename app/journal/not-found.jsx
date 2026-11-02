import { Header, Footer } from "./components/chrome";
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="shell legal">
        <p className="eyebrow">NOTE NOT FOUND</p>
        <h1>
          Let’s get you
          <br />
          <em>back to the notes.</em>
        </h1>
        <p>
          This article address could not be found. The full published collection
          is in the archive.
        </p>
        <a href="/journal/archive" className="button dark">
          Browse all working notes
        </a>
      </main>
      <Footer />
    </>
  );
}

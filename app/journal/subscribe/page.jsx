import { Header, Footer } from "../components/chrome";
import Subscribe from "../components/subscribe";
export const metadata = { title: "Subscribe to the working notes" };
export default function Page() {
  return (
    <>
      <Header />
      <main id="main" className="shell legal">
        <Subscribe />
      </main>
      <Footer />
    </>
  );
}

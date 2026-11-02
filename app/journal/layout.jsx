import "./journal.css";
export const metadata = {
  title: {
    default: "AITechHive — Agent Ground Truth",
    template: "%s | AITechHive",
  },
  description: "Working notes on AI in financial systems.",
  alternates: { canonical: "https://newsletter.aitechhive.com/" },
};
export default function Layout({ children }) {
  return <div className="journal-site">{children}</div>;
}

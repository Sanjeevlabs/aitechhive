import "./globals.css";
import { DM_Sans, DM_Serif_Display, Geist_Mono } from "next/font/google";
import Script from "next/script";

// Databricks-inspired type stack:
// - DM Sans for UI + body (Databricks uses it across their product surfaces).
// - DM Serif Display held in the --font-serif slot for the rare hero moment
//   (welcome card's "Today.") — used sparingly so the look stays DB-like.
// - Geist Mono kept for numeric tabular display (dates, stat values).
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap", weight: ["400", "500", "600", "700", "800"] });
const serif = DM_Serif_Display({ subsets: ["latin"], variable: "--font-serif", display: "swap", weight: ["400"] });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap", weight: ["400", "500", "600"] });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://aitechhive.com";

// Single source of truth for search + social. Mirrors are in JSON-LD below.
const TITLE = "AITechHive — Daily AI brief from enterprises and the markets that move them";
const DESCRIPTION =
  "AI updates from enterprises — banks, insurers, fintechs and the regulators between them. Curated daily from Reuters, Bloomberg, FT, the FCA, OCC, RBI, frontier labs, and arXiv. Free, no inbox.";

export const metadata = {
  metadataBase: new URL(APP_URL),
  title: { default: TITLE, template: "%s — AITechHive" },
  description: DESCRIPTION,
  applicationName: "AITechHive",
  // Keywords matter less for Google but help AEO engines + LinkedIn previews.
  keywords: [
    "BFSI AI", "enterprise AI", "AI news", "banking AI", "fintech AI",
    "AI regulation", "FCA AI", "OCC AI", "RBI AI", "frontier AI labs",
    "AI funding", "AI deployment", "AI in banking", "daily AI brief",
  ],
  authors: [{ name: "AITechHive" }],
  creator: "AITechHive",
  publisher: "AITechHive",
  alternates: { canonical: "/" },
  category: "news",
  robots: {
    index: true, follow: true,
    googleBot: {
      index: true, follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Version-suffix the icon URLs so browsers re-fetch when the mark changes.
  // Safari is particularly aggressive about caching favicons; without a
  // version string it'll keep showing the old logo for weeks after a deploy.
  // Bump ICON_V whenever icon.svg / apple-icon.svg change visually.
  icons: {
    icon: [
      { url: "/icon.svg?v=5", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.svg?v=5", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg?v=5",
  },
  openGraph: {
    type: "website",
    siteName: "AITechHive",
    title: TITLE,
    description: DESCRIPTION,
    url: APP_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  formatDetection: { telephone: false },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#FFFFFF",
};

// JSON-LD: gives both Google and LLM crawlers (ChatGPT search, Perplexity, etc.)
// a structured understanding of what this site is. AEO foundation.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${APP_URL}#site`,
      url: APP_URL,
      name: "AITechHive",
      description: DESCRIPTION,
      publisher: { "@id": `${APP_URL}#org` },
      inLanguage: "en",
    },
    {
      "@type": "Organization",
      "@id": `${APP_URL}#org`,
      name: "AITechHive",
      url: APP_URL,
      logo: `${APP_URL}/icon.svg`,
    },
    {
      "@type": "NewsMediaOrganization",
      name: "AITechHive",
      url: APP_URL,
      description: DESCRIPTION,
      knowsAbout: [
        "BFSI", "Enterprise AI", "Banking AI", "Fintech",
        "AI regulation", "Frontier AI", "Capital markets", "Risk and compliance",
      ],
    },
  ],
};

export default function RootLayout({ children }) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        <link rel="canonical" href={APP_URL} />
        <Script
          id="ld-json"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body>{children}</body>
      {plausibleDomain && (
        <Script strategy="afterInteractive" data-domain={plausibleDomain} src="https://plausible.io/js/script.js" />
      )}
    </html>
  );
}

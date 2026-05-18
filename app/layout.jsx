import "./globals.css";
import { Source_Serif_4, Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif", display: "swap", weight: ["400", "500", "600"] });
const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap", weight: ["400", "500", "600"] });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://aitechhive.com";

export const metadata = {
  metadataBase: new URL(APP_URL),
  title: "ath — BFSI & Enterprise AI, live",
  description: "The live web alternative to AI newsletters. Eight refreshes a day. Swipe-format. Free, no inbox required.",
  applicationName: "ath",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
    shortcut: "/icon.svg",
  },
  openGraph: {
    title: "ath — BFSI & Enterprise AI, live",
    description: "Eight refreshes a day. Live. No inbox required.",
    url: APP_URL,
    siteName: "ath",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ath — BFSI & Enterprise AI, live",
    description: "Eight refreshes a day. Live. No inbox required.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0E0D0C",
};

export default function RootLayout({ children }) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      {/* Prevent flash of wrong theme — runs before paint */}
      <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme'),d=t?t==='dark':window.matchMedia('(prefers-color-scheme:dark)').matches;if(d)document.documentElement.dataset.theme='dark';}catch(e){}` }} />
      <body>{children}</body>
      {plausibleDomain && (
        <Script strategy="afterInteractive" data-domain={plausibleDomain} src="https://plausible.io/js/script.js" />
      )}
    </html>
  );
}

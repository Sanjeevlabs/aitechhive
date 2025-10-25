import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: 'AITECHHIVE - AI Governance & Deployment in Regulated Financial Services',
  description: 'Working notes on AI governance and deployment in regulated financial institutions. Learn how banks structure AI systems, risk controls, and compliance frameworks.',
  metadataBase: new URL('https://aitechhive.com'),
  keywords: [
    'AI governance financial services UK',
    'model risk management AI banking',
    'enterprise AI deployment regulated industries',
    'AI compliance banking',
    'regulated AI BFSI',
    'AI risk controls'
  ],
  authors: [{ name: 'Sanjeev Kumar Singh' }],
  creator: 'Sanjeev Kumar Singh',
  publisher: 'AITECHHIVE',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'AITECHHIVE - AI Governance & Deployment in Regulated Financial Services',
    description: 'Working notes on AI governance and deployment in regulated financial institutions. Learn how banks structure AI systems, risk controls, and compliance frameworks.',
    url: 'https://aitechhive.com',
    siteName: 'AITECHHIVE',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AITECHHIVE - AI Governance & Deployment in Regulated Financial Services',
    description: 'Working notes on AI governance and deployment in regulated financial institutions.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/icons/mask-icon.svg" color="#D4AF37" />
        <meta name="theme-color" content="#D4AF37" />
      </head>
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
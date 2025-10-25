import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: 'AITECHHIVE - AI Governance & Deployment in Regulated Financial Services',
  description: 'Practical guidance on AI deployment in UK and EU banks. Learn regulatory compliance frameworks, model risk management, and AI governance for financial institutions.',
  metadataBase: new URL('https://aitechhive.com'),
  keywords: [
    'AI governance financial services UK',
    'AI deployment banking UK',
    'EU AI regulation banking',
    'model risk management banking',
    'AI compliance financial institutions',
    'regulatory AI banking UK',
    'AI risk management BFSI',
    'FCA AI regulation',
    'PRA AI guidelines',
    'EBA AI framework',
    'AI audit financial services',
    'explainable AI banking',
    'AI model validation UK',
    'financial services AI governance',
    'banking AI deployment framework'
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
    description: 'Practical guidance on AI deployment in UK and EU banks. Learn regulatory compliance frameworks, model risk management, and AI governance for financial institutions.',
    url: 'https://aitechhive.com',
    siteName: 'AITECHHIVE',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AITECHHIVE - AI Governance & Deployment in Regulated Financial Services',
    description: 'Practical guidance on AI deployment in UK and EU banks. Regulatory compliance, model risk management, and AI governance for financial institutions.',
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
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
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
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AITECHHIVE - Hive of AI Learners — Humans, Learning Together',
  description: 'Get simple explanations and in-depth AI topics delivered daily. Join 500+ curious minds transforming complex AI concepts into clear, actionable knowledge.',
  metadataBase: new URL('https://aitechhive.com'),
  keywords: ['AI', 'Artificial Intelligence', 'Machine Learning', 'AI Education', 'Tech Learning', 'AI Newsletter'],
  authors: [{ name: 'AITECHHIVE' }],
  creator: 'AITECHHIVE',
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
    title: 'AITECHHIVE - Hive of AI Learners — Humans, Learning Together',
    description: 'Get simple explanations and in-depth AI topics delivered daily. Join 500+ curious minds transforming complex AI concepts into clear, actionable knowledge.',
    url: 'https://aitechhive.com',
    siteName: 'AITECHHIVE',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AITECHHIVE - Hive of AI Learners — Humans, Learning Together',
    description: 'Get simple explanations and in-depth AI topics delivered daily.',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/icons/mask-icon.svg" color="#4F88FF" />
        <meta name="theme-color" content="#4F88FF" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
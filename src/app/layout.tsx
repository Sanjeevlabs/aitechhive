import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Tech Hive - Decode AI Jargons, One Topic at a Time',
  description: 'Get simple explanations and in-depth AI topics delivered daily. Join 500+ curious minds transforming complex AI concepts into clear, actionable knowledge.',
  metadataBase: new URL('https://aitechhive.com'),
  keywords: ['AI', 'Artificial Intelligence', 'Machine Learning', 'AI Education', 'Tech Learning', 'AI Newsletter'],
  authors: [{ name: 'AI Tech Hive' }],
  creator: 'AI Tech Hive',
  publisher: 'AI Tech Hive',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'AI Tech Hive - Decode AI Jargons, One Topic at a Time',
    description: 'Get simple explanations and in-depth AI topics delivered daily. Join 500+ curious minds transforming complex AI concepts into clear, actionable knowledge.',
    url: 'https://aitechhive.com',
    siteName: 'AI Tech Hive',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tech Hive - Decode AI Jargons, One Topic at a Time',
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="font-sans transition-theme">{children}</body>
    </html>
  )
}
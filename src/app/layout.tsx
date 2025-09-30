import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Tech Hive - Decode AI Jargons, One Topic at a Time',
  description: 'Get simple explanations and in-depth AI topics delivered daily. Join 500+ curious minds transforming complex AI concepts into clear, actionable knowledge.',
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
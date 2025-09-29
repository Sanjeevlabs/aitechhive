import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Tech Hive - Finally Understand AI',
  description: 'Simple explanations and in-depth topics to help you master AI concepts. Join 500+ curious minds learning AI every week.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
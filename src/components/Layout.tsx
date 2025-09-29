'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 transition-theme">
        {children}
      </div>
    </ThemeProvider>
  )
}
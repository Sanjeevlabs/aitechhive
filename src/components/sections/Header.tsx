'use client'

import { motion, useScroll } from 'framer-motion'
import { Logo } from '@/components/Logo'
import { useState, useEffect } from 'react'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setScrolled(latest > 50)
    })
  }, [scrollY])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Logo size="sm" />
          </motion.div>
          
          {/* Navigation Links - with right padding to avoid overlap with theme toggle */}
          <nav className="hidden md:flex items-center space-x-6 pr-48">
            <motion.a
              href="https://newsletter.aitechhive.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-foreground hover:text-accent transition-colors duration-200"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Newsletter
            </motion.a>
            <motion.a
              href="/glossary"
              className="text-sm font-medium text-foreground hover:text-accent transition-colors duration-200"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Jargon Buster
            </motion.a>
          </nav>
        </div>
      </div>
    </header>
  )
}
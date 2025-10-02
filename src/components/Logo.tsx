'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ size = 'md', className }: LogoProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    
    checkTheme()
    
    // Watch for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  const sizeMap = {
    sm: { width: 40, height: 40, textSize: 'text-xs' },
    md: { width: 80, height: 80, textSize: 'text-lg' },
    lg: { width: 100, height: 100, textSize: 'text-xl' }
  }

  const { width, height, textSize } = sizeMap[size]

  return (
    <motion.div
      className={cn('flex flex-col items-center', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="relative mb-3"
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.98 }}
      >
        <Image
          src={isDark ? '/logo-dark.svg' : '/logo-light.svg'}
          alt="AITECHHIVE Logo"
          width={width}
          height={height}
          priority
          className="drop-shadow-lg"
        />
      </motion.div>
      
      <motion.h3 
        className={cn(
          'font-semibold text-foreground tracking-tight',
          textSize
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        AITECHHIVE
      </motion.h3>
    </motion.div>
  )
}
'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ size = 'md', className }: LogoProps) {
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
          src="/logo-light.svg"
          alt="AITECHHIVE Logo"
          width={width}
          height={height}
          priority
          className="drop-shadow-lg"
        />
      </motion.div>
      
      <motion.h3 
        className={cn(
          'font-semibold tracking-tight',
          textSize,
          size === 'lg' ? 'text-white' : 'text-foreground'
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
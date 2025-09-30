'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ size = 'md', className }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-16 h-16 text-xl',
    lg: 'w-20 h-20 text-2xl'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <motion.div
      className={cn('flex flex-col items-center', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className={cn(
          'bg-foreground rounded-lg flex items-center justify-center text-background font-semibold shadow-sm mb-3 relative',
          sizeClasses[size]
        )}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.98 }}
      >
        <span className={cn('font-bold tracking-tight', textSizeClasses[size])}>
          ATH
        </span>
      </motion.div>
      
      <motion.h3 
        className={cn(
          'font-medium text-neutral-700 dark:text-neutral-300 tracking-wide',
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-lg' : 'text-xl'
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        AI TechHive
      </motion.h3>
    </motion.div>
  )
}
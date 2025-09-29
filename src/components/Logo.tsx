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
          'bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg mb-3 relative',
          sizeClasses[size]
        )}
        whileHover={{ 
          scale: 1.05,
          rotate: [0, -2, 2, 0],
          transition: { duration: 0.3 }
        }}
        whileTap={{ scale: 0.95 }}
      >
        <span className={cn('font-extrabold tracking-tight', textSizeClasses[size])}>
          ATH
        </span>
        
        {/* AI-inspired geometric elements */}
        <div className="absolute inset-0 rounded-xl">
          <div className="absolute top-1 right-1 w-1 h-1 bg-white/30 rounded-full animate-pulse" />
          <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-white/40 rounded-full animate-pulse delay-300" />
        </div>
      </motion.div>
      
      <motion.h3 
        className={cn(
          'font-semibold text-gray-700 dark:text-gray-300 tracking-wide',
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
'use client'
// @ts-nocheck

import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl',
        secondary: 'bg-white hover:bg-gray-50 text-primary-600 border border-primary-200 shadow-md hover:shadow-lg',
        ghost: 'bg-transparent hover:bg-primary-50 text-primary-600 dark:hover:bg-primary-900/20',
        gradient: 'bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white shadow-lg hover:shadow-xl'
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

interface CTAButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  showArrow?: boolean
  external?: boolean
}

export function CTAButton({ 
  children, 
  href, 
  onClick, 
  className, 
  variant, 
  size, 
  showArrow = false,
  external = false,
  ...props 
}: CTAButtonProps) {
  const handleClick = () => {
    if (href) {
      if (external) {
        // Smooth transition animation before redirect
        window.open(href, '_blank', 'noopener,noreferrer')
      } else {
        window.location.href = href
      }
    }
    if (onClick) {
      onClick()
    }
  }

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="inline-block"
    >
      <button
        onClick={handleClick}
        className={cn(buttonVariants({ variant, size }), className)}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
          {showArrow && (
            <motion.div
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRightIcon className="h-4 w-4" />
            </motion.div>
          )}
        </span>
        
        {/* Animated background for gradient variant */}
        {variant === 'gradient' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-lg opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </button>
    </motion.div>
  )
}
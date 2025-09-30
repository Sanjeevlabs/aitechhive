'use client'

import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-accent via-accent-secondary to-accent-tertiary text-white shadow-md hover:shadow-glow transform hover:-translate-y-0.5',
        secondary: 'bg-background hover:bg-secondary text-foreground border border-border shadow-sm hover:shadow-md',
        ghost: 'bg-transparent hover:bg-secondary text-foreground',
        accent: 'bg-accent hover:bg-accent-secondary text-white shadow-md hover:shadow-glow-sm'
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
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.99,
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
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRightIcon className="h-4 w-4" />
            </motion.div>
          )}
        </span>
      </button>
    </motion.div>
  )
}
'use client'

import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-foreground hover:bg-neutral-800 dark:hover:bg-neutral-200 text-background shadow-sm hover:shadow-md',
        secondary: 'bg-background hover:bg-neutral-50 dark:hover:bg-neutral-800 text-foreground border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md',
        ghost: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground',
        accent: 'bg-accent-600 hover:bg-accent-700 text-white shadow-sm hover:shadow-md'
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
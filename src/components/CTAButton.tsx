'use client'

import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-[6px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-glow',
        secondary: 'bg-secondary text-primary hover:bg-secondary/90 shadow-md hover:shadow-lg',
        ghost: 'bg-transparent hover:bg-secondary text-foreground',
        accent: 'bg-accent text-white hover:bg-accent/90 shadow-md hover:shadow-glow-sm'
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
        scale: 1.05,
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
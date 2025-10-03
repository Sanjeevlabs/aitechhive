'use client'

import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo'
import { CTAButton } from '@/components/CTAButton'

export function Hero() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-b from-white via-purple-50/20 to-pink-50/20 dark:from-[#1a1a1a] dark:via-purple-950/20 dark:to-pink-950/20 transition-theme overflow-hidden">
      {/* Subtle decorative gradient - Adobe Express style */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-transparent to-pink-100/30 dark:from-purple-900/20 dark:via-transparent dark:to-pink-900/20" />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-10"
        >
          {/* Logo with enhanced animation */}
          <motion.div
            variants={fadeInUp}
            className="mb-12"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Logo size="lg" />
          </motion.div>

          {/* Main headline with single focused message and gradient effect */}
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight bg-gradient-to-r from-foreground via-accent to-accent-secondary bg-clip-text text-transparent"
            style={{
              backgroundSize: '200% auto',
              animation: 'gradientShift 8s ease infinite'
            }}
          >
            Decode AI, One Topic at a Time
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl lg:text-3xl text-neutral-600 dark:text-neutral-300 mb-10 max-w-4xl mx-auto leading-relaxed font-light"
          >
            Get simple explanations and in-depth topics that transform complex AI concepts into clear, actionable knowledge.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="space-y-8"
          >
            <CTAButton
              href="https://newsletter.aitechhive.com/"
              variant="primary"
              size="lg"
              showArrow
              external
              className="text-xl font-medium px-10 py-5"
            >
              Start Learning for Free
            </CTAButton>

            <p className="text-neutral-500 dark:text-neutral-400 text-lg font-normal">
              Join 500+ curious minds learning AI daily
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
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
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-background transition-theme overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-accent-secondary/5 dark:from-accent/10 dark:via-background dark:to-accent-secondary/10 animated-gradient-bg opacity-50" />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-10"
        >
          {/* Logo */}
          <motion.div
            variants={fadeInUp}
            className="mb-12"
          >
            <Logo size="lg" />
          </motion.div>

          {/* Main headline with single focused message */}
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 tracking-tight"
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
              href="https://aitechhive.beehiiv.com/"
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
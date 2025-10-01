'use client'

import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo'
import { CTAButton } from '@/components/CTAButton'

export function Hero() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-background transition-theme overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-8"
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
            className="text-5xl md:text-6xl font-semibold text-foreground mb-6"
          >
            Decode AI, One Topic at a Time
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-3xl mx-auto leading-relaxed font-normal"
          >
            Get simple explanations and in-depth topics that transform complex AI concepts into clear, actionable knowledge.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="space-y-6"
          >
            <CTAButton
              href="https://aitechhive.beehiiv.com/"
              variant="primary"
              size="lg"
              showArrow
              external
              className="text-lg font-medium"
            >
              Start Learning for Free
            </CTAButton>

            <p className="text-neutral-500 dark:text-neutral-500 text-sm font-normal">
              Join 500+ curious minds learning AI daily
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
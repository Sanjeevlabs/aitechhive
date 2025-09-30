'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Logo } from '@/components/Logo'
import { CTAButton } from '@/components/CTAButton'

const headlines = [
  "Finally Understand AI",
  "AI Explained Simply", 
  "Master AI Without the Jargon",
  "Decode AI, One Topic at a Time",
  "Your AI Learning Journey Starts Here"
]

export function Hero() {
  const [currentHeadline, setCurrentHeadline] = useState(0)

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

          {/* Main headline with clean typography */}
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-6xl font-semibold text-foreground mb-6"
            key={headlines[currentHeadline]}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.05 }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              type: "spring",
              stiffness: 100
            }}
          >
            {headlines[currentHeadline]}
          </motion.h1>

          {/* Headline switcher buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            {headlines.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeadline(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentHeadline 
                    ? 'bg-neutral-800 dark:bg-neutral-200' 
                    : 'bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500'
                }`}
                aria-label={`Switch to headline ${index + 1}`}
              />
            ))}
          </motion.div>

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
              Join 500+ curious minds learning AI every week
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
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
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-primary-50/80 via-white to-accent-50/80 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-theme overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary floating element */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-primary-200/30 to-primary-300/20 dark:from-primary-800/30 dark:to-primary-900/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Secondary floating element */}
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-accent-200/30 to-accent-300/20 dark:from-accent-800/30 dark:to-accent-900/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        {/* Additional subtle elements */}
        <motion.div
          className="absolute top-3/4 left-1/2 w-32 h-32 bg-gradient-to-br from-primary-100/40 to-accent-100/40 dark:from-primary-900/20 dark:to-accent-900/20 rounded-full blur-2xl"
          animate={{
            scale: [0.8, 1.3, 0.8],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            delay: 5
          }}
        />
      </div>

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

          {/* Main headline with enhanced rotation animation */}
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 bg-clip-text text-transparent"
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
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentHeadline 
                    ? 'bg-primary-600 dark:bg-primary-400' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Switch to headline ${index + 1}`}
              />
            ))}
          </motion.div>

          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Get simple explanations and in-depth topics that transform complex AI concepts into clear, actionable knowledge.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="space-y-6"
          >
            <CTAButton
              href="https://aitechhive.beehiiv.com/"
              variant="gradient"
              size="lg"
              showArrow
              external
              className="text-lg font-semibold"
            >
              Start Learning for Free
            </CTAButton>

            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Join 500+ curious minds learning AI every week
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
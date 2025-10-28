'use client'

import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo'
import { CTAButton } from '@/components/CTAButton'

export function Hero() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden bg-white">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient-animated opacity-60" />
      
      {/* Subtle gradient orbs for depth */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-amber-200/30 via-yellow-200/20 to-orange-200/30 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-200/20 via-indigo-200/15 to-purple-200/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
      <div className="max-w-6xl mx-auto w-full relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          {/* Logo - aligned to left */}
          <motion.div
            variants={fadeInUp}
            className="mb-8"
          >
            <Logo size="lg" />
          </motion.div>

          {/* Main headline - center aligned */}
          <motion.h1 
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight text-center mx-auto max-w-4xl bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent"
            style={{ 
              lineHeight: '1.3'
            }}
          >
            Understanding How AI Actually Gets Deployed in Regulated Financial Institutions
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-normal text-center"
          >
            Working notes on how AI systems move from prototype to production inside banks and insurers — shared publicly, grounded in enterprise reality
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="space-y-4 flex flex-col items-center"
          >
            <CTAButton
              href="https://newsletter.aitechhive.com/"
              variant="accent"
              size="lg"
              showArrow
              external
              className="text-lg font-medium px-8 py-4 shadow-lg"
            >
              Join the working notes
            </CTAButton>

            <p className="text-gray-500 text-sm font-normal">
              Sunday (theory) + Wednesday (tooling)
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
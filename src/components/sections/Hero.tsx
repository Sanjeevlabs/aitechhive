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
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden" style={{
      background: 'linear-gradient(135deg, #E8F0FE 0%, #F1F3F4 50%, #FFFFFF 100%)'
    }}>
      {/* Subtle gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/10" />
      
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
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight text-gray-900 text-center mx-auto max-w-4xl"
          >
            Understanding How AI Actually Gets Deployed in Regulated Financial Institutions
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed font-normal text-center"
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
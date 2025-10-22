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
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden" style={{
      background: 'linear-gradient(135deg, #E8F0FE 0%, #F1F3F4 50%, #FFFFFF 100%)'
    }}>
      {/* Google One-style clean, subtle gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20" />
      <div className="absolute inset-0 bg-gradient-to-tl from-blue-50/10 via-transparent to-transparent" />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-10"
        >
          {/* Logo with float animation */}
          <motion.div
            variants={fadeInUp}
            className="mb-12 float-animation"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Logo size="lg" />
          </motion.div>

          {/* Main headline with Google One-style clean typography */}
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight text-gray-900 drop-shadow-sm"
          >
            Understand AI&apos;s timeless concepts. Clearly. Fully. Forever.
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-10 max-w-4xl mx-auto leading-relaxed font-normal"
          >
            From jargon-dense to crystal-clear: we break down AI concepts into actionable insight you can use.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="space-y-8"
          >
            <CTAButton
              href="https://newsletter.aitechhive.com/"
              variant="accent"
              size="lg"
              showArrow
              external
              className="text-xl font-medium px-10 py-5 shadow-2xl"
            >
              Start Learning Now
            </CTAButton>

            <p className="text-gray-600 text-lg font-normal">
              Join a hive of learners — two curated insights every week
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
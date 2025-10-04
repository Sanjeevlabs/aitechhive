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
      background: 'linear-gradient(135deg, #4F88FF 0%, #76B3FF 100%)'
    }}>
      {/* Adobe Express-style gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
      
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

          {/* Main headline with Adobe Express-style gradient */}
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight text-white drop-shadow-lg"
          >
            Hive of AI Learners — Humans, Learning Together
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-10 max-w-4xl mx-auto leading-relaxed font-light"
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
              className="text-xl font-medium px-10 py-5 bg-white text-[#4F88FF] hover:bg-white/95 shadow-2xl"
            >
              Start Learning for Free
            </CTAButton>

            <p className="text-white/80 text-lg font-normal">
              Join 500+ curious minds learning AI daily
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
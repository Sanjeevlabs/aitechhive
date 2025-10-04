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
      background: 'linear-gradient(135deg, #FFF5EB 0%, #FFEDD5 25%, #FFF9F0 50%, #FFFFFF 100%)'
    }}>
      {/* Adobe Express-style multi-layered gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-orange-50/20" />
      <div className="absolute inset-0 bg-gradient-to-tl from-orange-50/15 via-transparent to-white/10" />
      
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
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight text-slate-900 drop-shadow-sm"
          >
            The Hive of AI Learners
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl lg:text-3xl text-slate-700 mb-10 max-w-4xl mx-auto leading-relaxed font-light"
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
              className="text-xl font-medium px-10 py-5 bg-slate-900 text-white hover:bg-slate-800 shadow-2xl"
            >
              Start Learning for Free
            </CTAButton>

            <p className="text-slate-600 text-lg font-normal">
              Join a hive of curious minds learning AI daily
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
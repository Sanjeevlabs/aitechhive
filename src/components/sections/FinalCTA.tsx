'use client'

import { motion } from 'framer-motion'
import { CTAButton } from '@/components/CTAButton'

export function FinalCTA() {
  return (
    <section className="py-20 px-6 bg-white relative overflow-hidden">
      {/* Subtle gradient overlays removed for white background */}
      
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"
            style={{ color: '#D4AF37' }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Subscribe to Working Notes
          </motion.h2>
          
          <motion.p 
            className="text-base md:text-lg mb-6 leading-relaxed text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Wednesdays for tools & workflows; Sundays for governance & systems thinking. For professionals in banking, insurance and AI governance roles.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <CTAButton
              href="https://newsletter.aitechhive.com/"
              variant="accent"
              size="lg"
              showArrow
              external
              className="text-lg font-medium shadow-lg px-8 py-4"
            >
              Join the working notes
            </CTAButton>
            
            <motion.p 
              className="text-sm text-gray-500"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.8 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              Sunday (theory) + Wednesday (tooling)
            </motion.p>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-6 pt-8 text-sm text-gray-500"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">🏦</span>
              <span>UK/EU BFSI</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">📊</span>
              <span>Enterprise Focus</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">🔒</span>
              <span>Governance</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
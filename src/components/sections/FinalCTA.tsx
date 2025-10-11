'use client'

import { motion } from 'framer-motion'
import { CTAButton } from '@/components/CTAButton'

export function FinalCTA() {
  return (
    <section className="py-24 px-4 relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #E8F0FE 0%, #F1F3F4 50%, #FFFFFF 100%)'
    }}>
      {/* Google One-style clean, subtle gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20" />
      <div className="absolute inset-0 bg-gradient-to-tl from-blue-50/10 via-transparent to-transparent" />
      
      {/* Subtle decorative elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight text-gray-900"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Ready to Decode AI?
          </motion.h2>
          
          <motion.p 
            className="text-2xl md:text-3xl mb-10 max-w-4xl mx-auto leading-relaxed font-normal text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Join thousands of learners who&apos;ve transformed their understanding of AI
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <CTAButton
              href="https://newsletter.aitechhive.com/"
              variant="secondary"
              size="lg"
              showArrow
              external
              className="bg-gradient-to-r from-[#1a73e8] to-[#4285f4] text-white hover:from-[#1557b0] hover:to-[#1a73e8] hover:scale-105 text-xl font-medium shadow-2xl border-0 px-10 py-5"
            >
              Start Learning Now
            </CTAButton>
            
            <motion.p 
              className="text-base opacity-70 font-normal text-gray-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.7 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              No spam, ever. Just pure knowledge.
            </motion.p>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-8 pt-12 text-base opacity-70 text-gray-600"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">✨</span>
              <span>Active Learning Community</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xl">📚</span>
              <span>Daily Insights</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xl">🚀</span>
              <span>Career Growth</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
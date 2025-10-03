'use client'

import { motion } from 'framer-motion'
import { CTAButton } from '@/components/CTAButton'

export function FinalCTA() {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-purple-600 via-purple-500 to-purple-600 dark:from-purple-700 dark:via-purple-600 dark:to-purple-700 text-white relative overflow-hidden">
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
      
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
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Ready to Decode AI?
          </motion.h2>
          
          <motion.p 
            className="text-2xl md:text-3xl mb-10 max-w-4xl mx-auto leading-relaxed font-light text-white/90"
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
              className="bg-background text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-100 text-xl font-medium shadow-2xl border-0 px-10 py-5"
            >
              Start Learning for Free
            </CTAButton>
            
            <motion.p 
              className="text-base opacity-70 font-normal text-white"
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
            className="flex flex-wrap justify-center items-center gap-8 pt-12 text-base opacity-70 text-white"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">✨</span>
              <span>500+ Active Learners</span>
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
'use client'

import { motion } from 'framer-motion'
import { CTAButton } from '@/components/CTAButton'

export function FinalCTA() {
  return (
    <section className="py-20 px-4 bg-foreground text-background relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-semibold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Ready to Decode AI?
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 opacity-80 max-w-3xl mx-auto leading-relaxed font-normal"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.8, y: 0 }}
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
            className="space-y-6"
          >
            <CTAButton
              href="https://aitechhive.beehiiv.com/"
              variant="secondary"
              size="lg"
              showArrow
              external
              className="bg-background text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-100 text-lg font-medium shadow-lg border-0"
            >
              Start Learning for Free
            </CTAButton>
            
            <motion.p 
              className="text-sm opacity-60 font-normal"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.6 }}
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
            className="flex justify-center items-center space-x-8 pt-8 text-sm opacity-60"
          >
            <div className="flex items-center space-x-2">
              <span>✨</span>
              <span>500+ Active Learners</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📚</span>
              <span>Daily Insights</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🚀</span>
              <span>Career Growth</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
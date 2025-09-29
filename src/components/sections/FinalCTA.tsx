'use client'

import { motion } from 'framer-motion'
import { CTAButton } from '@/components/CTAButton'

export function FinalCTA() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 dark:from-primary-800 dark:via-primary-900 dark:to-accent-800 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-500"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Ready to Decode AI?
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed"
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
            className="space-y-6"
          >
            <CTAButton
              href="https://aitechhive.beehiiv.com/"
              variant="secondary"
              size="lg"
              showArrow
              external
              className="bg-white text-primary-600 hover:bg-gray-50 text-lg font-semibold shadow-2xl"
            >
              Start Learning for Free
            </CTAButton>
            
            <motion.p 
              className="text-sm opacity-75"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.75 }}
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
            className="flex justify-center items-center space-x-8 pt-8 text-sm opacity-70"
          >
            <div className="flex items-center space-x-2">
              <span>✨</span>
              <span>500+ Active Learners</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📚</span>
              <span>Weekly Insights</span>
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
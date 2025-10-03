'use client'

import { motion } from 'framer-motion'
import { LightBulbIcon } from '@heroicons/react/24/outline'

export function Solution() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-[#2a2a2a] dark:to-[#1a1a1a] transition-theme relative overflow-hidden">
      {/* Subtle decorative elements - Adobe Express inspired */}
      <div className="absolute top-10 left-20 w-40 h-40 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl animate-parallax-float" />
      <div className="absolute bottom-10 right-20 w-36 h-36 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl animate-parallax-float" style={{ animationDelay: '2s' }} />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl mb-8 shadow-lg border border-green-200 dark:border-green-800 animate-float"
            whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <LightBulbIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-foreground mb-8 tracking-tight">
            Clarity is Here
          </h2>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 space-y-8 max-w-4xl mx-auto leading-relaxed font-light"
        >
          <p>
            AITECHHIVE translates complex AI concepts into clear, digestible insights. 
            We start with simple breakdowns that anyone can understand, then offer deep dives for those ready to go further.
          </p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="glass-card p-10 rounded-2xl border-accent/20 dark:border-accent/30 shadow-glow"
          >
            <p className="text-xl md:text-2xl text-foreground font-medium">
              Every day, you&apos;ll receive one focused topic that builds your AI knowledge systematically, 
              from foundational concepts to cutting-edge developments.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
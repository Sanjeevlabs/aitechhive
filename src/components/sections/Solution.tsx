'use client'

import { motion } from 'framer-motion'
import { LightBulbIcon } from '@heroicons/react/24/outline'

export function Solution() {
  return (
    <section className="py-24 px-4 bg-background transition-theme relative">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 dark:bg-accent/20 rounded-xl mb-8 shadow-glow animate-float">
            <LightBulbIcon className="h-8 w-8 text-accent dark:text-accent" />
          </div>
          
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
            AI Tech Hive translates complex AI concepts into clear, digestible insights. 
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
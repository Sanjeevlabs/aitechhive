'use client'

import { motion } from 'framer-motion'
import { LightBulbIcon } from '@heroicons/react/24/outline'

export function Solution() {
  return (
    <section className="py-20 px-4 bg-background transition-theme">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-100 dark:bg-accent-900/20 rounded-lg mb-6">
            <LightBulbIcon className="h-6 w-6 text-accent-600 dark:text-accent-400" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-foreground mb-8">
            Clarity is Here
          </h2>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 space-y-6 max-w-3xl mx-auto leading-relaxed"
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
            className="bg-neutral-50 dark:bg-neutral-800 p-8 rounded-lg border border-neutral-200 dark:border-neutral-700"
          >
            <p className="text-foreground font-medium">
              Every week, you&apos;ll receive one focused topic that builds your AI knowledge systematically, 
              from foundational concepts to cutting-edge developments.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
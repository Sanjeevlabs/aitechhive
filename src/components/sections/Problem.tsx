'use client'

import { motion } from 'framer-motion'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export function Problem() {
  return (
    <section className="py-24 px-4 bg-secondary dark:bg-secondary transition-theme relative">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-200 dark:bg-neutral-700 rounded-xl mb-8 shadow-lg">
            <ExclamationTriangleIcon className="h-8 w-8 text-neutral-600 dark:text-neutral-300" />
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-foreground mb-8 tracking-tight">
            Tired of the Wall of Jargon?
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
            You&apos;re excited about AI, but every article feels like it&apos;s written for PhD researchers. 
            Dense technical papers, confusing acronyms, and explanations that assume you already know everything.
          </p>
          
          <motion.blockquote 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-medium text-foreground italic glass-card p-10 rounded-2xl shadow-xl"
          >
            &quot;The frustration is real: you want to understand AI&apos;s potential, but the learning curve feels impossibly steep.&quot;
          </motion.blockquote>
        </motion.div>
      </div>
    </section>
  )
}